import type {
  CurrentAnswer,
  PreparedSession,
  SessionTimerState,
} from '../types/session'

export type PracticeSessionState = PreparedSession & {
  elapsedSeconds: number
}

export type AnswerFieldKey = keyof CurrentAnswer

export function createPracticeSessionState(
  session: PreparedSession,
): PracticeSessionState {
  return {
    ...session,
    currentAnswer: { ...session.currentAnswer },
    elapsedSeconds: 0,
  }
}

export function updatePracticeAnswer(
  state: PracticeSessionState,
  field: AnswerFieldKey,
  value: string,
): PracticeSessionState {
  return {
    ...state,
    currentAnswer: {
      ...state.currentAnswer,
      [field]: value,
    },
  }
}

export function startPracticeTimer(
  state: PracticeSessionState,
): PracticeSessionState {
  if (state.timerState !== 'idle') {
    return state
  }

  return {
    ...state,
    timerState: 'countdown',
  }
}

export function tickPracticeTimer(
  state: PracticeSessionState,
): PracticeSessionState {
  if (state.timerState !== 'countdown' && state.timerState !== 'overtime') {
    return state
  }

  const elapsedSeconds = state.elapsedSeconds + 1
  const timerState: SessionTimerState =
    elapsedSeconds >= state.targetSeconds ? 'overtime' : 'countdown'

  return {
    ...state,
    elapsedSeconds,
    timerState,
  }
}

export function completePracticeTimer(
  state: PracticeSessionState,
): PracticeSessionState {
  if (state.timerState === 'idle' || state.timerState === 'completed') {
    return state
  }

  return {
    ...state,
    timerState: 'completed',
  }
}

export function getRemainingSeconds(state: PracticeSessionState): number {
  return Math.max(state.targetSeconds - state.elapsedSeconds, 0)
}

export function getOvertimeSeconds(state: PracticeSessionState): number {
  return Math.max(state.elapsedSeconds - state.targetSeconds, 0)
}
