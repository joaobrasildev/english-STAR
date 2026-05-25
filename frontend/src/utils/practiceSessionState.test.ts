import { describe, expect, it } from 'vitest'
import type { PreparedSession } from '../types/session'
import {
  completePracticeTimer,
  createPracticeSessionState,
  getOvertimeSeconds,
  getRemainingSeconds,
  startPracticeTimer,
  tickPracticeTimer,
  updatePracticeAnswer,
} from './practiceSessionState'

const baseSession: PreparedSession = {
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
})
