export default function Stars({ value, size = 15 }: { value: number; size?: number }) {
  const full = Math.round(value)
  return (
    <span aria-label={`${value.toFixed(1)} out of 5`} style={{ color: 'var(--gold)', fontSize: size, letterSpacing: 1, lineHeight: 1 }}>
      {'★'.repeat(full)}
      <span style={{ color: '#d9d5cc' }}>{'★'.repeat(5 - full)}</span>
    </span>
  )
}
