
import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { playDigitalBeep } from './audio/digitalBeep'
import { playZenBell } from './audio/zenBell'
import { playHazardAlarm } from './audio/hazardAlarm'

// =====================================
// TYPES AND SETTINGS
// =====================================

type Theme = 'cozy' | 'nature' | 'fantasy'
type AlarmSound = 'digital' | 'zen' | 'hazard'
type StudyHistory = Record<string, number>

const STORAGE_KEY = 'focus-haven-study-history-v1'
const STREAK_GOAL_MINUTES = 15

const timerPresets = [5, 10, 15, 25, 30, 45, 60]
const addTimeOptions = [1, 3, 5, 10]

const themeNames: Record<Theme, string> = {
    cozy: 'Cozy Study',
    nature: 'Nature Escape',
    fantasy: 'Dreamy Fantasy'
}

const alarmSounds: Record<AlarmSound, { name: string }> = {
    digital: { name: 'Digital Beep' },
    zen: { name: 'Zen Bell' },
    hazard: { name: 'Hazard Alarm' },
}

// =====================================
// DATE AND HISTORY HELPERS
// =====================================

// Use LOCAL dates, not UTC dates.
// This ensures the daily reset follows your computer's midnight.
function dateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function shiftDate(date: Date, days: number): Date {
    const result = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )

    result.setDate(result.getDate() + days)
    return result
}

function readHistory(): StudyHistory {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) return {}

        const parsed: unknown = JSON.parse(saved)

        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            return {}
        }

        const history: StudyHistory = {}

        for (const [key, value] of Object.entries(parsed)) {
            if (
                /^\d{4}-\d{2}-\d{2}$/.test(key) &&
                typeof value === 'number' &&
                Number.isFinite(value) &&
                value >= 0
            ) {
                history[key] = value
            }
        }

        return history
    } catch {
        return {}
    }
}

// Split focus time across calendar days when a session
// crosses midnight.
function addFocusedTime(
    history: StudyHistory,
    startMs: number,
    endMs: number
): StudyHistory {
    if (endMs <= startMs) return history

    const updated = { ...history }
    let cursor = startMs

    while (cursor < endMs) {
        const currentDate = new Date(cursor)
        const key = dateKey(currentDate)

        const nextMidnight = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
        ).getTime()

        const segmentEnd = Math.min(endMs, nextMidnight)

        updated[key] = (updated[key] ?? 0) +
            (segmentEnd - cursor)

        cursor = segmentEnd
    }

    return updated
}

function calculateStreak(
    history: StudyHistory,
    today: Date
): number {
    const goalMs = STREAK_GOAL_MINUTES * 60 * 1000

    let cursor = shiftDate(today, 0)

    // An unfinished day does not break yesterday's streak.
    if ((history[dateKey(cursor)] ?? 0) < goalMs) {
        cursor = shiftDate(cursor, -1)
    }

    let streak = 0

    while ((history[dateKey(cursor)] ?? 0) >= goalMs) {
        streak += 1
        cursor = shiftDate(cursor, -1)
    }

    return streak
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return (
        `${String(minutes).padStart(2, '0')}:` +
        `${String(remainingSeconds).padStart(2, '0')}`
    )
}

function formatFocusMinutes(milliseconds: number): string {
    const minutes = milliseconds / 60000

    if (minutes === 0) return '0'

    // Show tenths for short sessions so progress is visible.
    if (minutes < 10) return minutes.toFixed(1)

    return Math.floor(minutes).toString()
}

// =====================================
// APPLICATION
// =====================================

