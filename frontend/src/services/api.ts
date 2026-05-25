export type CreateAnswerPayload = {
  sessionId: string
  questionOrder: number
  questionText: string
  fullAnswer: string
  targetSeconds: number
  elapsedSeconds: number
}

export type AnswerRecord = {
  id: string
  sessionId: string
  questionOrder: number
  questionText: string
  fullAnswer: string
  targetSeconds: number
  elapsedSeconds: number
  createdAt: string
  updatedAt: string
}

export type SessionSummary = {
  sessionId: string
  answeredCount: number
  targetSeconds: number
  totalElapsedSeconds: number
  completedAt: string
}

export type CreateSessionPayload = {
  rawQuestionBlock: string
  parsedQuestions: string[]
  targetSeconds: number
}

export type CreateSessionResponse = {
  sessionId: string
  rawQuestionBlock: string
  parsedQuestions: string[]
  targetSeconds: number
  status?: 'active'
}

const DEFAULT_API_BASE_URL = 'http://localhost:3100'
export const SAVE_ANSWER_RETRY_MESSAGE =
  'Failed to save the answer. Please try again.'
export const CREATE_SESSION_RETRY_MESSAGE =
  'Failed to start the session. Please try again.'

type ApiErrorResponse = {
  message?: string | string[]
}

function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  return configuredBaseUrl || DEFAULT_API_BASE_URL
}

function getErrorMessage(body: ApiErrorResponse, fallbackMessage: string): string {
  if (Array.isArray(body.message) && body.message.length > 0) {
    return body.message.join(', ')
  }

  if (typeof body.message === 'string' && body.message.trim().length > 0) {
    return body.message
  }

  return fallbackMessage
}

export function assertValidSessionId(sessionId: string): string {
  const normalizedSessionId = sessionId.trim()

  if (normalizedSessionId.length === 0) {
    throw new Error(SAVE_ANSWER_RETRY_MESSAGE)
  }

  return normalizedSessionId
}

export async function createSession(
  payload: CreateSessionPayload,
): Promise<CreateSessionResponse> {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Failed to start the session. Please check the backend connection.')
  }

  if (!response.ok) {
    let errorBody: ApiErrorResponse | undefined

    try {
      errorBody = (await response.json()) as ApiErrorResponse
    } catch {
      errorBody = undefined
    }

    throw new Error(
      getErrorMessage(
        errorBody ?? {},
        CREATE_SESSION_RETRY_MESSAGE,
      ),
    )
  }

  return (await response.json()) as CreateSessionResponse
}

export async function createAnswer(
  payload: CreateAnswerPayload,
): Promise<AnswerRecord> {
  const validatedPayload = {
    ...payload,
    sessionId: assertValidSessionId(payload.sessionId),
  }
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedPayload),
    })
  } catch {
    throw new Error('Failed to save the answer. Please check the backend connection.')
  }

  if (!response.ok) {
    let errorBody: ApiErrorResponse | undefined

    try {
      errorBody = (await response.json()) as ApiErrorResponse
    } catch {
      errorBody = undefined
    }

    throw new Error(
      getErrorMessage(
        errorBody ?? {},
        SAVE_ANSWER_RETRY_MESSAGE,
      ),
    )
  }

  return (await response.json()) as AnswerRecord
}

export async function listSessions(): Promise<SessionSummary[]> {
  const response = await fetch(`${getApiBaseUrl()}/sessions`)

  if (!response.ok) {
    throw new Error('Failed to load the saved sessions.')
  }

  return (await response.json()) as SessionSummary[]
}

export async function listAnswersBySession(
  sessionId: string,
): Promise<AnswerRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/sessions/${sessionId}/answers`)

  if (!response.ok) {
    let errorBody: ApiErrorResponse | undefined

    try {
      errorBody = (await response.json()) as ApiErrorResponse
    } catch {
      errorBody = undefined
    }

    throw new Error(
      getErrorMessage(
        errorBody ?? {},
        'Failed to load the answers for this session.',
      ),
    )
  }

  return (await response.json()) as AnswerRecord[]
}
