import { describe, expect, it } from 'vitest'
import type { PreparedSession } from '../types/session'
import {
  cancelFinishConfirmation,
  completePracticeTimer,
  createPracticeSessionState,
  failSavingAnswer,
  finishSavingAnswer,
  getOvertimeSeconds,
  getRemainingSeconds,
  requestFinishConfirmation,
  startSavingAnswer,
  startPracticeTimer,
  tickPracticeTimer,
  updatePracticeAnswer,
} from './practiceSessionState'

const baseSession: PreparedSession = {
  sessionId: 'session-1',
  rawQuestionBlock: '1. Tell me about yourself',
  parsedQuestions: ['Tell me about yourself'],
  targetSeconds: 2,
  currentIndex: 0,
  currentAnswer: {
    s: '',
    t: '',
    a: '',
    r: '',
  },
  timerState: 'idle',
}

describe('practiceSessionState', () => {
  it('moves from idle to countdown only after the question starts', () => {
    const state = createPracticeSessionState(baseSession)

    expect(state.timerState).toBe('idle')
    expect(startPracticeTimer(state).timerState).toBe('countdown')
  })

  it('enters overtime when elapsed time reaches the target', () => {
    const startedState = startPracticeTimer(createPracticeSessionState(baseSession))
    const afterFirstTick = tickPracticeTimer(startedState)
    const afterSecondTick = tickPracticeTimer(afterFirstTick)

    expect(afterFirstTick.timerState).toBe('countdown')
    expect(afterSecondTick.elapsedSeconds).toBe(2)
    expect(afterSecondTick.timerState).toBe('overtime')
  })

  it('updates answer fields and exposes remaining and overtime helpers', () => {
    const initialState = createPracticeSessionState(baseSession)
    const updatedState = updatePracticeAnswer(
      initialState,
      'a',
      'I re-sequenced the launch plan.',
    )
    const overtimeState = tickPracticeTimer(
      tickPracticeTimer(startPracticeTimer(updatedState)),
    )

    expect(updatedState.currentAnswer.a).toBe('I re-sequenced the launch plan.')
    expect(getRemainingSeconds(updatedState)).toBe(2)
    expect(getRemainingSeconds(overtimeState)).toBe(0)
    expect(getOvertimeSeconds(overtimeState)).toBe(0)
    expect(getOvertimeSeconds(tickPracticeTimer(overtimeState))).toBe(1)
  })

  it('marks the question as completed only after the timer has started', () => {
    const initialState = createPracticeSessionState(baseSession)
    const startedState = startPracticeTimer(initialState)

    expect(completePracticeTimer(initialState).timerState).toBe('idle')
    expect(completePracticeTimer(startedState).timerState).toBe('completed')
  })

  it('opens and closes the explicit finish confirmation state', () => {
    const startedState = startPracticeTimer(createPracticeSessionState(baseSession))

    expect(requestFinishConfirmation(startedState).isAwaitingFinishConfirmation).toBe(true)
    expect(
      cancelFinishConfirmation(requestFinishConfirmation(startedState))
        .isAwaitingFinishConfirmation,
    ).toBe(false)
  })

  it('does not start saving before the confirmation is requested', () => {
    const startedState = startPracticeTimer(createPracticeSessionState(baseSession))

    expect(startSavingAnswer(startedState).isSavingAnswer).toBe(false)
    expect(
      startSavingAnswer(requestFinishConfirmation(startedState)).isSavingAnswer,
    ).toBe(true)
  })

  it('preserves the current answer when saving fails and completes the session only after success', () => {
    const startedState = updatePracticeAnswer(
      startPracticeTimer(createPracticeSessionState(baseSession)),
      's',
      'Draft answer',
    )
    const savingState = startSavingAnswer(requestFinishConfirmation(startedState))
    const failedState = failSavingAnswer(savingState, 'Save failed')

    expect(failedState.currentAnswer.s).toBe('Draft answer')
    expect(failedState.currentIndex).toBe(0)
    expect(failedState.saveError).toBe('Save failed')

    const finishedState = finishSavingAnswer(savingState, {
      id: 'answer-1',
      sessionId: 'session-1',
      questionOrder: 1,
      questionText: 'Tell me about yourself',
      fullAnswer: 'Draft answer',
      targetSeconds: 2,
      elapsedSeconds: 1,
      createdAt: '2026-05-25T09:00:00.000Z',
      updatedAt: '2026-05-25T09:00:00.000Z',
    })

    expect(finishedState.savedAnswers).toHaveLength(1)
    expect(finishedState.isSessionComplete).toBe(true)
  })
})
