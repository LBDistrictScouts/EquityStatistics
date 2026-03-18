# EquityStatistics

A secure data anonymization and submission web application for [Letchworth, Baldock & Ashwell (LBD) District Scouts](https://lbd.org.uk). It collects postcode data from Scout members to analyze the socioeconomic equity and accessibility of Scouting programs, using the publicly available [Index of Multiple Deprivation (IMD)](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2019) dataset.

**Privacy first:** All data anonymization happens locally in the browser (in-memory) before anything is transmitted, ensuring GDPR compliance and full data transparency for section leaders.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the App](#running-the-app)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

Section leaders log in with their [Online Scout Manager (OSM)](https://www.onlinescoutmanager.co.uk) credentials via OAuth 2.0. The app fetches member records from OSM, extracts postcodes in the browser, and submits only the anonymized postcode list to the LBD District backend — no names, no contact details, nothing personally identifiable ever leaves the device.

The District then joins postcode data with the IMD to understand which deprivation deciles Scouts are being drawn from, helping to identify gaps in participation across the community.

---

## Features

- **OAuth 2.0 + OIDC authentication** with PKCE, using OSM as the identity provider
- **In-browser data processing** — member names and personal details are never transmitted
- **Postcode extraction with priority logic** — prefers member address, falls back to contact addresses
- **Section & term selection** — leaders choose which section and which term's data to submit
- **Transparent data labelling** — the UI clearly distinguishes data sent to the District from data that stays local
- **Responsive UI** built with React Bootstrap

---

## Tech Stack

| Category | Technology |
|---|---|
| Frontend framework | React 18 |
| Language | TypeScript 4.9 |
| Build tool | Create React App |
| UI | React Bootstrap 2 / Bootstrap 5 |
| Icons | Font Awesome 6 |
| Authentication | [oauth4webapi](https://github.com/panva/oauth4webapi) (OAuth 2.0 / OIDC) |
| Styling | SCSS |
| Testing | Jest + React Testing Library |

---

## Prerequisites

- **Node.js** v14 or later (LTS recommended)
- **npm** (bundled with Node.js) or **yarn**
- An OSM OAuth client ID and a configured redirect URI (contact the District IT lead if you need credentials for local development)

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/LBDistrictScouts/EquityStatistics.git
cd EquityStatistics

# 2. Install dependencies
npm install
```

> **Font Awesome Pro tokens:** The project uses Font Awesome via a private npm registry. If your `.npmrc` is not already configured with a valid token, the install step will fail. Contact the District IT lead for the registry token.

---

## Environment Configuration

Copy the example `.env` file and fill in the required values:

```bash
cp .env .env.local
```

| Variable | Description |
|---|---|
| `REACT_APP_MANIFEST_URL` | URL of the District auth manifest endpoint |
| `REACT_APP_ISSUER_URL` | OAuth 2.0 issuer URL (OSM) |
| `REACT_APP_CLIENT_ID` | Your OSM OAuth client ID |
| `REACT_APP_REDIRECT_URI` | The URI OSM will redirect to after login (e.g. `https://localhost:3000`) |
| `REACT_APP_SCOPE` | OAuth scopes to request (e.g. `section:member:read`) |
| `REACT_APP_SUBMIT_URL` | URL of the District data submission endpoint |

> **Note:** Never commit `.env.local` or any file containing a real `REACT_APP_CLIENT_ID` to source control.

---

## Running the App

```bash
npm start
```

Opens the app in development mode at `http://localhost:3000`. The page hot-reloads on file changes.

> **HTTPS note:** Create React App starts on HTTP by default, but OSM requires an HTTPS redirect URI for OAuth to work. For local development, set `REACT_APP_REDIRECT_URI` to `https://localhost:3000` and front the dev server with a local HTTPS proxy (e.g. [mkcert](https://github.com/FiloSottile/mkcert)).

---

## Running Tests

```bash
# Interactive watch mode
npm test

# Single run with coverage report
npm test -- --coverage --watchAll=false
```

---

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder. Deploy the contents of that folder to any static hosting service (e.g. Netlify, Vercel, AWS S3 + CloudFront).

---

## Architecture

The application is a React single-page application (SPA). All sensitive processing is intentionally client-side:

```
OSM API  ──►  authenticate.ts  (OAuth 2.0 PKCE)
                    │
                    ▼
             osm-data.ts  (fetch & anonymize member data in-browser)
                    │
                    ▼
           district-data.ts  (submit anonymized postcodes only)
                    │
                    ▼
         LBD District backend
```

### Key source files

| File | Responsibility |
|---|---|
| `src/App.tsx` | Root component — composes all page sections |
| `src/components/Audit/OsmAudit.tsx` | Main audit workflow UI |
| `src/components/Audit/authenticate.ts` | OAuth 2.0 + OIDC authentication, token management |
| `src/components/Audit/osm-data.ts` | Fetches OSM member data, extracts & validates postcodes |
| `src/components/Audit/district-data.ts` | Submits anonymized data to the District backend |
| `src/utilities.ts` | Shared helpers (cookies, type guards, JSON types) |

---

## Data Flow

1. **Login** — the leader clicks "Sign in with OSM"; the app performs an OAuth 2.0 PKCE authorization code flow.
2. **Fetch** — authenticated requests are made to the OSM API to retrieve member records for the selected section and term.
3. **Process** — postcodes are extracted from member records in the browser. No names or contact details are stored or transmitted.
4. **Review** — the leader reviews which members are included and can deselect individuals before submission.
5. **Submit** — the anonymized postcode list, plus the section name and term, is sent to the District backend.

---

## Project Structure

```
EquityStatistics/
├── public/                  # Static assets & HTML entry point
├── src/
│   ├── App.tsx              # Root component
│   ├── utilities.ts         # Shared utilities
│   └── components/
│       ├── Audit/           # Core authentication & data submission logic
│       ├── Contact/         # Contact section
│       ├── Explaination/    # Purpose & methodology explanation
│       ├── Footer/          # Page footer
│       ├── Header/          # Page header
│       ├── Layout/          # Layout wrapper (Bootstrap, fonts)
│       ├── Navbar/          # Navigation bar
│       └── Process/         # Step-by-step process explanation
├── .env                     # Environment variable template
├── package.json
└── tsconfig.json
```

---

## Contributing

1. Fork the repository and create a feature branch (`git checkout -b feature/my-change`).
2. Make your changes and ensure tests pass (`npm test`).
3. Open a pull request against `main` with a clear description of the change.

For questions or access to development credentials, contact the LBD District IT lead.
