import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSessionSetup } from './useSessionSetup'

describe('useSessionSetup', () => {
  it('calls createSession only after local validation succeeds', async () => {
    const createSessionRequest = vi.fn().mockResolvedValue({
      sessionId: 'server-session-1',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
      status: 'active',
    })
    const { result } = renderHook(() =>
      useSessionSetup({ createSessionRequest }),
    )

    await act(async () => {
      await result.current.handleStartSession()
    })

    expect(createSessionRequest).not.toHaveBeenCalled()
    expect(result.current.errorMessage).toBe(
      'Add at least one numbered question before starting.',
    )

    act(() => {
      result.current.setRawQuestionBlock('1. Tell me about yourself')
    })

    await act(async () => {
      await result.current.handleStartSession()
    })

    expect(createSessionRequest).toHaveBeenCalledWith({
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 120,
    })
  })

  it('keeps the user in setup when createSession fails', async () => {
    const createSessionRequest = vi.fn().mockRejectedValue(
      new Error('Session setup failed.'),
    )
    const { result } = renderHook(() =>
      useSessionSetup({ createSessionRequest }),
    )

    act(() => {
      result.current.setRawQuestionBlock('1. Tell me about yourself')
    })

    await act(async () => {
      await result.current.handleStartSession()
    })

    expect(result.current.preparedSession).toBeNull()
    expect(result.current.errorMessage).toBe('Session setup failed.')
    expect(result.current.rawQuestionBlock).toBe('1. Tell me about yourself')
    expect(result.current.targetSecondsInput).toBe('120')
  })

  it('hydrates PreparedSession from the backend response without local id generation', async () => {
    const createSessionRequest = vi.fn().mockResolvedValue({
      sessionId: 'server-session-99',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 150,
      status: 'active',
    })
    const { result } = renderHook(() =>
      useSessionSetup({ createSessionRequest }),
    )

    act(() => {
      result.current.setRawQuestionBlock('1. Tell me about yourself')
      result.current.setTargetSecondsInput('150')
    })

    await act(async () => {
      await result.current.handleStartSession()
    })

    expect(result.current.preparedSession).toEqual({
      sessionId: 'server-session-99',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 150,
      currentIndex: 0,
      currentAnswer: {
        s: '',
        t: '',
        a: '',
        r: '',
      },
      timerState: 'idle',
    })
  })

  it('uses the latest typed questions and target even before the rerender completes', async () => {
    const createSessionRequest = vi.fn().mockResolvedValue({
      sessionId: 'server-session-77',
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 150,
      status: 'active',
    })
    const { result } = renderHook(() =>
      useSessionSetup({ createSessionRequest }),
    )

    await act(async () => {
      result.current.setRawQuestionBlock('1. Tell me about yourself')
      result.current.setTargetSecondsInput('150')
      await result.current.handleStartSession()
    })

    expect(createSessionRequest).toHaveBeenCalledWith({
      rawQuestionBlock: '1. Tell me about yourself',
      parsedQuestions: ['Tell me about yourself'],
      targetSeconds: 150,
    })
  })
})
