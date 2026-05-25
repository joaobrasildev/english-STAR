import type { CurrentAnswer } from '../types/session'

export const STAR_FIELD_LABELS = {
  s: 'Situation',
  t: 'Task',
  a: 'Action',
  r: 'Result',
} as const satisfies Record<keyof CurrentAnswer, string>

export function composeAnswerParagraphs(answer: CurrentAnswer): string[] {
  return [answer.s.trim(), answer.t.trim(), answer.a.trim(), answer.r.trim()]
}

export function composeAnswer(answer: CurrentAnswer): string {
  return composeAnswerParagraphs(answer).join('\n\n')
}
