# Integración con GitHub

DevPilot implementa OAuth en el backend. El frontend de GitHub Pages nunca recibe el client secret ni el access token de GitHub.

## Alcance actual

- Autorizar una cuenta GitHub con OAuth.
- Mantener el token en Redis y entregar al navegador únicamente una cookie de sesión HttpOnly.
- Consultar el perfil y los repositorios públicos propios.
- Desconectar la cuenta y eliminar la sesión del servidor.

El alcance inicial solicita únicamente `read:user`. No se solicitan permisos para repositorios privados ni permisos de escritura. Para repositorios privados o acciones de escritura, se recomienda diseñar una GitHub App con permisos granulares y autorización por instalación, en lugar de ampliar innecesariamente el OAuth scope.

## Configuración necesaria

1. Despliega el backend FastAPI y Redis en un host HTTPS.
2. Crea una OAuth App en GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
3. Configura la callback URL como:
   `https://TU_API_HOST/api/v1/integrations/github/callback`
4. Configura estas variables en el entorno del backend (no en Git ni en variables `VITE_*`):
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_REDIRECT_URI`
   - `FRONTEND_URL=https://ericsnet.github.io/DevPilot`
   - `CORS_ORIGINS=https://ericsnet.github.io`
   - `GITHUB_COOKIE_SECURE=true`
   - `GITHUB_COOKIE_SAMESITE=none`
5. En GitHub → Settings → Secrets and variables → Actions → Variables, crea `VITE_API_BASE_URL` con el origen HTTPS del backend, por ejemplo `https://api.example.com`.
6. Ejecuta de nuevo el workflow de GitHub Pages.

Para desarrollo local, copia las variables de `.env.example`, registra una OAuth App con callback `http://localhost:8000/api/v1/integrations/github/callback` y usa `GITHUB_COOKIE_SECURE=false`, `GITHUB_COOKIE_SAMESITE=lax`.

## Endpoints

- `GET /api/v1/integrations/github/connect` — inicia OAuth.
- `GET /api/v1/integrations/github/callback` — valida state, intercambia el código y crea la sesión.
- `GET /api/v1/integrations/github/status` — estado de la sesión.
- `GET /api/v1/integrations/github/repositories` — lista repositorios públicos propios.
- `POST /api/v1/integrations/github/disconnect` — elimina la sesión.

## Seguridad y despliegue

- No publiques nunca el client secret ni tokens.
- Usa HTTPS en producción y Redis con acceso privado y cifrado en tránsito.
- Configura el CORS con el origen exacto de GitHub Pages; no uses `*` junto con cookies.
- La cookie de sesión es HttpOnly, Secure en producción y SameSite=None cuando frontend y backend están en dominios distintos.
- El token se mantiene en Redis con una caducidad de 30 días; la cookie tiene la misma duración.
- La configuración actual no implementa renovación automática del token. Si GitHub invalida el token, vuelve a autorizar.
- Limita el acceso de red a Redis y no expongas su puerto públicamente.
