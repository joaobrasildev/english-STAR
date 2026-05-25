const QUESTION_PATTERN = /^\s*(\d+)[.)]\s*(.+)\s*$/

function finalizeQuestion(lines: string[]): string {
  let end = lines.length

  while (end > 0 && lines[end - 1] === '') {
    end -= 1
  }

  return lines.slice(0, end).join('\n')
}

export function parseQuestions(rawQuestionBlock: string): string[] {
  const questions: string[] = []
  let currentQuestionLines: string[] = []

  for (const rawLine of rawQuestionBlock.split(/\r?\n/)) {
    const line = rawLine.trim()
    const match = line.match(QUESTION_PATTERN)

    if (match) {
      if (currentQuestionLines.length > 0) {
        questions.push(finalizeQuestion(currentQuestionLines))
      }

      currentQuestionLines = [match[2]]
      continue
    }

    if (currentQuestionLines.length > 0) {
      currentQuestionLines.push(line)
    }
  }

  if (currentQuestionLines.length > 0) {
    questions.push(finalizeQuestion(currentQuestionLines))
  }

  return questions
}
