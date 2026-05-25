type QuestionPreviewProps = {
  questions: string[]
}

export function QuestionPreview({ questions }: QuestionPreviewProps) {
  return (
    <section className="preview-panel" aria-labelledby="preview-title">
      <div className="panel-header">
        <h2 id="preview-title">Question preview</h2>
        <span>{questions.length} item(s)</span>
      </div>

      {questions.length === 0 ? (
        <p className="helper-copy">
          Paste numbered questions to preview the order before starting the session.
        </p>
      ) : (
        <ol className="preview-list">
          {questions.map((question, index) => (
            <li key={`${index}-${question}`}>
              <p className="preview-question">{question}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
