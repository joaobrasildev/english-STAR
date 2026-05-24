type QuestionParserProps = {
  value: string
  onChange: (value: string) => void
}

export function QuestionParser({ value, onChange }: QuestionParserProps) {
  return (
    <label className="field-group">
      <span className="field-label">Questions</span>
      <textarea
        className="questions-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={'1. Tell me about yourself\n2. Describe a challenge you solved'}
        rows={10}
      />
    </label>
  )
}
