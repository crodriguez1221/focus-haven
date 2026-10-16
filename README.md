# Focus Haven

**A customizable study timer designed to make focused work more enjoyable.**

Focus Haven is a browser-based productivity application that combines customizable study sessions, immersive visual themes, audio notifications, and personal study tracking.

Built with React and TypeScript, Focus Haven provides a distraction-free environment where users can manage their focus sessions and monitor their study habits over time.

### [Launch Focus Haven](https://crodriguez1221.github.io/focus-haven/)

---

## Features

### Customizable Focus Timer

- Choose from preset sessions of 5, 10, 15, 25, 30, 45, or 60 minutes.
- Set a custom session duration.
- Add 1, 3, 5, or 10 minutes to a session.
- Start, pause, and reset the timer.
- Receive an audio notification when a session finishes.

### Immersive Background Themes

Choose from three visual environments:

- **Cozy** — A warm, comfortable atmosphere.
- **Nature** — A calming, nature-inspired environment.
- **Fantasy** — An imaginative setting for focused work.

Each theme features its own background image and coordinated interface colors.

### Customizable Alarm Sounds

Select from three completion notifications:

- **Digital Beep**
- **Zen Bell**
- **Hazard Alarm**

Users can preview their selected alarm and adjust its volume.

### Study Tracking and Streaks

Focus Haven helps users build consistent study habits through:

- **Today's Focus:** Tracks accumulated study time.
- **Daily Study History:** Displays recent study activity.
- **Study Streaks:** Recognizes consecutive days with at least 15 minutes of focused study.
- **Persistent Progress:** Saves study history locally in the browser.

Study data is stored using the browser's `localStorage` API, allowing users to return to their progress without creating an account.

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| Vite | Development environment and production builds |
| CSS | Responsive styling, visual themes, and layout |
| Browser localStorage | Persistent study history |
| Git & GitHub | Version control and source management |
| GitHub Actions | Automated build and deployment |
| GitHub Pages | Static website hosting |

---

## How It Works

### Timer Management

The timer supports configurable durations and interactive controls for starting, pausing, resetting, and extending sessions.

Time calculations use JavaScript timestamps and React state to manage the displayed countdown.

### Study History

Focus Haven records accumulated study time by calendar date.

Study history is saved in browser storage so that refreshing or reopening the website does not normally erase recorded progress.

### Daily Streaks

A study day qualifies toward a streak after at least 15 minutes of accumulated focus time.

The application evaluates consecutive qualifying days to help users monitor consistency.

### Privacy

Focus Haven does not currently require user accounts or collect study data through a backend service.

Study history is stored locally in the user's browser.

Because there is no cloud synchronization, progress does not automatically transfer between browsers or devices. Clearing browser storage may also remove saved history.

---

## Getting Started

### Prerequisites

To run Focus Haven locally, install:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/crodriguez1221/focus-haven.git
```

**2. Navigate to the project directory**

```bash
cd focus-haven
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### Production Build

To generate an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

Focus Haven is deployed through **GitHub Pages** using an automated **GitHub Actions** workflow.

The deployment process:

1. Retrieves the latest project files.
2. Installs dependencies.
3. Runs the TypeScript and Vite production build.
4. Publishes the generated website files to GitHub Pages.

**Live Application:** [Launch Focus Haven](https://crodriguez1221.github.io/focus-haven/)

---

## Future Improvements

Potential enhancements include:

- Optional user accounts and cross-device synchronization.
- Study history export and import.
- Additional visual themes and notification sounds.
- Expanded study statistics and productivity insights.
- Accessibility and user experience improvements.

These are potential future enhancements rather than currently available features.

---

## Assets and Acknowledgments

- **Background Images:** AI-generated artwork.
- **Audio Notifications:** Sound effects sourced from [Pixabay](https://pixabay.com/).

Audio assets remain subject to their respective licensing terms.

---

## Project Purpose

Focus Haven was developed as a hands-on software engineering project to practice and demonstrate:

- Frontend application development with React and TypeScript.
- Interactive user interface and state management.
- Browser-based data persistence.
- Time-based application logic.
- Responsive interface design.
- Git-based version control.
- Automated deployment using GitHub Actions.

The project demonstrates the development of a functional web application from implementation through public deployment.

---

**Focus Haven — Make time for what matters.**