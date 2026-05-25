import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

const createAnswer = vi.fn()
const listSessions = vi.fn()
const listAnswersBySession = vi.fn()

vi.mock('./utils/playOvertimeAlert', () => ({
  playOvertimeAlert: vi.fn(),
}))

vi.mock('./services/api', () => ({
  createAnswer: (...args: unknown[]) => createAnswer(...args),
  listSessions: (...args: unknown[]) => listSessions(...args),
  listAnswersBySession: (...args: unknown[]) => listAnswersBySession(...args),
}))

describe('Session review flow', () => {
  afterEach(() => {
    createAnswer.mockReset()
    listSessions.mockReset()
    listAnswersBySession.mockReset()
  })

  it('shows the final summary with the saved answer timings after a session is completed', async () => {
    const user = userEvent.setup()
    createAnswer.mockResolvedValue({
      id: 'answer-1',
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself\nFocus on the most recent role.',
      fullAnswer: 'Answer',
      targetSeconds: 120,
      elapsedSeconds: 135,
      createdAt: '2026-05-25T09:00:00.000Z',
      updatedAt: '2026-05-25T09:00:00.000Z',
    })

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself{enter}Focus on the most recent role.',
    )
    await user.click(screen.getByRole('button', { name: 'Start session' }))
    await user.click(screen.getByRole('button', { name: 'Start question' }))
    await user.click(screen.getByRole('button', { name: 'Mark question as complete' }))
    await user.click(screen.getByRole('button', { name: 'Confirm and save' }))

    expect(await screen.findByText('Review the timing for this session')).toBeInTheDocument()
    expect(
      screen.getByText((_, element) => {
        return (
          element?.classList.contains('session-review-question') === true &&
          element.textContent === 'Tell me about yourself\nFocus on the most recent role.'
        )
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Target 02:00 · Actual 02:15')).toBeInTheDocument()
  })

  it('lists the saved sessions returned by GET /sessions', async () => {
    const user = userEvent.setup()
    listSessions.mockResolvedValue([
      {
        sessionId: 'session-2',
        answeredCount: 2,
        targetSeconds: 120,
        totalElapsedSeconds: 250,
        completedAt: '2026-05-25T09:00:00.000Z',
      },
    ])
    listAnswersBySession.mockResolvedValue([])

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'View history' }))

    expect(await screen.findByText('session-2')).toBeInTheDocument()
    expect(screen.getByText('2 answer(s) · Total 04:10')).toBeInTheDocument()
  })

  it('loads ordered answers when opening a saved session from history', async () => {
    const user = userEvent.setup()
    listSessions.mockResolvedValue([
      {
        sessionId: 'session-1',
        answeredCount: 2,
        targetSeconds: 120,
        totalElapsedSeconds: 240,
        completedAt: '2026-05-25T09:00:00.000Z',
      },
    ])
    listAnswersBySession.mockResolvedValue([
      {
        id: 'answer-2',
        sessionId: 'session-1',
        questionOrder: 2,
        questionText: 'Second question',
        fullAnswer: 'Answer 2',
        targetSeconds: 120,
        elapsedSeconds: 125,
        createdAt: '2026-05-25T09:01:00.000Z',
        updatedAt: '2026-05-25T09:01:00.000Z',
      },
      {
        id: 'answer-1',
        sessionId: 'session-1',
        questionOrder: 1,
        questionText: 'First question\nWith follow-up detail',
        fullAnswer: 'Answer 1',
        targetSeconds: 120,
        elapsedSeconds: 115,
        createdAt: '2026-05-25T09:00:00.000Z',
        updatedAt: '2026-05-25T09:00:00.000Z',
      },
    ])

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'View history' }))
    await user.click(await screen.findByRole('button', { name: /session-1/i }))

    await waitFor(() => {
      const questionLabels = screen
        .getAllByText(/Question \d/)
        .map((element) => element.textContent)

      expect(questionLabels).toContain('Question 1')
      expect(questionLabels).toContain('Question 2')
    })

    const detailItems = screen.getAllByRole('listitem')
    expect(detailItems.at(-2)).toHaveTextContent('Question 1')
    expect(detailItems.at(-1)).toHaveTextContent('Question 2')
    expect(
      screen.getByText((_, element) => {
        return (
          element?.classList.contains('session-review-question') === true &&
          element.textContent === 'First question\nWith follow-up detail'
        )
      }),
    ).toBeInTheDocument()
  })
})
