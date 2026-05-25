import { afterEach, describe, expect, it, vi } from 'vitest'

const originalAudioContext = window.AudioContext

afterEach(() => {
  vi.resetModules()
  Object.defineProperty(window, 'AudioContext', {
    configurable: true,
    writable: true,
    value: originalAudioContext,
  })
})

describe('playOvertimeAlert', () => {
  it('returns safely when the browser audio API is unavailable', async () => {
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      writable: true,
      value: undefined,
    })

    const { playOvertimeAlert } = await import('./playOvertimeAlert')

    expect(() => playOvertimeAlert()).not.toThrow()
  })

  it('creates a short alert tone and resumes a suspended audio context', async () => {
    const oscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }
    const gainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }
    const resume = vi.fn()

    class FakeAudioContext {
      currentTime = 10
      destination = {}
      state: AudioContextState = 'suspended'

      createOscillator() {
        return oscillator as unknown as OscillatorNode
      }

      createGain() {
        return gainNode as unknown as GainNode
      }

      resume() {
        resume()
        this.state = 'running'

        return Promise.resolve()
      }
    }

    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      writable: true,
      value: FakeAudioContext,
    })

    const { playOvertimeAlert } = await import('./playOvertimeAlert')

    playOvertimeAlert()

    expect(resume).toHaveBeenCalledTimes(1)
    expect(oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(880, 10)
    expect(gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.0001, 10)
    expect(gainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledTimes(2)
    expect(oscillator.connect).toHaveBeenCalledWith(gainNode)
    expect(gainNode.connect).toHaveBeenCalled()
    expect(oscillator.start).toHaveBeenCalledWith(10)
    expect(oscillator.stop).toHaveBeenCalledWith(10.2)
  })
})
