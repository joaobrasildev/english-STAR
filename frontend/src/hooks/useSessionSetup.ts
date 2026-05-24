import { useMemo, useState } from 'react'
import type { PreparedSession } from '../types/session'
import { parseQuestions } from '../utils/parseQuestions'

const DEFAULT_TARGET_SECONDS = 120

function createEmptyAnswer() {
  return {
    s: '',
    t: '',
    a: '',
    r: '',
  }
}

export function useSessionSetup() {
  const [rawQuestionBlock, setRawQuestionBlock] = useState('')
  const [targetSecondsInput, setTargetSecondsInput] = useState(String(DEFAULT_TARGET_SECONDS))
  const [errorMessage, setErrorMessage] = useState('')
  const [preparedSession, setPreparedSession] = useState<PreparedSession | null>(null)

  const parsedQuestions = useMemo(
    () => parseQuestions(rawQuestionBlock),
    [rawQuestionBlock],
  )

  function handleStartSession() {
    if (parsedQuestions.length === 0) {
      setPreparedSession(null)
      setErrorMessage('Add at least one numbered question before starting.')
      return
    }

    const parsedTarget = Number(targetSecondsInput)
    if (!Number.isInteger(parsedTarget) || parsedTarget <= 0) {
      setPreparedSession(null)
      setErrorMessage('Target time must be a positive number of seconds.')
      return
    }

    setErrorMessage('')
    setPreparedSession({
      rawQuestionBlock,
      parsedQuestions,
      targetSeconds: parsedTarget,
      currentIndex: 0,
      currentAnswer: createEmptyAnswer(),
      timerState: 'idle',
    })
  }

  return {
    rawQuestionBlock,
    targetSecondsInput,
    parsedQuestions,
    errorMessage,
    preparedSession,
    setRawQuestionBlock,
    setTargetSecondsInput,
    handleStartSession,
  }
}
