import type { CurrentAnswer } from '../types/session'

const STAR_FIELDS: Array<{
  key: keyof CurrentAnswer
  label: string
  helper: string
}> = [
  {
    key: 's',
    label: 'Situation (S)',
    helper: 'Describe the context and the challenge around this question.',
  },
  {
    key: 't',
    label: 'Task (T)',
    helper: 'Explain the responsibility or goal you had to address.',
  },
  {
    key: 'a',
    label: 'Action (A)',
    helper: 'Capture the concrete steps you took in response.',
  },
  {
    key: 'r',
    label: 'Result (R)',
    helper: 'Close with the measurable outcome or lesson learned.',
  },
]

type StarAnswerFormProps = {
  answer: CurrentAnswer
  onChange: (field: keyof CurrentAnswer, value: string) => void
}

export function StarAnswerForm({ answer, onChange }: StarAnswerFormProps) {
  return (
    <section className="answer-form-panel" aria-labelledby="star-answer-title">
      <div className="panel-header">
        <h2 id="star-answer-title">STAR answer builder</h2>
        <span>4 paragraphs</span>
      </div>

      <div className="star-grid">
        {STAR_FIELDS.map((field) => (
          <label className="field-group" htmlFor={`answer-${field.key}`} key={field.key}>
            <span className="field-label">{field.label}</span>
            <span className="field-helper">{field.helper}</span>
            <textarea
              id={`answer-${field.key}`}
              className="star-textarea"
              value={answer[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
              rows={5}
            />
          </label>
        ))}
      </div>
    </section>
  )
}
