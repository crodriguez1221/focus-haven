# Focus Haven

**A customizable study timer designed to help users stay focused, build consistent study habits, and track their progress.**

[Live Application](https://crodriguez1221.github.io/focus-haven/)

---

## Overview

Focus Haven is a responsive, browser-based study timer built with **React, TypeScript, and Vite**.

The application combines customizable study sessions, immersive visual themes, original synthesized alarm sounds, and study-progress tracking in a single interface.

I developed Focus Haven as a practical productivity application and a portfolio project to strengthen my skills in front-end development, TypeScript, React state management, browser APIs, and automated deployment.

## Features

### Customizable Study Timer

- Select a preset study duration or enter a custom time.
- Start, pause, and reset study sessions.
- Adjust the remaining time during a session.
- Receive an audible notification when a timer finishes.

### Visual Themes

Choose from three visual environments:

- **Cozy** — A comfortable atmosphere for focused studying.
- **Nature** — A calming, nature-inspired environment.
- **Fantasy** — An imaginative setting for a more immersive experience.

### Custom Alarm System

Focus Haven includes three original alarm sounds generated programmatically using the **Web Audio API**:

- **Digital Beep** — A simple electronic notification.
- **Zen Bell** — A softer, layered bell-like sound.
- **Hazard Alarm** — A modulated, harmonically rich electronic warning tone.

Users can select an alarm, preview it, and adjust its volume.

The sounds are synthesized directly in the browser using oscillators, gain nodes, frequency adjustments, and audio envelopes rather than relying on prerecorded audio files.

### Study Progress Tracking

- Record completed study time.
- View study history.
- Track consecutive days of studying.
- Build a study streak by completing at least 15 minutes of study time per day.

Study information is stored locally in the browser using `localStorage`, allowing progress to persist across page reloads without requiring an account or external database.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React | Component-based user interface and state management |
| TypeScript | Type-safe application logic |
| Vite | Development environment and production builds |
| CSS | Responsive styling and visual presentation |
| Web Audio API | Programmatically generated alarm sounds |
| localStorage | Browser-based persistence of study data |
| Git & GitHub | Version control and source code management |
| GitHub Actions | Automated build and deployment |
| GitHub Pages | Static website hosting |

## Technical Highlights

### Timer State Management

Implemented timer controls and session-completion behavior using React hooks and TypeScript.

The application manages timer state, user interactions, alarm preferences, and study-session transitions.

### Browser-Based Audio Synthesis

Developed a custom audio system using the Web Audio API.

The implementation uses multiple oscillator waveforms, layered frequencies, gain envelopes, and modulation to create distinct alarm sounds without depending on external audio recordings.

### Persistent Study Statistics

Implemented browser-based data persistence using `localStorage` to maintain study history and streak information across visits.

### Automated Deployment

Configured a GitHub Actions workflow to build the Vite application and deploy the production files to GitHub Pages.

## Getting Started

To run Focus Haven locally, you will need **Node.js and npm** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/crodriguez1221/focus-haven.git
```

### 2. Navigate to the Project Directory

```bash
cd focus-haven
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 5. Build for Production

```bash
npm run build
```

The production build will be generated in the `dist` directory.

## Project Structure

```text
focus-haven/
├── public/
├── src/
│   ├── audio/
│   │   ├── digitalBeep.ts
│   │   ├── hazardAlarm.ts
│   │   └── zenBell.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
└── README.md
```

*This is a simplified view highlighting the application's main source files and deployment configuration.*

## Future Improvements

Potential enhancements include:

- Additional customizable study themes.
- More timer and alarm customization options.
- Expanded study analytics and visual progress reports.
- Optional data export and import.
- Additional accessibility and usability improvements.

## What I Learned

Developing Focus Haven provided hands-on experience with:

- Building an interactive single-page application with React and TypeScript.
- Managing application state and timer-related behavior.
- Working with browser APIs for audio generation and data persistence.
- Organizing reusable functionality into separate TypeScript modules.
- Debugging runtime errors and validating application behavior.
- Configuring automated deployment with GitHub Actions.
- Iteratively improving a working application based on usability and design goals.

## Live Demo

**[Launch Focus Haven](https://crodriguez1221.github.io/focus-haven/)**

---

Focus Haven is an independently developed portfolio project demonstrating practical front-end development, browser API integration, and deployment skills.