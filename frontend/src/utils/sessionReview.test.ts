import { describe, expect, it } from 'vitest'
import type { AnswerRecord, SessionSummary } from '../services/api'
import {
  formatAnswerTiming,
  sortAnswerRecordsByQuestionOrder,
  sortSessionSummariesByCompletedAt,
} from './sessionReview'

describe('sessionReview utilities', () => {
  it('sorts summary answers by question order', () => {
    const answers: AnswerRecord[] = [
      {
        id: '2',
        sessionId: 'session-1',
        questionOrder: 2,
        questionText: 'Second question',
        fullAnswer: 'Answer 2',
        targetSeconds: 90,
        elapsedSeconds: 100,
        createdAt: '2026-05-25T09:00:00.000Z',
        updatedAt: '2026-05-25T09:00:00.000Z',
      },
      {
        id: '1',
        sessionId: 'session-1',
        questionOrder: 1,
        questionText: 'First question',
        fullAnswer: 'Answer 1',
        targetSeconds: 90,
        elapsedSeconds: 80,
        createdAt: '2026-05-25T08:59:00.000Z',
        updatedAt: '2026-05-25T08:59:00.000Z',
      },
    ]

    expect(sortAnswerRecordsByQuestionOrder(answers).map((answer) => answer.questionOrder)).toEqual([
      1,
      2,
    ])
  })

  it('keeps session totals and orders history entries by completedAt descending', () => {
    const sessions: SessionSummary[] = [
      {
        sessionId: 'older-session',
        answeredCount: 2,
        targetSeconds: 90,
        totalElapsedSeconds: 180,
        completedAt: '2026-05-24T09:00:00.000Z',
      },
      {
        sessionId: 'newer-session',
        answeredCount: 3,
        targetSeconds: 120,
        totalElapsedSeconds: 330,
        completedAt: '2026-05-25T09:00:00.000Z',
      },
    ]

    const sortedSessions = sortSessionSummariesByCompletedAt(sessions)

    expect(sortedSessions[0]).toMatchObject({
      sessionId: 'newer-session',
      answeredCount: 3,
      totalElapsedSeconds: 330,
    })
    expect(sortedSessions[1]).toMatchObject({
      sessionId: 'older-session',
      answeredCount: 2,
      totalElapsedSeconds: 180,
    })
  })

  it('formats target and actual durations with distinct labels', () => {
    expect(formatAnswerTiming(120, 145)).toBe('Target 02:00 · Actual 02:25')
  })
})
