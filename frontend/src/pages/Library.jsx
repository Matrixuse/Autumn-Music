import { Heart, ListMusic, Music2 } from 'lucide-react'
import PlaylistCard from '../components/cards/PlaylistCard'

const playlists = [1, 2, 3].map((id) => ({ id, name: `Playlist ${id}`, description: 'Your collection', image: null }))
export default function Library() { return (
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
            <button className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
                <Heart className="mb-8 text-[#efedeb]" />
                <p className="text-lg font-bold">
                    Liked music
                </p>
                <p className="mt-1 text-sm text-white/40">
                    Songs you want to keep close
                </p>
            </button>
            <button className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
                <ListMusic className="mb-8 text-[#efedeb]" />
                <p className="text-lg font-bold">
                    Playlists
                </p>
                <p className="mt-1 text-sm text-white/40">
                    Your hand-picked collections
                </p>
            </button>
            <button className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
                <Music2 className="mb-8 text-[#efedeb]" />
                <p className="text-lg font-bold">
                    Recently played
                </p>
                <p className="mt-1 text-sm text-white/40">
                    Pick up where you left off
                </p>
            </button>
        </div>
        <section>
            <h2 className="mb-5 text-xl font-bold">
                Your playlists
            </h2>
            <div className="scrollbar-none flex gap-5 overflow-x-auto">
                {playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
            </div>
        </section>
    </div>
)}