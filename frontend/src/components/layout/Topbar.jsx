import { LogOut, Menu, UserRound } from 'lucide-react'
import SearchBar from '../common/SearchBar'
import Avatar from '../common/Avatar'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Topbar({ locked = false }) {
    const { user, logout } = useAuth()
    const disabledState = locked ? 'pointer-events-none opacity-60' : ''

    return (
    <header aria-disabled={locked} className={`sticky top-0 z-20 flex items-center gap-4 bg-[#080909]/80 px-5 py-3 backdrop-blur-xl lg:px-10 ${disabledState}`}>
        <button disabled={locked} className="text-white/70 lg:hidden" aria-label="Open navigation menu">
            <Menu size={21} />
        </button>
        <SearchBar disabled={locked} />
        <div className={`group relative ml-auto flex items-center gap-2 text-white/80 ${locked ? 'pointer-events-none' : ''}`}>
            <h4 className="hidden text-sm sm:block">Hi, {user?.username || 'there'}</h4>
            <div className="relative">
                <button disabled={locked} aria-label="Account menu" className={locked ? 'cursor-not-allowed' : ''}><Avatar label={user?.username || 'Hi'} /></button>
                <div className="absolute right-0 top-11 w-44 translate-y-1 rounded-xl border border-white/10 bg-[#1a1b1a] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {user ? 
                    <div>
                    <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                        <UserRound size={15} />
                        Profile
                    </Link>
                    <button disabled={locked} onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white">
                        <LogOut size={15} />
                        Log out
                    </button>
                    </div> : <div>
                                    <Link to="/login" className="block rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="block rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                                        Sign Up
                                    </Link>
                                </div>
                    }
                </div>
            </div>
        </div>
    </header>
)}