import { useMemo, useState } from 'react'
import { ArrowLeft, Heart, Play, Search, Shuffle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import { formatTime } from '../utils/formatTime'
import SongActionsMenu from '../components/common/SongActionsMenu'

export default function LikedSongPage() {
  const navigate = useNavigate()
  const { likedSongs, currentTrack, playTrack } = usePlayer()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSongs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return likedSongs
    return likedSongs.filter((song) => `${song.title} ${song.artist}`.toLowerCase().includes(term))
  }, [likedSongs, searchTerm])

  const playAll = () => {
    if (likedSongs.length) playTrack(likedSongs[0], likedSongs)
  }

  const shuffleAll = () => {
    if (!likedSongs.length) return
    const shuffled = [...likedSongs].sort(() => Math.random() - 0.5)
    playTrack(shuffled[0], shuffled)
  }

  return (
    <div className="min-h-[60vh] text-white flex gap-3">
      <div className="w-2/6 rounded-xl p-5 shadow-xl md:p-5">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="rounded-full bg-white/6 p-2 hover:bg-white/12"><ArrowLeft size={20} /></button>
          <button type="button" onClick={() => setSearchOpen((open) => !open)} aria-label={searchOpen ? 'Close search' : 'Search liked songs'} className="rounded-full bg-white/6 p-2 hover:bg-white/12">{searchOpen ? <X size={20} /> : <Search size={20} />}</button>
        </div>
        <div className="mt-3 flex flex-col items-center">
            <img src="/likedsong.png" alt="Liked songs" className="mt-5 aspect-square w-60 h-60 rounded-xl object-cover" />
        </div>
        <div className="min-w-0 flex flex-col items-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#8e8787]">Favourite collection</p>
            <h1 className="truncate font-['Space_Grotesk'] text-3xl font-bold">Liked music</h1>
            <p className="mt-1 text-sm text-white/45">{likedSongs.length} {likedSongs.length === 1 ? 'Liked Songs' : 'Liked Song'}</p>
        </div>
        <div className="mt-6 flex justify-center items-center gap-3">
          <button type="button" onClick={playAll} disabled={!likedSongs.length} className="flex items-center gap-2 rounded-full bg-[#f5f1f1] px-5 py-3 text-sm font-bold text-[#21160a] disabled:cursor-not-allowed disabled:opacity-40"><Play size={17} fill="currentColor" />Play all</button>
          <button type="button" onClick={shuffleAll} disabled={!likedSongs.length} aria-label="Shuffle liked songs" className="rounded-full border border-white/10 bg-white/6 p-3 disabled:cursor-not-allowed disabled:opacity-40"><Shuffle size={18} /></button>
        </div>
      </div>

      <div className="flex-1 w-2/6">
        {likedSongs.length === 0 ? (
            <div className="grid min-h-56 place-items-center rounded-2xl border border-white/10 bg-white/3 p-8 text-center">
                {searchOpen && <input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search liked songs..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#dbcece]" />}
                <br />
                <div>
                    <Heart className="mx-auto mb-3 text-white" size={34} />
                    <p className="text-lg font-semibold">
                        No liked songs yet
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                        Tap the like button on songs to save it here.
                    </p>
                </div>
            </div>
        ) : filteredSongs.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/45">No liked songs match your search.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
            {searchOpen && <input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search liked songs..." className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#dcd5d5]" />}
            {filteredSongs.map((song, index) => {
              const active = currentTrack?.id === song.id
              return (
                <article key={song.id} className={`flex items-center gap-3 border-b border-white/6 px-4 py-3 last:border-b-0 ${active ? 'bg-[#c88d3b]/10' : 'hover:bg-white/4'}`}>
                    <span className="w-6 text-center text-xs text-white/35">{index + 1}</span>
                    <button type="button" onClick={() => playTrack(song, likedSongs)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        {song.image ? <img src={song.image} alt="" className="h-12 w-12 shrink-0 rounded object-cover" /> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-[#28251f] text-xs text-white/50">AU</div>}
                        <span className="min-w-0"><span className="block truncate text-sm font-semibold">{song.title || 'Untitled track'}</span><span className="block truncate text-xs text-white/45">{song.artist || 'Unknown Artist'}</span></span>
                    </button>
                    <SongActionsMenu song={song} queue={likedSongs} alwaysVisible />
                    <span className="hidden text-xs text-white/40 sm:block">{formatTime(song.duration)}</span>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
