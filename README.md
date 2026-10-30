# DevPilot

**An AI-powered command center for software projects.**

DevPilot is planned as a unified workspace for repository intelligence, project and task management, engineering analytics, security reviews, and configurable AI workflows.

> **Project status:** Foundation scaffold. This repository contains the initial application structure, not a finished product. Integrations and product modules are being developed incrementally.

## Foundation
- React 19, TypeScript and Vite frontend
- FastAPI backend
- PostgreSQL and Redis development services
- Docker Compose and VS Code Dev Container
- Initial health endpoints and backend tests
- Responsive dashboard with English/Spanish and light/dark controls
- GitHub Actions CI workflow

## Planned capabilities
- Repository intelligence and GitHub integration
- Projects, tasks, milestones and roadmaps
- Development analytics
- Security audits and findings
- Configurable AI gateway: Google AI Studio (Gemini) and OpenCode Go
- Google Workspace: Drive, Calendar, Gmail, Sheets, Tasks and Docs
- Approval-based automation and team workspaces

These capabilities are roadmap items unless explicitly listed in the Foundation section.

## Requirements
- Docker Desktop with WSL2 on Windows, or Docker Engine on Linux
- Optional: VS Code with the Dev Containers extension

## Quick start
1. Copy .env.example to .env.
2. Change the local development password in .env.
3. Run docker compose up --build.
4. Open http://localhost:5173. API documentation: http://localhost:8000/docs.

Stop with docker compose down. Running docker compose down -v also deletes the local PostgreSQL volume.

## Local development
Backend: create and activate a Python virtual environment in backend, install backend/requirements.txt, then run uvicorn app.main:app --reload from the backend directory.

Frontend: install dependencies in frontend with npm install, then run npm run dev.

## Security
Never commit .env files, OAuth secrets, access tokens, or provider API keys. Keep credentials server-side and encrypt them at rest before production integrations. Authorization and tenant isolation must be enforced by the backend. Treat repository contents and external documents as untrusted input.

## Project structure
- backend/ — FastAPI service
- frontend/ — React application
- docs/ — architecture, development plan and security checklist
- .devcontainer/ — development container configuration
- .github/workflows/ — CI workflow

## License and usage
This software is proprietary. Public visibility is for inspection only and does not grant permission to copy, modify, distribute, sublicense, or commercially exploit it without prior written permission, except where applicable law provides otherwise. See LICENSE for the copyright notice and full terms.
