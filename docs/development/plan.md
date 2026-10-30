# Development plan

## Foundation
- [x] Initial monorepo scaffold
- [x] React + TypeScript + Vite
- [x] FastAPI application
- [x] PostgreSQL and Redis development services
- [x] Docker Compose and Dev Container
- [x] Initial health endpoints and tests
- [ ] Verify Docker startup on Windows/WSL2
- [ ] Verify Dev Container startup
- [ ] Add Alembic migration baseline
- [ ] Add linting and formatting

## Identity and multi-tenancy
- [ ] User and linked identity models
- [ ] GitHub and Google OAuth
- [ ] Safe account linking
- [ ] Organizations, memberships, invitations
- [ ] Server-side RBAC and tenant isolation tests

## Integrations
- [ ] GitHub App and repository selection
- [ ] Direct GitHub API adapter
- [ ] Composio user connections
- [ ] Google Workspace APIs
- [ ] Credential encryption and revocation

## Product
- [ ] Repository intelligence
- [ ] Projects and Kanban
- [ ] Analytics
- [ ] Security audits
- [ ] AI Gateway: Gemini and OpenCode Go
- [ ] Approval workflow
- [ ] Automation engine

## Release
- [ ] End-to-end tests
- [ ] Secret and dependency scanning
- [ ] Accessibility review
- [ ] Production deployment and backup procedure
- [ ] Public-repository security and legal review
