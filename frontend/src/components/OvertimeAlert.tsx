type OvertimeAlertProps = {
  overtimeSeconds: number
}

function formatSeconds(totalSeconds: number): string {
  return `${totalSeconds} second${totalSeconds === 1 ? '' : 's'}`
}

export function OvertimeAlert({ overtimeSeconds }: OvertimeAlertProps) {
  return (
    <section className="overtime-alert" role="status" aria-live="assertive">
      <strong>Target time reached.</strong> Keep answering — overtime is running for{' '}
      <span>{formatSeconds(overtimeSeconds)}</span>.
    </section>
  )
}
