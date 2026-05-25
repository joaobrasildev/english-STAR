type FinishConfirmationProps = {
  isSaving: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function FinishConfirmation({
  isSaving,
  onCancel,
  onConfirm,
}: FinishConfirmationProps) {
  return (
    <section className="finish-confirmation" role="alertdialog" aria-labelledby="finish-confirmation-title">
      <h2 id="finish-confirmation-title">Finish this answer?</h2>
      <p>
        Your answer will be saved as the final version for this question. The next
        question will only appear after a successful save.
      </p>
      <div className="confirmation-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={isSaving}
        >
          Keep editing
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={onConfirm}
          disabled={isSaving}
        >
          {isSaving ? 'Saving answer...' : 'Confirm and save'}
        </button>
      </div>
    </section>
  )
}
