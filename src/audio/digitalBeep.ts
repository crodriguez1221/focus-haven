
export async function playDigitalBeep(volume = 0.5): Promise<void> {
    const audioContext = new AudioContext();
    const safeVolume = Math.max(0, Math.min(1, volume));

    try {
        await audioContext.resume();

        const startTime = audioContext.currentTime + 0.02;

        // Five short, pleasant electronic beeps.
        const beepCount = 5;
        const beepDuration = 0.15;
        const pauseDuration = 0.20;
        const frequency = 660;

        for (let i = 0; i < beepCount; i++) {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            // A sine wave creates a smooth, gentle tone.
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            const beepStart =
                startTime + i * (beepDuration + pauseDuration);

            const beepEnd = beepStart + beepDuration;

            // Fade in and out to prevent clicking.
            gain.gain.setValueAtTime(0, beepStart);

            gain.gain.linearRampToValueAtTime(
                safeVolume * 0.35,
                beepStart + 0.02
            );

            gain.gain.setValueAtTime(
                safeVolume * 0.35,
                beepEnd - 0.03
            );

            gain.gain.linearRampToValueAtTime(0, beepEnd);

            oscillator.start(beepStart);
            oscillator.stop(beepEnd);
        }

        // Release audio resources after playback.
        window.setTimeout(() => {
            void audioContext.close();
        }, 2000);
    } catch (error) {
        await audioContext.close();
        throw error;
    }
}
