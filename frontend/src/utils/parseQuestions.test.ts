import { describe, expect, it } from 'vitest'
import { parseQuestions } from './parseQuestions'

describe('parseQuestions', () => {
  it('separates numbered questions using dot notation', () => {
    expect(
      parseQuestions(`
        1. Tell me about yourself
        2. Describe a challenge you solved
      `),
    ).toEqual(['Tell me about yourself', 'Describe a challenge you solved'])
  })

  it('appends continuation lines to the current question', () => {
    expect(
      parseQuestions(`
        1. Describe a difficult stakeholder
        and how you aligned expectations
        2. Tell me about a risk you mitigated
      `),
    ).toEqual([
      'Describe a difficult stakeholder\nand how you aligned expectations',
      'Tell me about a risk you mitigated',
    ])
  })

  it('preserves blank lines inside a question while trimming trailing blanks', () => {
    expect(
      parseQuestions(`
        1. Tell me about a project
        where you had to recover trust

        Focus on the turning point.


        2. Describe a challenge you solved
      `),
    ).toEqual([
      'Tell me about a project\nwhere you had to recover trust\n\nFocus on the turning point.',
      'Describe a challenge you solved',
    ])
  })

  it('returns an empty array when the block has no valid numbered questions', () => {
    expect(
      parseQuestions(`
        Tell me about yourself
        Another freeform line
      `),
    ).toEqual([])
  })
})
