import { useState } from 'react'
import './App.css'
import { useSessionSetup } from './hooks/useSessionSetup'
import type { AnswerRecord } from './services/api'
import { History } from './pages/History'
import { PracticeSession } from './pages/PracticeSession'
import { SessionSetup } from './pages/SessionSetup'
import { SessionSummary } from './pages/SessionSummary'

type AppScreen = 'setup' | 'summary' | 'history'

type CompletedSession = {
  sessionId: string
  answers: AnswerRecord[]
}

export function App() {
  const sessionSetup = useSessionSetup()
  const [screen, setScreen] = useState<AppScreen>('setup')
  const [completedSession, setCompletedSession] = useState<CompletedSession | null>(null)

  if (screen === 'history') {
    return (
      <History
        onBack={() => {
          setScreen(completedSession ? 'summary' : 'setup')
        }}
      />
    )
  }

  if (screen === 'summary' && completedSession) {
    return (
      <SessionSummary
        sessionId={completedSession.sessionId}
        answers={completedSession.answers}
        onOpenHistory={() => setScreen('history')}
        onStartNewSession={() => {
          setCompletedSession(null)
          setScreen('setup')
        }}
      />
    )
  }

  if (sessionSetup.preparedSession) {
    return (
      <PracticeSession
        session={sessionSetup.preparedSession}
        onSessionComplete={(answers) => {
          setCompletedSession({
            sessionId: sessionSetup.preparedSession?.sessionId ?? answers[0]?.sessionId ?? '',
            answers,
          })
          sessionSetup.resetSession()
          setScreen('summary')
        }}
      />
    )
  }

  return (
    <SessionSetup
      rawQuestionBlock={sessionSetup.rawQuestionBlock}
      targetSecondsInput={sessionSetup.targetSecondsInput}
      parsedQuestions={sessionSetup.parsedQuestions}
      errorMessage={sessionSetup.errorMessage}
      onQuestionBlockChange={sessionSetup.setRawQuestionBlock}
      onTargetSecondsChange={sessionSetup.setTargetSecondsInput}
      onOpenHistory={() => setScreen('history')}
      onStartSession={sessionSetup.handleStartSession}
    />
  )
}

export default App
