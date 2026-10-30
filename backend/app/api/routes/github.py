import json
import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Cookie, HTTPException, Response
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.redis_client import client as redis_client

router = APIRouter(prefix="/api/v1/integrations/github", tags=["integrations"])

STATE_TTL_SECONDS = 600
SESSION_TTL_SECONDS = 60 * 60 * 24 * 30
SESSION_COOKIE = "devpilot_github_session"
GITHUB_API = "https://api.github.com"


def _frontend_redirect(result: str) -> str:
    return f"{settings.frontend_url.rstrip('/')}/?github={result}"


def _session_key(session_id: str) -> str:
    return f"devpilot:github:session:{session_id}"


@router.get("/connect")
def connect_github():
    if not settings.github_client_id or not settings.github_client_secret or not settings.github_redirect_uri:
        raise HTTPException(status_code=503, detail="GitHub OAuth is not configured on the server")
    state = secrets.token_urlsafe(32)
    redis_client.setex(f"devpilot:github:oauth-state:{state}", STATE_TTL_SECONDS, "pending")
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": settings.github_redirect_uri,
        "scope": "read:user",
        "state": state,
        "allow_signup": "true",
    }
    return RedirectResponse("https://github.com/login/oauth/authorize?" + urlencode(params), status_code=302)


@router.get("/callback")
def github_callback(code: str | None = None, state: str | None = None, error: str | None = None):
    if error:
        return RedirectResponse(_frontend_redirect("denied"), status_code=302)
    if not code or not state:
        return RedirectResponse(_frontend_redirect("invalid"), status_code=302)

    state_key = f"devpilot:github:oauth-state:{state}"
    if redis_client.get(state_key) != "pending":
        return RedirectResponse(_frontend_redirect("invalid"), status_code=302)
    redis_client.delete(state_key)

    try:
        with httpx.Client(timeout=15.0) as http:
            token_response = http.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                json={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                    "redirect_uri": settings.github_redirect_uri,
                    "state": state,
                },
            )
            token_response.raise_for_status()
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            if not access_token or token_data.get("error"):
                return RedirectResponse(_frontend_redirect("failed"), status_code=302)

            user_response = http.get(
                f"{GITHUB_API}/user",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"},
            )
            user_response.raise_for_status()
            profile = user_response.json()
    except (httpx.HTTPError, ValueError):
        return RedirectResponse(_frontend_redirect("failed"), status_code=302)

    session_id = secrets.token_urlsafe(32)
    session_data = {
        "access_token": access_token,
        "login": profile.get("login", ""),
        "name": profile.get("name"),
        "avatar_url": profile.get("avatar_url"),
        "html_url": profile.get("html_url"),
    }
    redis_client.setex(_session_key(session_id), SESSION_TTL_SECONDS, json.dumps(session_data))

    response = RedirectResponse(_frontend_redirect("connected"), status_code=302)
    response.set_cookie(
        key=SESSION_COOKIE,
        value=session_id,
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        secure=settings.github_cookie_secure,
        samesite=settings.github_cookie_samesite,
        path="/",
    )
    return response


@router.get("/status")
def github_status(devpilot_github_session: str | None = Cookie(default=None)):
    if not devpilot_github_session:
        return {"connected": False}
    raw = redis_client.get(_session_key(devpilot_github_session))
    if not raw:
        return {"connected": False}
    session = json.loads(raw)
    return {
        "connected": True,
        "account": {
            "login": session.get("login"),
            "name": session.get("name"),
            "avatar_url": session.get("avatar_url"),
            "html_url": session.get("html_url"),
        },
    }


@router.get("/repositories")
def github_repositories(devpilot_github_session: str | None = Cookie(default=None)):
    if not devpilot_github_session:
        raise HTTPException(status_code=401, detail="GitHub account is not connected")
    raw = redis_client.get(_session_key(devpilot_github_session))
    if not raw:
        raise HTTPException(status_code=401, detail="GitHub session has expired")
    session = json.loads(raw)
    try:
        with httpx.Client(timeout=15.0) as http:
            response = http.get(
                f"{GITHUB_API}/users/{session['login']}/repos",
                params={"type": "owner", "sort": "updated", "per_page": 100},
                headers={"Authorization": f"Bearer {session['access_token']}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"},
            )
            response.raise_for_status()
            repositories = response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="GitHub API request failed") from exc

    return {
        "repositories": [
            {
                "id": repo["id"],
                "name": repo["name"],
                "full_name": repo["full_name"],
                "description": repo.get("description"),
                "html_url": repo["html_url"],
                "private": repo["private"],
                "language": repo.get("language"),
                "stargazers_count": repo.get("stargazers_count", 0),
                "updated_at": repo.get("updated_at"),
                "default_branch": repo.get("default_branch"),
            }
            for repo in repositories
        ]
    }


@router.post("/disconnect")
def disconnect_github(response: Response, devpilot_github_session: str | None = Cookie(default=None)):
    if devpilot_github_session:
        redis_client.delete(_session_key(devpilot_github_session))
    response.delete_cookie(
        key=SESSION_COOKIE,
        path="/",
        secure=settings.github_cookie_secure,
        httponly=True,
        samesite=settings.github_cookie_samesite,
    )
    return {"connected": False}
