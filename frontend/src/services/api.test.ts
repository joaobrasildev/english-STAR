import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createAnswer,
  listAnswersBySession,
  listSessions,
} from './api'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api service', () => {
  it('creates a saved answer through POST /answers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'answer-1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createAnswer({
        sessionId: 'session-1',
        questionOrder: 1,
        questionText: 'Question',
        fullAnswer: 'Answer',
        targetSeconds: 90,
        elapsedSeconds: 95,
      }),
    ).resolves.toEqual({ id: 'answer-1' })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3100/answers',
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })

  it('loads the saved session summaries', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ sessionId: 'session-1', answeredCount: 2 }],
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listSessions()).resolves.toEqual([
      { sessionId: 'session-1', answeredCount: 2 },
    ])
  })

  it('loads the saved answers for a specific session and surfaces backend errors', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 'answer-1', questionOrder: 1 }],
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Session was not found.' }),
      })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listAnswersBySession('session-1')).resolves.toEqual([
      { id: 'answer-1', questionOrder: 1 },
    ])
    await expect(listAnswersBySession('missing-session')).rejects.toThrow(
      'Session was not found.',
    )
  })
})
