const QUESTION_PATTERN = /^\s*(\d+)[.)]\s*(.+)\s*$/

export function parseQuestions(rawQuestionBlock: string): string[] {
  const lines = rawQuestionBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const questions: string[] = []
  let currentQuestion = ''

  for (const line of lines) {
    const match = line.match(QUESTION_PATTERN)

    if (match) {
      if (currentQuestion) {
        questions.push(currentQuestion)
      }

      currentQuestion = match[2]
      continue
    }

    if (currentQuestion) {
      currentQuestion = `${currentQuestion} ${line}`.trim()
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion)
  }

  return questions
}
