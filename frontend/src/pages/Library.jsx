import { Heart, ListMusic, Music2, Play } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'

export default function Library() {
    const navigate = useNavigate()
    const { userPlaylists } = usePlayer()

    return (
    <div className="space-y-10">
        <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#d29a55]">
                Your space
            </p>
            <h1 className="font-['Space_Grotesk'] text-4xl font-bold">
                Library
            </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
            <button onClick={() => navigate('/liked-songs')} className="rounded-2xl border border-white/10 bg-white/4 p-5 text-left transition hover:bg-white/8">
                <Heart className="mb-8 text-[#f20909] fill-[#f20909]" />
                <p className="text-lg font-bold">
                    Liked music
                </p>
                <p className="mt-1 text-sm text-white/40">
                    Songs you want to keep close
                </p>
            </button>
            <button type="button" onClick={() => navigate('/playlists')} className="rounded-2xl border border-white/10 bg-white/4 p-5 text-left transition hover:bg-white/8">
                <ListMusic className="mb-8 text-[#efedeb]" />
                <p className="text-lg font-bold">
                    Playlists
                </p>
                <p className="mt-1 text-sm text-white/40">
                    Your hand-picked collections
                </p>
            </button>
            <Link to="/recently-played" className="rounded-2xl border border-white/10 bg-white/4 p-5 text-left transition hover:bg-white/8">
                <Music2 className="mb-8 text-[#0a989f]" />
                <p className="text-lg font-bold">
                    Recently played
                </p>
                <p className="mt-1 text-sm text-white/40">
                    Pick up where you left off
                </p>
            </Link>
        </div>
        <section>
            <h2 className="mb-5 text-xl font-bold">
                Your playlists
            </h2>
            <div className="space-y-2 grid grid-cols-3 gap-4">
                {userPlaylists.length ? userPlaylists.map((playlist) => (
                    <button key={playlist.id} type="button" onClick={() => navigate(`/playlist/${encodeURIComponent(String(playlist.id))}/${encodeURIComponent(playlist.name || 'playlist')}`)} className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/4 p-3 text-left transition hover:bg-white/8">
                        {playlist.image ? <img src={playlist.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#28251f] text-white/60"><ListMusic size={20} /></div>}
                        <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{playlist.name || 'Untitled playlist'}</span><span className="block truncate text-xs text-white/45">{playlist.description || `${playlist.songs?.length || 0} songs`}</span></span>
                        <Play size={17} className="text-white/50" />
                    </button>
                )) : <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-white/45">Your playlist will appear here.</p>}
            </div>
        </section>
    </div>
    )
}