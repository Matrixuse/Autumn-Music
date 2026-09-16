export default function Button({ children, variant = 'solid', className = '', ...props }) {
  const styles = variant === 'ghost' ? 'border border-white/10 bg-white/[.04] text-white hover:bg-white/[.08]' : 'bg-[#e6a44a] text-[#21160a] hover:bg-[#f1b65d]'
  return (
    <button className={`rounded-full px-4 py-2 text-sm font-bold transition ${styles} ${className}`} {...props}>
        {children}
    </button>
  )
}