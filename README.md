
# Focus Haven

**Find your space. Find your focus.**

A customizable focus timer and study productivity application built with React, TypeScript, and Vite.

Focus Haven combines immersive visual environments, flexible countdown timers, customizable completion alarms, and browser-based study tracking. The project explores frontend application architecture, time-based state management, persistent client-side data, and user-centered interface design.

> **Project status:** Active development. A public live demo is planned.

## Application Preview

_Screenshot coming soon._

## Live Demo

**Coming soon.** Focus Haven is being prepared for deployment through GitHub Pages.

## Features

### Focus Timer

- Preset study sessions: 5, 10, 15, 25, 30, 45, and 60 minutes
- Custom session durations
- Start, pause, resume, and reset controls
- Add 1, 3, 5, or 10 minutes to a session

### Customizable Environments

- Cozy, nature, and fantasy-inspired background themes
- Theme selection without interrupting the study interface

### Completion Alarms

- Three selectable MP3 alarms
- Adjustable alarm volume
- Alarm preview controls

### Study Progress

- Daily focus-time totals
- Seven-day study history
- Consecutive-day streaks based on a 15-minute daily goal
- Browser `localStorage` persistence

## Technology Stack

| Technology | Purpose |
| --- | --- |
| React | Component-based interface and application state |
| TypeScript | Static typing and maintainable application logic |
| Vite | Development server and production build tooling |
| CSS | Layout, visual themes, and responsive styling |
| localStorage | Browser-based persistence of study history |
| HTML Audio API | Completion alarm playback and volume control |

## Technical Implementation

### Timer State and Elapsed Time

The countdown timer uses React state for interface updates and references to manage timing information. Session controls support pausing, resuming, resetting, and extending a countdown.

### Daily Study History

Study time is organized by local calendar date and stored as milliseconds in browser `localStorage`. The implementation accounts for sessions that cross midnight by assigning elapsed time to the corresponding dates.

### Study Streaks

Daily totals are evaluated against a 15-minute study goal. The streak calculation considers consecutive qualifying days and preserves an ongoing streak when the current day has not yet reached the goal.

### Browser-Based Audio

Completion alarms use browser audio playback, with user-selectable sounds, volume settings, and preview controls. Browser autoplay restrictions and audio behavior remain part of ongoing testing.

## Architecture and Design Decisions

- **Client-side first:** The initial application does not require accounts, a backend, or a database.
- **Local persistence:** Study history stays in the user's browser rather than being uploaded to a remote service.
- **Separation of concerns:** Timer behavior, study-history calculations, and interface presentation are implemented using React, TypeScript, and CSS.
- **Incremental development:** Features are added and refined through testing, debugging, and version-controlled changes.

## Getting Started

### Prerequisites

- Node.js and npm
- A modern web browser

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/crodriguez1221/focus-haven.git
   ```

2. Open the project directory:

   ```bash
   cd focus-haven
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed by Vite, typically `http://localhost:5173/`.

### Production Build

```bash
npm run build
```

The generated production files are placed in `dist/`.

## Privacy and Security Considerations

Focus Haven currently operates without user accounts or a remote database. Study-history data is stored locally in the browser.

- No account credentials are required to use the timer.
- Study history is not synchronized between devices.
- Browser storage can be cleared or modified by the user and is not considered tamper-proof.
- Frontend source code and publicly served assets are visible to website visitors.
- Production deployment and dependency security reviews are planned before public release.

The application is not presented as security-audited or production-hardened.

## Known Limitations

- Study history is specific to the browser and device where it was recorded.
- Clearing browser data can remove saved study history.
- Timer behavior during browser suspension, device sleep, and background execution requires additional testing.
- A public deployment has not yet been completed.

## Development Roadmap

- [ ] Complete timer and study-history reliability testing
- [ ] Improve mobile responsiveness and accessibility
- [ ] Review dependencies and publicly distributed assets
- [ ] Add application screenshots and demonstration media
- [ ] Deploy a live website using GitHub Pages
- [ ] Explore study analytics and progress visualizations
- [ ] Evaluate Progressive Web App (PWA) support

## Project Purpose

Focus Haven is an independently developed portfolio project focused on practical frontend engineering and application design.

The project demonstrates experience with React and TypeScript development, event-driven interfaces, browser APIs, persistent data, date-based calculations, debugging, and iterative software improvement.

## License

No open-source license has been selected. All rights reserved unless otherwise stated. Background images and audio assets may be subject to separate licensing terms.
