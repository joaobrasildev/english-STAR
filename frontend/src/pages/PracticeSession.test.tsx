import { act, fireEvent, render, screen, within } from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import type { PreparedSession } from '../types/session'
import { PracticeSession } from './PracticeSession'
import { playOvertimeAlert } from '../utils/playOvertimeAlert'

vi.mock('../utils/playOvertimeAlert', () => ({
  playOvertimeAlert: vi.fn(),
}))

function createSession(targetSeconds = 2): PreparedSession {
  return {
    rawQuestionBlock:
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    parsedQuestions: [
      'Tell me about yourself',
      'Describe a challenge you solved',
    ],
    targetSeconds,
    currentIndex: 0,
    currentAnswer: {
      s: '',
      t: '',
      a: '',
      r: '',
    },
    timerState: 'idle',
  }
}

describe('Practice session flow', () => {
  afterEach(() => {
    vi.mocked(playOvertimeAlert).mockClear()
  })

  it('shows the current question, starts the timer, and keeps the STAR fields editable', () => {
    render(<PracticeSession session={createSession()} />)

    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: /Situation \(S\)/ }),
    ).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))

    expect(screen.getByText('Counting down')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark question as complete' })).toBeEnabled()
  })

  it('shows the overtime alert and plays the sound only once when the target reaches zero', () => {
    vi.useFakeTimers()
    render(<PracticeSession session={createSession(1)} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Target time reached.')).toBeInTheDocument()
    expect(vi.mocked(playOvertimeAlert)).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(vi.mocked(playOvertimeAlert)).toHaveBeenCalledTimes(1)
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('updates the full answer preview immediately when any STAR field changes', () => {
    render(<PracticeSession session={createSession()} />)

    fireEvent.change(screen.getByRole('textbox', { name: /Situation \(S\)/ }), {
      target: { value: 'I inherited a delayed launch.' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /Task \(T\)/ }), {
      target: { value: 'I had to recover the plan fast.' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /Action \(A\)/ }), {
      target: { value: 'I re-sequenced the work and aligned stakeholders.' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /Result \(R\)/ }), {
      target: { value: 'We launched on the new deadline with no regressions.' },
    })

    const previewPanel = screen.getByRole('region', {
      name: 'Full answer preview',
    })

    expect(within(previewPanel).getByText('I inherited a delayed launch.')).toBeInTheDocument()
    expect(within(previewPanel).getByText('I had to recover the plan fast.')).toBeInTheDocument()
    expect(
      within(previewPanel).getByText(
        'I re-sequenced the work and aligned stakeholders.',
      ),
    ).toBeInTheDocument()
    expect(
      within(previewPanel).getByText(
        'We launched on the new deadline with no regressions.',
      ),
    ).toBeInTheDocument()
  })
})
