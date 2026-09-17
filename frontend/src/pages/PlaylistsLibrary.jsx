import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/common/Loader'
import PlaylistCard from '../components/cards/PlaylistCard'
import { moodPlaylistSeeds, searchPlaylists } from '../api/playlists'

const visibleMoods = moodPlaylistSeeds.slice(0, 10)

export default function PlaylistsLibrary() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadPlaylists = async () => {
      const results = await Promise.all(visibleMoods.map(async ({ mood, query }) => {
        try {
          const playlists = await searchPlaylists(query, 8)
          const unique = [...new Map(playlists.map((playlist) => [`${playlist.id}-${playlist.name}`, playlist])).values()]
          return { mood, playlists: unique }
        } catch {
          return { mood, playlists: [] }
        }
      }))

      if (isMounted) {
        setGroups(results.filter((group) => group.playlists.length))
        setLoading(false)
      }
    }

    loadPlaylists()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="space-y-8 text-white">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="rounded-full bg-white/6 p-2 hover:bg-white/12"><ArrowLeft size={20} /></button>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d29a55]">Your listening space</p>
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold">Playlists</h1>
          <p className="mt-2 text-sm text-white/45">Find a mix for every mood.</p>
        </div>
      </div>

      {loading ? <div className="grid min-h-56 place-items-center"><Loader label="Loading playlists" /></div> : groups.length ? groups.map(({ mood, playlists }) => (
        <section key={mood}>
          <h2 className="mb-4 font-['Space_Grotesk'] text-2xl font-bold capitalize">{mood}</h2>
          <div className="scrollbar-none -mx-1 flex gap-5 overflow-x-auto px-1 pb-2">
            {playlists.map((playlist) => <PlaylistCard key={`${mood}-${playlist.id}`} playlist={playlist} />)}
          </div>
        </section>
      )) : <p className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-white/45">No mood playlists are available right now.</p>}
    </div>
  )
}
