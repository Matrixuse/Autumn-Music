export default function Loader({ label = 'Loading', className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`} role="status" aria-label={label}>
        <span className="loader" aria-hidden="true" />
        <span className="sr-only">{label}</span>
    </span>
  )
}