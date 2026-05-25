let sharedAudioContext: AudioContext | null = null

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

function getAudioContextCtor():
  | typeof AudioContext
  | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const windowWithWebkitAudioContext = window as WindowWithWebkitAudioContext

  return (
    windowWithWebkitAudioContext.AudioContext ??
    windowWithWebkitAudioContext.webkitAudioContext
  )
}

export function playOvertimeAlert() {
  const AudioContextCtor = getAudioContextCtor()
  if (!AudioContextCtor) {
    return
  }

  const audioContext =
    sharedAudioContext ?? (sharedAudioContext = new AudioContextCtor())

  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  const startTime = audioContext.currentTime

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(880, startTime)
  gainNode.gain.setValueAtTime(0.0001, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18)

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + 0.2)
}
