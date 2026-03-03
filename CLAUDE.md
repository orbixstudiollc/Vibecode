# Vibecode — Lead Generation Platform

## Overview

Vibecode is a single-page lead generation and CRM platform built for managing sales pipelines, outreach campaigns, and lead capture. The app uses a dark theme with neon accent colors (#D4FF00 primary, #00D4FF secondary) and a grid overlay background.

## Tech Stack

- **Framework**: React 19 + Vite 7 (JSX, no TypeScript)
- **Routing**: react-router-dom v7 (BrowserRouter in `main.jsx`)
- **State**: localStorage via `src/utils/leadStore.js` (no external state library)
- **Styling**: Vanilla CSS (`App.css`, `index.css`) — dark theme, no CSS framework
- **Build**: `npm run dev` (Vite dev server on port 5173), `npm run build` (production to `dist/`)
- **Linting**: ESLint 9 with react-hooks and react-refresh plugins
- **Testing**: jsdom + Playwright available (devDependencies)

## Project Structure

```
src/
├── main.jsx                  # Entry point, BrowserRouter wrapper
├── App.jsx                   # Route definitions + HomePage component
├── App.css / index.css       # All styles (dark theme)
├── components/
│   ├── Navbar.jsx            # Top nav with page links + "New Lead" CTA
│   ├── GridOverlay.jsx       # Background grid effect
│   ├── HeroSection.jsx       # Landing page hero
│   ├── ConverterCard.jsx     # Currency converter widget (homepage)
│   └── ConfirmModal.jsx      # Transaction confirmation modal
├── pages/
│   ├── LeadDashboard.jsx     # /dashboard — Stats overview, stage breakdown, recent activity
│   ├── LeadList.jsx          # /leads — Searchable/filterable lead table with bulk actions
│   ├── LeadForm.jsx          # /leads/new, /leads/:id/edit — Create/edit lead form
│   ├── LeadDetail.jsx        # /leads/:id — Single lead view with notes/history
│   ├── LeadPipeline.jsx      # /pipeline — Drag-and-drop Kanban board by stage
│   ├── OutreachPanel.jsx     # /outreach — Email campaign management with templates
│   └── LeadCapture.jsx       # /capture — Public-facing lead intake form
└── utils/
    ├── leadStore.js          # All data operations (CRUD, scoring, CSV export, demo seed)
    └── emailTemplates.js     # Outreach email templates with {{variable}} interpolation
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Landing page with converter widget |
| `/dashboard` | LeadDashboard | KPI stats, stage pipeline chart, recent leads, activity feed |
| `/leads` | LeadList | Full lead table with search, filter, sort, bulk delete |
| `/leads/new` | LeadForm | Create new lead |
| `/leads/:id` | LeadDetail | View lead details, notes, edit/delete actions |
| `/leads/:id/edit` | LeadForm | Edit existing lead |
| `/pipeline` | LeadPipeline | Kanban board — drag leads between 7 stages |
| `/outreach` | OutreachPanel | Create/send email campaigns using templates |
| `/capture` | LeadCapture | Embeddable lead capture form |

## Data Model

All data lives in localStorage under these keys:

- `vibecode_leads` — Lead records with: id, name, email, phone, company, stage, source, budget, score, tags, notes, outreachCount, timestamps
- `vibecode_campaigns` — Outreach campaigns with: id, name, templateId, status, sent/opened/replied counts, lead IDs
- `vibecode_activities` — Activity log (capped at 200 entries)

### Lead Stages (pipeline order)
`new` → `contacted` → `qualified` → `proposal` → `negotiation` → `closed_won` / `closed_lost`

### Lead Sources
`website`, `referral`, `linkedin`, `cold_email`, `cold_call`, `event`, `social_media`, `other`

### Lead Scoring
Computed in `scoreLead()` — points for: email (+10), phone (+10), company (+15), budget (10–30), source type (10–15), outreach activity (+5), advanced stage (10–20). Capped at 100.

## Key Conventions

- **No backend** — All persistence is client-side localStorage
- **No TypeScript** — Pure JSX throughout
- **Component pattern** — Pages are in `src/pages/`, reusable UI in `src/components/`
- **Data access** — Always import from `leadStore.js`, never read localStorage directly in components
- **Demo data** — `seedDemoLeads()` runs on dashboard load, seeds 8 sample leads if store is empty
- **Stage colors** — Each pipeline stage has a consistent neon color defined in both `LeadDashboard.jsx` and `LeadPipeline.jsx`
- **CSV export** — `downloadCSV()` in leadStore generates and triggers a browser download

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```
