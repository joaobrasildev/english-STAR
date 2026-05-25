import { describe, expect, it } from 'vitest'
import { composeAnswer } from './composeAnswer'

describe('composeAnswer', () => {
  it('keeps S, T, A and R in order as distinct paragraphs', () => {
    expect(
      composeAnswer({
        s: 'Situation paragraph',
        t: 'Task paragraph',
        a: 'Action paragraph',
        r: 'Result paragraph',
      }),
    ).toBe(
      'Situation paragraph\n\nTask paragraph\n\nAction paragraph\n\nResult paragraph',
    )
  })
})
