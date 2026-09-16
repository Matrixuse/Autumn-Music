export default function Avatar({ label = 'A', image, size = 'md' }) {
  const dimensions = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-9 w-9 text-xs'
  return (
    image ? 
        <img src={image} alt="Profile" className={`${dimensions} rounded-full object-cover`} /> : 
        <div className={`${dimensions} grid place-items-center rounded-full border border-[#1c5387] bg-[#0b2446] font-bold text-[#e0ebec]`}>
            {label.slice(0, 2).toUpperCase()}
        </div>
  )
}