function App() {

    // ATMOSPHERE
    const [theme, setTheme] = useState<Theme>('cozy')
    const [themeMenuOpen, setThemeMenuOpen] = useState(false)

    // TIMER
    const [selectedMinutes, setSelectedMinutes] = useState(25)
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [customMinutes, setCustomMinutes] = useState('')

    // ALARM
    const [alarmMenuOpen, setAlarmMenuOpen] = useState(false)
    const [alarmSound, setAlarmSound] = useState<AlarmSound>('zen')
    const [alarmVolume, setAlarmVolume] = useState(60)
    const [alarmError, setAlarmError] = useState('')

    // STUDY PROGRESS
    const [history, setHistory] = useState<StudyHistory>(readHistory)
    const [currentDate, setCurrentDate] = useState(() => new Date())

    // Refs keep accurate timer information between renders.
    const remainingMsRef = useRef(25 * 60 * 1000)
    const runningRef = useRef(false)
    const lastTickRef = useRef<number | null>(null)
    const historyRef = useRef(history)

    const alarmSoundRef = useRef(alarmSound)
    const alarmVolumeRef = useRef(alarmVolume)

    // Keep alarm settings current for the countdown callback.
    useEffect(() => {
        alarmSoundRef.current = alarmSound
        alarmVolumeRef.current = alarmVolume
    }, [alarmSound, alarmVolume])

    // =====================================
    // SAVE STUDY HISTORY
    // =====================================

    const saveHistory = useCallback((updated: StudyHistory) => {
        historyRef.current = updated
        setHistory(updated)

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updated)
            )
        } catch (error) {
            console.error('Unable to save study history:', error)
        }
    }, [])

    // =====================================
    // ALARM FUNCTIONS
    // =====================================

    const stopAlarm = useCallback(() => {
        // Web Audio playback will be given stop support next.
    }, [])

    const playAlarm = useCallback((
        sound: AlarmSound,
        volume: number
    ) => {
        setAlarmError('')

        if (volume === 0) return

        const normalizedVolume = volume / 100

        let playback: Promise<void>

        switch (sound) {
            case 'digital':
                playback = playDigitalBeep(normalizedVolume)
                break

            case 'zen':
                playback = playZenBell(normalizedVolume)
                break

            case 'hazard':
                playback = playHazardAlarm(normalizedVolume)
                break
        }

        void playback.catch(error => {
            console.error('Alarm playback failed:', error)
            setAlarmError(
                'The alarm could not play. Check your browser audio settings.'
            )
        })
    }, [])

    // =====================================
    // ACCURATE TIMER AND FOCUS TRACKING
    // =====================================

    const advanceTimer = useCallback((now: number) => {
        if (!runningRef.current || lastTickRef.current === null) {
            return
        }

        const start = lastTickRef.current
        const elapsed = Math.max(0, now - start)

        if (elapsed === 0) return

        // Never credit more time than remains on the timer.
        const creditedMs = Math.min(
            elapsed,
            remainingMsRef.current
        )

        if (creditedMs > 0) {
            const updatedHistory = addFocusedTime(
                historyRef.current,
                start,
                start + creditedMs
            )

            saveHistory(updatedHistory)
        }

        remainingMsRef.current = Math.max(
            0,
            remainingMsRef.current - elapsed
        )

        lastTickRef.current = now

        setTimeLeft(
            Math.ceil(remainingMsRef.current / 1000)
        )

        setCurrentDate(new Date(now))

        if (remainingMsRef.current === 0) {
            runningRef.current = false
            lastTickRef.current = null
            setIsRunning(false)

            playAlarm(
                alarmSoundRef.current,
                alarmVolumeRef.current
            )
        }
    }, [playAlarm, saveHistory])

    // Run updates four times per second for a responsive timer.
    // Actual elapsed time is measured using the clock.
    useEffect(() => {
        if (!isRunning) return

        const interval = window.setInterval(() => {
            advanceTimer(Date.now())
        }, 250)

        return () => window.clearInterval(interval)
    }, [isRunning, advanceTimer])

    // Handle returning to a tab and crossing midnight.
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                advanceTimer(Date.now())
                setCurrentDate(new Date())
            }
        }

        const handleFocus = () => {
            advanceTimer(Date.now())
            setCurrentDate(new Date())
        }

        // Save elapsed time before the page is closed.
        const handlePageHide = () => {
            advanceTimer(Date.now())
        }

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange
        )
        window.addEventListener('focus', handleFocus)
        window.addEventListener('pagehide', handlePageHide)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('pagehide', handlePageHide)
        }
    }, [advanceTimer])

    // Refresh the displayed date even when the timer is stopped.
    useEffect(() => {
        const interval = window.setInterval(() => {
            setCurrentDate(new Date())
        }, 30000)

        return () => window.clearInterval(interval)
    }, [])


    // =====================================
    // TIMER ACTIONS
    // =====================================

    const startTimer = useCallback((minutes: number) => {
        advanceTimer(Date.now())
        stopAlarm()

        const durationMs = Math.round(minutes * 60000)

        remainingMsRef.current = durationMs
        lastTickRef.current = Date.now()
        runningRef.current = true

        setSelectedMinutes(minutes)
        setTimeLeft(Math.ceil(durationMs / 1000))
        setIsRunning(true)
    }, [advanceTimer, stopAlarm])

    const startPreset = (minutes: number) => {
        startTimer(minutes)
    }

    const startCustom = () => {
        const minutes = Number(customMinutes)

        if (
            customMinutes.trim() === '' ||
            !Number.isFinite(minutes) ||
            minutes <= 0 ||
            minutes > 1440 ||
            Math.round(minutes * 60000) < 1000
        ) {
            alert(
                'Please enter a duration between 1 second and 1440 minutes.'
            )
            return
        }

        startTimer(minutes)
    }

    const addTime = useCallback((minutes: number) => {
        advanceTimer(Date.now())
        stopAlarm()

        remainingMsRef.current += minutes * 60000

        setTimeLeft(
            Math.ceil(remainingMsRef.current / 1000)
        )
    }, [advanceTimer, stopAlarm])

    const toggleTimer = () => {
        if (runningRef.current) {
            advanceTimer(Date.now())

            runningRef.current = false
            lastTickRef.current = null
            setIsRunning(false)
            return
        }

        if (remainingMsRef.current === 0) {
            remainingMsRef.current =
                Math.round(selectedMinutes * 60000)
        }

        stopAlarm()

        lastTickRef.current = Date.now()
        runningRef.current = true

        setTimeLeft(
            Math.ceil(remainingMsRef.current / 1000)
        )
        setIsRunning(true)
    }

    const resetTimer = () => {
        advanceTimer(Date.now())
        stopAlarm()

        runningRef.current = false
        lastTickRef.current = null

        remainingMsRef.current =
            Math.round(selectedMinutes * 60000)

        setIsRunning(false)
        setTimeLeft(
            Math.ceil(remainingMsRef.current / 1000)
        )
    }

    // =====================================
    // PROGRESS CALCULATIONS
    // =====================================

    const todayKey = dateKey(currentDate)
    const todayMs = history[todayKey] ?? 0

    const streak = calculateStreak(history, currentDate)

    const todayGoalMet =
        todayMs >= STREAK_GOAL_MINUTES * 60000

    const lastSevenDays = Array.from(
        { length: 7 },
        (_, index) => {
            const date = shiftDate(currentDate, index - 6)
            const key = dateKey(date)
            const milliseconds = history[key] ?? 0

            return {
                key,
                label: date.toLocaleDateString('en-US', {
                    weekday: 'short'
                }),
                dateLabel: date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }),
                milliseconds,
                goalMet:
                    milliseconds >= STREAK_GOAL_MINUTES * 60000
            }
        }
    )

    // =====================================
    // PAGE
    // =====================================

    return (
        <div className={`theme-${theme}`}>
            <div className="app-container">

                <header className="app-header">
                    <h1>Focus Haven</h1>
                    <p>Your personal study sanctuary</p>
                </header>

                <main>

                    {/* TOP TOOLBAR */}

                    <div className="top-toolbar">

                        {/* ATMOSPHERE */}

                        <div className="dropdown-wrapper">
                            <button
                                type="button"
                                className="toolbar-button"
                                aria-expanded={themeMenuOpen}
                                aria-controls="theme-menu"
                                onClick={() => {
                                    setThemeMenuOpen(previous => !previous)
                                    setAlarmMenuOpen(false)
                                }}
                            >
                                ◈ {themeNames[theme]} ▾
                            </button>

                            {themeMenuOpen && (
                                <div
                                    id="theme-menu"
                                    className="dropdown-menu"
                                >
                                    {(
                                        ['cozy', 'nature', 'fantasy'] as Theme[]
                                    ).map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={
                                                theme === option
                                                    ? 'dropdown-active'
                                                    : ''
                                            }
                                            onClick={() => {
                                                setTheme(option)
                                                setThemeMenuOpen(false)
                                            }}
                                        >
                                            {themeNames[option]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ALARM */}

                        <div className="dropdown-wrapper">
                            <button
                                type="button"
                                className="toolbar-button"
                                aria-expanded={alarmMenuOpen}
                                aria-controls="alarm-menu"
                                onClick={() => {
                                    setAlarmMenuOpen(previous => !previous)
                                    setThemeMenuOpen(false)
                                }}
                            >
                                ♫ Alarm ▾
                            </button>

                            {alarmMenuOpen && (
                                <div
                                    id="alarm-menu"
                                    className="dropdown-menu alarm-menu"
                                >
                                    <h3>Timer Alarm</h3>

                                    <label htmlFor="alarm-sound">
                                        Choose Sound
                                    </label>

                                    <select
                                        id="alarm-sound"
                                        value={alarmSound}
                                        onChange={event =>
                                            setAlarmSound(
                                                event.target.value as AlarmSound
                                            )
                                        }
                                    >
                                        {(
                                            Object.keys(alarmSounds) as AlarmSound[]
                                        ).map(sound => (
                                            <option
                                                key={sound}
                                                value={sound}
                                            >
                                                {alarmSounds[sound].name}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="alarm-volume">
                                        Volume: {alarmVolume}%
                                    </label>

                                    <input
                                        id="alarm-volume"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={alarmVolume}
                                        onChange={event =>
                                            setAlarmVolume(
                                                Number(event.target.value)
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="test-alarm-button"
                                        onClick={() =>
                                            playAlarm(
                                                alarmSound,
                                                alarmVolume
                                            )
                                        }
                                    >
                                        ▶ Test Sound
                                    </button>

                                    {alarmError && (
                                        <p
                                            className="alarm-error"
                                            role="alert"
                                        >
                                            {alarmError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TIMER */}

                    <section className="timer-section">
                        <h2 className="visually-hidden">
                            Focus Session
                        </h2>

                        <div className="timer-presets">
                            {timerPresets.map(minutes => (
                                <button
                                    key={minutes}
                                    type="button"
                                    onClick={() =>
                                        startPreset(minutes)
                                    }
                                >
                                    {minutes} min
                                </button>
                            ))}
                        </div>

                        <div className="custom-timer">
                            <input
                                type="number"
                                min="0.0167"
                                max="1440"
                                step="any"
                                placeholder="Custom"
                                aria-label="Custom timer in minutes"
                                value={customMinutes}
                                onChange={event =>
                                    setCustomMinutes(event.target.value)
                                }
                            />

                            <span>min</span>

                            <button
                                type="button"
                                onClick={startCustom}
                            >
                                Start
                            </button>
                        </div>

                        <div
                            className="timer-display"
                            role="timer"
                            aria-label="Time remaining"
                        >
                            {formatDuration(timeLeft)}
                        </div>

                        <div className="add-time-buttons">
                            {addTimeOptions.map(minutes => (
                                <button
                                    key={minutes}
                                    type="button"
                                    onClick={() =>
                                        addTime(minutes)
                                    }
                                >
                                    + {minutes} min
                                </button>
                            ))}
                        </div>

                        <div className="timer-controls">
                            <button
                                type="button"
                                className="control-button reset-button"
                                onClick={resetTimer}
                                aria-label="Reset timer"
                                title="Reset timer"
                            >
                                ↺
                            </button>

                            <button
                                type="button"
                                className="control-button play-button"
                                onClick={toggleTimer}
                                aria-label={
                                    timeLeft === 0
                                        ? 'Restart timer'
                                        : isRunning
                                            ? 'Pause timer'
                                            : 'Start or resume timer'
                                }
                                title={
                                    timeLeft === 0
                                        ? 'Restart'
                                        : isRunning
                                            ? 'Pause'
                                            : 'Start / Resume'
                                }
                            >
                                {timeLeft === 0
                                    ? '▶'
                                    : isRunning
                                        ? 'Ⅱ'
                                        : '▶'}
                            </button>
                        </div>
                    </section>

                    {/* PROGRESS */}

                    <section className="stats-section">
                        <h2>Your Progress</h2>

                        <div className="stats-container">
                            <div>
                                <h3>Today's Focus</h3>
                                <p>
                                    {formatFocusMinutes(todayMs)} minutes
                                </p>
                                <span className="stat-detail">
                                    {todayGoalMet
                                        ? '✓ Daily goal achieved'
                                        : `${formatFocusMinutes(
                                            Math.max(
                                                0,
                                                STREAK_GOAL_MINUTES * 60000 - todayMs
                                            )
                                        )} minutes until your daily goal`}
                                </span>
                            </div>

                            <div>
                                <h3>Study Streak</h3>
                                <p>
                                    {streak} {streak === 1 ? 'day' : 'days'}
                                </p>
                                <span className="stat-detail">
                                    15 minutes qualifies a day
                                </span>
                            </div>
                        </div>

                        {/* LAST SEVEN DAYS */}

                        <div className="study-history">
                            <h3>Study History</h3>
                            <p className="history-description">
                                Your last seven days of focused study
                            </p>

                            <div className="history-grid">
                                {lastSevenDays.map(day => (
                                    <div
                                        className={
                                            `history-day ${day.goalMet
                                                ? 'history-day-complete'
                                                : ''
                                            }`
                                        }
                                        key={day.key}
                                        title={`${day.dateLabel}: ${formatFocusMinutes(day.milliseconds)
                                            } minutes`}
                                    >
                                        <span className="history-weekday">
                                            {day.label}
                                        </span>

                                        <span className="history-date">
                                            {day.dateLabel}
                                        </span>

                                        <strong className="history-minutes">
                                            {formatFocusMinutes(
                                                day.milliseconds
                                            )}
                                        </strong>

                                        <span className="history-unit">
                                            min
                                        </span>

                                        <span className="history-status">
                                            {day.goalMet ? '✓' : '·'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p className="history-footnote">
                                ✓ = Reached your 15-minute daily goal
                            </p>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    )
}

export default App
