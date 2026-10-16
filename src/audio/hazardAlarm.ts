export async function playHazardAlarm(
    volume = 0.5
): Promise<void> {
    const audioContext = new AudioContext()
    const safeVolume = Math.max(0, Math.min(1, volume))

    try {
        await audioContext.resume()

        const startTime = audioContext.currentTime + 0.03

        // Two long warning blasts.
        const burstCount = 2
        const burstDuration = 2.2
        const pauseDuration = 0.4

        // Main frequencies and harmonic layers.
        const layers = [
            { frequency: 480, strength: 0.13 },
            { frequency: 630, strength: 0.09 },
            { frequency: 950, strength: 0.045 }
        ]

        for (let i = 0; i < burstCount; i++) {
            const burstStart =
                startTime + i * (burstDuration + pauseDuration)

            const burstEnd = burstStart + burstDuration

            for (const layer of layers) {
                const oscillator = audioContext.createOscillator()
                const gain = audioContext.createGain()

                // Sawtooth creates a harmonically rich tone.
                oscillator.type = 'sawtooth'

                // Slowly sweep upward and back down.
                oscillator.frequency.setValueAtTime(
                    layer.frequency,
                    burstStart
                )

                oscillator.frequency.linearRampToValueAtTime(
                    layer.frequency * 1.15,
                    burstStart + burstDuration * 0.5
                )

                oscillator.frequency.linearRampToValueAtTime(
                    layer.frequency,
                    burstEnd
                )

                // Vibrating modulation gives it a warning-siren texture.
                const modulation = audioContext.createOscillator()
                const modulationDepth = audioContext.createGain()

                modulation.type = 'sine'
                modulation.frequency.value = 18

                modulationDepth.gain.value =
                    safeVolume * layer.strength * 0.22

                modulation.connect(modulationDepth)
                modulationDepth.connect(gain.gain)

                const peakVolume =
                    safeVolume * layer.strength

                gain.gain.setValueAtTime(0, burstStart)

                gain.gain.linearRampToValueAtTime(
                    peakVolume,
                    burstStart + 0.12
                )

                gain.gain.setValueAtTime(
                    peakVolume,
                    burstEnd - 0.3
                )

                gain.gain.linearRampToValueAtTime(
                    0,
                    burstEnd
                )

                // Filter harsh upper harmonics.
                const filter = audioContext.createBiquadFilter()
                filter.type = 'lowpass'
                filter.frequency.value = 4000

                oscillator.connect(filter)
                filter.connect(gain)
                gain.connect(audioContext.destination)

                oscillator.start(burstStart)
                oscillator.stop(burstEnd)

                modulation.start(burstStart)
                modulation.stop(burstEnd)
            }
        }

        window.setTimeout(() => {
            void audioContext.close()
        }, 6000)

    } catch (error) {
        await audioContext.close()
        throw error
    }
}