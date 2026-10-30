# DevPilot

**Un centro de control con IA para proyectos de software.**

DevPilot está planteado como un espacio de trabajo unificado para analizar repositorios, gestionar proyectos y tareas, consultar métricas de ingeniería, revisar la seguridad y configurar flujos de trabajo con IA.

> **Estado del proyecto:** scaffold de la foundation. Este repositorio contiene la estructura inicial de la aplicación; no es todavía un producto terminado. Las integraciones y los módulos funcionales se desarrollarán progresivamente.

## Base técnica actual

- Frontend con React 19, TypeScript y Vite.
- Backend con FastAPI.
- PostgreSQL y Redis para el entorno de desarrollo.
- Docker Compose y Dev Container de VS Code.
- Endpoints iniciales de estado y pruebas del backend.
- Dashboard adaptable con controles de idioma (inglés/español) y tema claro/oscuro.
- Integración inicial de CI con GitHub Actions.

## Funcionalidades previstas

- Inteligencia de repositorios e integración con GitHub.
- Proyectos, tareas, hitos y hojas de ruta.
- Analíticas de desarrollo.
- Auditorías de seguridad y seguimiento de hallazgos.
- Pasarela de IA configurable: Google AI Studio (Gemini) y OpenCode Go.
- Google Workspace: Drive, Calendar, Gmail, Sheets, Tasks y Docs.
- Automatizaciones con aprobación y espacios de trabajo para equipos.

Estas funcionalidades forman parte de la hoja de ruta; no deben considerarse implementadas salvo que aparezcan expresamente en la sección de base técnica actual.

## Requisitos

- Docker Desktop con WSL2 en Windows, o Docker Engine en Linux.
- Opcional: VS Code con la extensión Dev Containers.

## Inicio rápido

1. Copia `.env.example` a `.env`.
2. Cambia la contraseña local de desarrollo en `.env`.
3. Ejecuta `docker compose up --build`.
4. Abre http://localhost:5173. La documentación de la API está en http://localhost:8000/docs.

Para detener los servicios, ejecuta `docker compose down`. Ten en cuenta que `docker compose down -v` también elimina el volumen local de PostgreSQL.

## Desarrollo local

**Backend:** crea y activa un entorno virtual de Python dentro de `backend`, instala `backend/requirements.txt` y ejecuta `uvicorn app.main:app --reload` desde ese directorio.

**Frontend:** instala las dependencias dentro de `frontend` con `npm install` y arranca Vite con `npm run dev`.

## Seguridad

No subas archivos `.env`, secretos OAuth, tokens de acceso ni claves de API. Las credenciales deben permanecer en el servidor y cifrarse en reposo antes de integrar servicios en producción. La autorización y el aislamiento entre organizaciones deben aplicarse en el backend. El contenido de repositorios y los documentos externos deben tratarse como datos no confiables.

## Estructura del proyecto

- `backend/` — servicio FastAPI.
- `frontend/` — aplicación React.
- `docs/` — arquitectura, plan de desarrollo y checklist de seguridad.
- `.devcontainer/` — configuración del contenedor de desarrollo.
- `.github/workflows/` — flujos de CI y despliegue.

## Licencia y uso

Copyright (c) 2026 ericsnet. Todos los derechos reservados. La visibilidad pública del repositorio permite inspeccionar el código, pero no concede permiso para copiarlo, modificarlo, distribuirlo, sublicenciarlo ni explotarlo comercialmente sin autorización previa por escrito, salvo los derechos que la legislación aplicable no permita restringir. Consulta el archivo LICENSE.
