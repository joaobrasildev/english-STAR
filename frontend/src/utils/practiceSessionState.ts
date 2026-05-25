import type {
  CurrentAnswer,
  PreparedSession,
  SessionTimerState,
} from '../types/session'
import type { AnswerRecord } from '../services/api'

export type PracticeSessionState = PreparedSession & {
  elapsedSeconds: number
  isAwaitingFinishConfirmation: boolean
  isSavingAnswer: boolean
  saveError: string
  savedAnswers: AnswerRecord[]
  isSessionComplete: boolean
}

export type AnswerFieldKey = keyof CurrentAnswer

export function createPracticeSessionState(
  session: PreparedSession,
): PracticeSessionState {
  return {
    ...session,
    currentAnswer: { ...session.currentAnswer },
    elapsedSeconds: 0,
    isAwaitingFinishConfirmation: false,
    isSavingAnswer: false,
    saveError: '',
    savedAnswers: [],
    isSessionComplete: false,
  }
}

export function updatePracticeAnswer(
  state: PracticeSessionState,
  field: AnswerFieldKey,
  value: string,
): PracticeSessionState {
  return {
    ...state,
    saveError: '',
    currentAnswer: {
      ...state.currentAnswer,
      [field]: value,
    },
  }
}

export function startPracticeTimer(
  state: PracticeSessionState,
): PracticeSessionState {
  if (state.timerState !== 'idle' || state.isSessionComplete) {
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
  if (
    state.timerState === 'idle' ||
    state.timerState === 'completed' ||
    state.isSessionComplete
  ) {
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

export function requestFinishConfirmation(
  state: PracticeSessionState,
): PracticeSessionState {
  if (
    state.isSessionComplete ||
    state.isSavingAnswer ||
    state.timerState === 'idle'
  ) {
    return state
  }

  return {
    ...state,
    isAwaitingFinishConfirmation: true,
    saveError: '',
  }
}

export function cancelFinishConfirmation(
  state: PracticeSessionState,
): PracticeSessionState {
  if (!state.isAwaitingFinishConfirmation) {
    return state
  }

  return {
    ...state,
    isAwaitingFinishConfirmation: false,
  }
}

export function startSavingAnswer(
  state: PracticeSessionState,
): PracticeSessionState {
  if (!state.isAwaitingFinishConfirmation || state.isSavingAnswer) {
    return state
  }

  return {
    ...completePracticeTimer(state),
    isSavingAnswer: true,
    isAwaitingFinishConfirmation: false,
    saveError: '',
  }
}

export function failSavingAnswer(
  state: PracticeSessionState,
  errorMessage: string,
): PracticeSessionState {
  return {
    ...state,
    isAwaitingFinishConfirmation: true,
    isSavingAnswer: false,
    saveError: errorMessage,
  }
}

function createEmptyAnswer(): CurrentAnswer {
  return {
    s: '',
    t: '',
    a: '',
    r: '',
  }
}

export function finishSavingAnswer(
  state: PracticeSessionState,
  savedAnswer: AnswerRecord,
): PracticeSessionState {
  const savedAnswers = [...state.savedAnswers, savedAnswer]
  const nextQuestionIndex = state.currentIndex + 1
  const hasNextQuestion = nextQuestionIndex < state.parsedQuestions.length

  if (!hasNextQuestion) {
    return {
      ...state,
      isSavingAnswer: false,
      saveError: '',
      savedAnswers,
      isSessionComplete: true,
      timerState: 'completed',
    }
  }

  return {
    ...state,
    currentIndex: nextQuestionIndex,
    currentAnswer: createEmptyAnswer(),
    timerState: 'idle',
    elapsedSeconds: 0,
    isSavingAnswer: false,
    saveError: '',
    savedAnswers,
  }
}
