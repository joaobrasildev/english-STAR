import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { PreparedSession } from '../types/session'
import { usePracticeSession } from './usePracticeSession'

function createSession(): PreparedSession {
  return {
    sessionId: 'session-1',
    rawQuestionBlock:
      '1. Tell me about yourself\nFocus on the most recent role.\n2. Describe a challenge you solved',
    parsedQuestions: [
      'Tell me about yourself\nFocus on the most recent role.',
      'Describe a challenge you solved',
    ],
    targetSeconds: 120,
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

describe('usePracticeSession', () => {
  it('requires explicit confirmation before calling the save handler', async () => {
    const saveAnswer = vi.fn()
    const { result } = renderHook(() =>
      usePracticeSession(createSession(), { saveAnswer }),
    )

    await act(async () => {
      await result.current.confirmFinishQuestion()
    })

    expect(saveAnswer).not.toHaveBeenCalled()
  })

  it('sends the expected payload when confirming the save', async () => {
    const saveAnswer = vi.fn().mockResolvedValue({
      id: 'answer-1',
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself\nFocus on the most recent role.',
      fullAnswer: 'Situation\n\nTask\n\nAction\n\nResult',
      targetSeconds: 120,
      elapsedSeconds: 0,
      createdAt: '2026-05-25T09:00:00.000Z',
      updatedAt: '2026-05-25T09:00:00.000Z',
    })
    const { result } = renderHook(() =>
      usePracticeSession(createSession(), { saveAnswer }),
    )

    act(() => {
      result.current.startQuestion()
      result.current.updateAnswerField('s', 'Situation')
      result.current.updateAnswerField('t', 'Task')
      result.current.updateAnswerField('a', 'Action')
      result.current.updateAnswerField('r', 'Result')
      result.current.requestFinishConfirmation()
    })

    await act(async () => {
      await result.current.confirmFinishQuestion()
    })

    expect(saveAnswer).toHaveBeenCalledWith({
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself\nFocus on the most recent role.',
      fullAnswer: 'Situation\n\nTask\n\nAction\n\nResult',
      targetSeconds: 120,
      elapsedSeconds: 0,
    })
  })

  it('keeps the current question state intact when saving fails', async () => {
    const saveAnswer = vi.fn().mockRejectedValue(new Error('API unavailable'))
    const { result } = renderHook(() =>
      usePracticeSession(createSession(), { saveAnswer }),
    )

    act(() => {
      result.current.startQuestion()
      result.current.updateAnswerField('s', 'Current answer still here')
      result.current.requestFinishConfirmation()
    })

    await act(async () => {
      await result.current.confirmFinishQuestion()
    })

    expect(result.current.currentQuestion).toBe(
      'Tell me about yourself\nFocus on the most recent role.',
    )
    expect(result.current.currentAnswer.s).toBe('Current answer still here')
    expect(result.current.saveError).toBe('API unavailable')
    expect(result.current.currentIndex).toBe(0)
  })
})
