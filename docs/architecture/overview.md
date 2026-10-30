# Architecture overview

DevPilot starts as a modular monolith: React frontend, FastAPI backend, PostgreSQL as the system of record, and Redis for caching and asynchronous work.

Planned domains:
- Identity: users, linked identities, sessions, organizations, memberships, RBAC.
- GitHub: GitHub App installation, selected repositories, issues, pull requests, commits, releases.
- Projects: projects, tasks, milestones, roadmaps.
- AI: provider/model registry, conversations, tool permissions, approval requests.
- Integrations: Composio and direct GitHub/Google API adapters.
- Security: audit runs, findings, severity, remediation tracking.
- Automation: triggers, workflows, execution history.
- Analytics: activity events and aggregate metrics.

Initial AI providers: Google AI Studio through Gemini API and OpenCode Go through protocol-specific adapters.

Google Workspace scope: Drive, Calendar, Gmail, Sheets, Tasks, Docs.

All authorization must be enforced server-side. Organization data must be tenant-scoped. Secrets must remain server-side and be encrypted at rest. AI-generated external mutations require approval. Repository content and external documents are untrusted input.
