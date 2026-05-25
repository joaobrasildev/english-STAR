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

const createAnswer = vi.fn()

vi.mock('../utils/playOvertimeAlert', () => ({
  playOvertimeAlert: vi.fn(),
}))

vi.mock('../services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/api')>()

  return {
    ...actual,
    createAnswer: (...args: unknown[]) => createAnswer(...args),
  }
})

function createSession(targetSeconds = 2): PreparedSession {
  return {
    sessionId: 'server-session-1',
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
    createAnswer.mockReset()
  })

  it('shows the current question, starts the timer, and keeps the STAR fields editable', () => {
    render(<PracticeSession session={createSession()} />)

    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Primary writing flow' }),
    ).toContainElement(screen.getByRole('region', { name: 'STAR answer builder' }))
    expect(
      screen.getByRole('textbox', { name: /Situation \(S\)/ }),
    ).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))

    expect(screen.getByText('Counting down')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark question as complete' })).toBeEnabled()
  })

  it('renders multiline questions and keeps support panels in the secondary section', () => {
    render(
      <PracticeSession
        session={{
          ...createSession(),
          rawQuestionBlock:
            '1. Tell me about yourself\nFocus on the most recent role.\n2. Describe a challenge you solved',
          parsedQuestions: [
            'Tell me about yourself\nFocus on the most recent role.',
            'Describe a challenge you solved',
          ],
        }}
      />,
    )

    const questionText = screen.getByText((_, element) => {
      return (
        element?.classList.contains('question-text') === true &&
        element.textContent === 'Tell me about yourself\nFocus on the most recent role.'
      )
    })

    expect(questionText).toHaveClass('question-text')

    const primaryFlow = screen.getByRole('region', { name: 'Primary writing flow' })
    const supportingPanels = screen.getByRole('region', { name: 'Supporting panels' })

    expect(primaryFlow).toContainElement(
      screen.getByRole('region', { name: 'STAR answer builder' }),
    )
    expect(supportingPanels).toContainElement(
      screen.getByRole('region', { name: 'Time remaining' }),
    )
    expect(supportingPanels).toContainElement(
      screen.getByRole('region', { name: 'Full answer preview' }),
    )
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

  it('confirms the finish, saves the answer, and advances to the next question after success', async () => {
    createAnswer.mockResolvedValue({
      id: 'answer-1',
      sessionId: 'server-session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself\nFocus on the most recent role.',
      fullAnswer: 'Situation text\n\n\n\n\n\n',
      targetSeconds: 2,
      elapsedSeconds: 0,
      createdAt: '2026-05-25T09:00:00.000Z',
      updatedAt: '2026-05-25T09:00:00.000Z',
    })

    render(
      <PracticeSession
        session={{
          ...createSession(),
          rawQuestionBlock:
            '1. Tell me about yourself\nFocus on the most recent role.\n2. Describe a challenge you solved',
          parsedQuestions: [
            'Tell me about yourself\nFocus on the most recent role.',
            'Describe a challenge you solved',
          ],
        }}
      />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: /Situation \(S\)/ }), {
      target: { value: 'Situation text' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark question as complete' }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))

    expect(await screen.findByText('Describe a challenge you solved')).toBeInTheDocument()
    expect(createAnswer).toHaveBeenCalledWith({
      sessionId: 'server-session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself\nFocus on the most recent role.',
      fullAnswer: 'Situation text\n\n\n\n\n\n',
      targetSeconds: 2,
      elapsedSeconds: 0,
    })
  })

  it('keeps the same question visible and shows an error when saving fails', async () => {
    createAnswer.mockRejectedValue(new Error('Backend unavailable'))

    render(<PracticeSession session={createSession()} />)

    fireEvent.change(screen.getByRole('textbox', { name: /Situation \(S\)/ }), {
      target: { value: 'Keep this draft' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark question as complete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Backend unavailable')
    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Situation \(S\)/ })).toHaveValue(
      'Keep this draft',
    )
  })

  it('blocks a local save with invalid sessionId without sending POST and keeps retry available', async () => {
    render(
      <PracticeSession
        session={{
          ...createSession(),
          sessionId: '   ',
        }}
      />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: /Situation \(S\)/ }), {
      target: { value: 'Keep this draft' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark question as complete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Failed to save the answer. Please try again.',
    )
    expect(createAnswer).not.toHaveBeenCalled()
    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Situation \(S\)/ })).toHaveValue(
      'Keep this draft',
    )
    expect(screen.getByRole('button', { name: 'Confirm and save' })).toBeInTheDocument()
  })

  it('saves the last question without trying to advance beyond the session', async () => {
    createAnswer.mockResolvedValue({
      id: 'answer-1',
      sessionId: 'server-session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself',
      fullAnswer: 'Final answer\n\n\n\n\n\n',
      targetSeconds: 2,
      elapsedSeconds: 0,
      createdAt: '2026-05-25T09:00:00.000Z',
      updatedAt: '2026-05-25T09:00:00.000Z',
    })

    render(
      <PracticeSession
        session={{
          ...createSession(),
          rawQuestionBlock: '1. Tell me about yourself',
          parsedQuestions: ['Tell me about yourself'],
        }}
      />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: /Situation \(S\)/ }), {
      target: { value: 'Final answer' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark question as complete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))

    expect(
      await screen.findByText('Session complete. Your final answer was saved successfully.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
    expect(screen.queryByText('Describe a challenge you solved')).not.toBeInTheDocument()
  })

  it('passes the persisted sessionId to the summary handoff when the last question completes', async () => {
    const onSessionComplete = vi.fn()
    createAnswer.mockResolvedValue({
      id: 'answer-1',
      sessionId: 'server-session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself',
      fullAnswer: 'Final answer\n\n\n\n\n\n',
      targetSeconds: 2,
      elapsedSeconds: 0,
      createdAt: '2026-05-25T09:00:00.000Z',
      updatedAt: '2026-05-25T09:00:00.000Z',
    })

    render(
      <PracticeSession
        session={{
          ...createSession(),
          rawQuestionBlock: '1. Tell me about yourself',
          parsedQuestions: ['Tell me about yourself'],
        }}
        onSessionComplete={onSessionComplete}
      />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: /Situation \(S\)/ }), {
      target: { value: 'Final answer' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start question' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark question as complete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))

    await screen.findByText('Session complete. Your final answer was saved successfully.')

    expect(onSessionComplete).toHaveBeenCalledWith({
      sessionId: 'server-session-1',
      answers: [
        expect.objectContaining({
          sessionId: 'server-session-1',
        }),
      ],
    })
  })
})
