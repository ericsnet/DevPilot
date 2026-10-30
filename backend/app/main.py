from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.github import router as github_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, description="Foundation API for DevPilot.", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(health_router)
app.include_router(github_router)


@app.get("/api/v1")
def api_root() -> dict[str, str]:
    return {"name": "DevPilot API", "version": "0.1.0", "status": "foundation"}
