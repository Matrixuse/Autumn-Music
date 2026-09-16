import { Compass, Home, Library } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [{ to: '/', label: 'Home', icon: Home }, { to: '/explore', label: 'Explore', icon: Compass }, { to: '/library', label: 'Library', icon: Library }]

export default function MobileNav({ locked = false }) {
  return <nav aria-disabled={locked} className={`fixed inset-x-0 bottom-19.5 z-30 flex border-t border-white/10 bg-[#090a0a]/95 px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:bottom-0 lg:hidden ${locked ? 'pointer-events-none opacity-60' : 'opacity-100'}`}>{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} tabIndex={locked ? -1 : 0} aria-disabled={locked} className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-semibold ${isActive ? 'text-[#e6a44a]' : 'text-white/45'} ${locked ? 'pointer-events-none' : ''}`}><Icon size={19} />{label}</NavLink>)}</nav>
}