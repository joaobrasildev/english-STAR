import './App.css'
import { useSessionSetup } from './hooks/useSessionSetup'
import { PracticeSession } from './pages/PracticeSession'
import { SessionSetup } from './pages/SessionSetup'

export function App() {
  const sessionSetup = useSessionSetup()

  if (sessionSetup.preparedSession) {
    return <PracticeSession session={sessionSetup.preparedSession} />
  }

  return (
    <SessionSetup
      rawQuestionBlock={sessionSetup.rawQuestionBlock}
      targetSecondsInput={sessionSetup.targetSecondsInput}
      parsedQuestions={sessionSetup.parsedQuestions}
      errorMessage={sessionSetup.errorMessage}
      onQuestionBlockChange={sessionSetup.setRawQuestionBlock}
      onTargetSecondsChange={sessionSetup.setTargetSecondsInput}
      onStartSession={sessionSetup.handleStartSession}
    />
  )
}

export default App
