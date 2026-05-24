export type SessionTimerState = 'idle' | 'countdown' | 'overtime' | 'completed'

export type CurrentAnswer = {
  s: string
  t: string
  a: string
  r: string
}

export type PreparedSession = {
  rawQuestionBlock: string
  parsedQuestions: string[]
  targetSeconds: number
  currentIndex: number
  currentAnswer: CurrentAnswer
  timerState: SessionTimerState
}
