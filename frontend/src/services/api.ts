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

const DEFAULT_API_BASE_URL = 'http://localhost:3100'

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

export async function createAnswer(
  payload: CreateAnswerPayload,
): Promise<AnswerRecord> {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
        'Failed to save the answer. Please try again.',
      ),
    )
  }

  return (await response.json()) as AnswerRecord
}
