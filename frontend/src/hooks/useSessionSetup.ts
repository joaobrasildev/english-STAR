import { useMemo, useState } from 'react'
import { createSession, type CreateSessionResponse } from '../services/api'
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

type UseSessionSetupOptions = {
  createSessionRequest?: (input: {
    rawQuestionBlock: string
    parsedQuestions: string[]
    targetSeconds: number
  }) => Promise<CreateSessionResponse>
}

export function useSessionSetup(options: UseSessionSetupOptions = {}) {
  const createSessionRequest = options.createSessionRequest ?? createSession
  const [rawQuestionBlock, setRawQuestionBlock] = useState('')
  const [targetSecondsInput, setTargetSecondsInput] = useState(String(DEFAULT_TARGET_SECONDS))
  const [errorMessage, setErrorMessage] = useState('')
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [preparedSession, setPreparedSession] = useState<PreparedSession | null>(null)

  const parsedQuestions = useMemo(
    () => parseQuestions(rawQuestionBlock),
    [rawQuestionBlock],
  )

  async function handleStartSession() {
    if (isStartingSession) {
      return
    }

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
    setIsStartingSession(true)

    try {
      const session = await createSessionRequest({
        rawQuestionBlock,
        parsedQuestions,
        targetSeconds: parsedTarget,
      })

      setPreparedSession({
        sessionId: session.sessionId,
        rawQuestionBlock: session.rawQuestionBlock,
        parsedQuestions: session.parsedQuestions,
        targetSeconds: session.targetSeconds,
        currentIndex: 0,
        currentAnswer: createEmptyAnswer(),
        timerState: 'idle',
      })
    } catch (error: unknown) {
      setPreparedSession(null)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to start the session. Please try again.',
      )
    } finally {
      setIsStartingSession(false)
    }
  }

  function resetSession() {
    setPreparedSession(null)
  }

  return {
    rawQuestionBlock,
    targetSecondsInput,
    parsedQuestions,
    errorMessage,
    isStartingSession,
    preparedSession,
    setRawQuestionBlock,
    setTargetSecondsInput,
    handleStartSession,
    resetSession,
  }
}
