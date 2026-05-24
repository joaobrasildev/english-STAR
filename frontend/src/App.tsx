import './App.css'
import { useSessionSetup } from './hooks/useSessionSetup'
import { SessionSetup } from './pages/SessionSetup'

export function App() {
  const sessionSetup = useSessionSetup()

  return (
    <SessionSetup
      rawQuestionBlock={sessionSetup.rawQuestionBlock}
      targetSecondsInput={sessionSetup.targetSecondsInput}
      parsedQuestions={sessionSetup.parsedQuestions}
      errorMessage={sessionSetup.errorMessage}
      preparedSession={sessionSetup.preparedSession}
      onQuestionBlockChange={sessionSetup.setRawQuestionBlock}
      onTargetSecondsChange={sessionSetup.setTargetSecondsInput}
      onStartSession={sessionSetup.handleStartSession}
    />
  )
}

export default App
