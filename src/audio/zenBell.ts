
export async function playZenBell(volume = 0.5): Promise<void> {
    const audioContext = new AudioContext();
    const safeVolume = Math.max(0, Math.min(1, volume));

    try {
        await audioContext.resume();

        const startTime = audioContext.currentTime + 0.02;

        // Two gentle singing bowl strikes.
        const strikeTimes = [0, 1.1];

        // Layered frequencies create a warm metallic resonance.
        const frequencies = [
            { frequency: 220, strength: 0.42 },
            { frequency: 440, strength: 0.20 },
            { frequency: 558, strength: 0.12 },
            { frequency: 726, strength: 0.07 },
        ];

        const ringDuration = 1.8;

        for (const strikeOffset of strikeTimes) {
            const strikeStart = startTime + strikeOffset;
            const strikeEnd = strikeStart + ringDuration;

            for (const tone of frequencies) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();

                oscillator.type = "sine";
                oscillator.frequency.value = tone.frequency;

                oscillator.connect(gain);
                gain.connect(audioContext.destination);

                const peakVolume =
                    safeVolume * tone.strength * 0.5;

                // Gentle attack followed by a smooth decay.
                gain.gain.setValueAtTime(0, strikeStart);

                gain.gain.linearRampToValueAtTime(
                    peakVolume,
                    strikeStart + 0.025
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    strikeEnd
                );

                oscillator.start(strikeStart);
                oscillator.stop(strikeEnd);
            }
        }

        // Close after both strikes finish ringing.
        window.setTimeout(() => {
            void audioContext.close();
        }, 3500);
    } catch (error) {
        await audioContext.close();
        throw error;
    }
}
