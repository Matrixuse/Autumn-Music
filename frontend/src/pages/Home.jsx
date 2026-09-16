import { useEffect, useMemo, useState } from 'react'
import MoodChips from '../components/sections/MoodChips'
import ListenAgain from '../components/sections/ListenAgain'
import PopularArtists from '../components/sections/PopularArtists'
import QuickPicks from '../components/sections/QuickPicks'
import LongToListen from '../components/sections/LongToListen'
import Footer from '../components/sections/Footer'
import Library from '../components/sections/Library'
import MixForYou from '../components/sections/MixForYou'
import Moods from '../components/sections/Moods'
import Albums from '../components/sections/Albums'
import Hollywood from '../components/sections/Hollywood'
import { useFetchSongs, useFetchQuickPicks, useFetchNewReleases, useFetchLongSongs } from '../hooks/useFetchSongs'
import { usePlayer } from '../context/PlayerContext'
import axiosInstance from '../api/axiosInstance'
import { getBestImageUrl } from '../utils/mediaQuality'
import { getHollywoodSongs } from '../api/songs'
import { getMixForYouPlaylists } from '../api/playlists'
import { getAlbumsForYou } from '../api/albums'

const getDailySeed = () => `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`

const shuffleBySeed = (items = []) => {
  const seed = getDailySeed()
  const array = [...items]

  for (let i = array.length - 1; i > 0; i -= 1) {
    const charCode = seed.charCodeAt((i + seed.length) % seed.length)
    const nextIndex = (charCode + i * 17) % (i + 1)
    ;[array[i], array[nextIndex]] = [array[nextIndex], array[i]]
  }

  return array
}

const getSuggestedLibrarySongs = (fallbackSongs = [], limit = 24) => {
  const basePool = Array.isArray(fallbackSongs) ? fallbackSongs.filter(Boolean) : []

  if (!basePool.length) return []

  return shuffleBySeed(basePool).slice(0, limit)
}

const fixedArtistNames = [
  'KK',
  'Arijit Singh',
  'Pritam',
  'Shreya Ghoshal',
  'Palak Muchhal',
  'A.R. Rahman',
  'Lata Mangeshkar',
  'Yo Yo Honey Singh',
  'Talwiinder',
  'Sunidhi Chauhan',
  'Mohit Chauhan',
  'Sonu Nigam',
  'Sachin-Jigar',
  'Neha Kakkar',
  'Atif Aslam',
  'Udit Narayan',
  'Vishal-Shekhar',
  'Shubh',
  'Guru Randhawa',
  'Badshah'
]

const normalizeName = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const fetchArtistDetails = async (name) => {
  try {
    const response = await axiosInstance.get('/search/artists', {
      params: { query: name, page: 0, limit: 5 }
    })

    const results = response.data?.data?.results || []
    const match = results.find((artist) => normalizeName(artist?.name) === normalizeName(name)) || results[0]

    return {
      id: match?.id || name,
      name: match?.name || name,
      image: getBestImageUrl(match?.image) || null
    }
  } catch {
    return { id: name, name, image: null }
  }
}

const playlists = [1, 2, 3, 4].map((id) => ({ id, name: `Collection ${id}`, description: 'A fresh listening set', image: null }))

export default function Home() {
  const [artists, setArtists] = useState([])
  const [mixPlaylists, setMixPlaylists] = useState([])
  const [albumsForYou, setAlbumsForYou] = useState([])
  const { songs, loading, error } = useFetchSongs()
  const { listenHistory } = usePlayer()
  const { songs: quickPickSongs, loading: quickLoading, error: quickError } = useFetchQuickPicks(listenHistory)
  const { songs: newReleaseSongs, loading: releaseLoading, error: releaseError } = useFetchNewReleases(listenHistory)
  const { songs: longSongs, loading: longLoading, error: longError } = useFetchLongSongs(listenHistory)
  const librarySongs = useMemo(() => getSuggestedLibrarySongs(songs, 24), [songs])
  const hollywoodSongs = useMemo(() => {
    const pool = [...(songs || []), ...(newReleaseSongs || []), ...(quickPickSongs || [])]
    return getHollywoodSongs(pool, 24)
  }, [songs, newReleaseSongs, quickPickSongs])
  const listenAgainSongs = listenHistory.length ? listenHistory : librarySongs

  useEffect(() => {
    let isMounted = true

    const loadArtists = async () => {
      const results = await Promise.all(fixedArtistNames.map(fetchArtistDetails))
      if (isMounted) setArtists(results)
    }

    const loadMixPlaylists = async () => {
      const results = await getMixForYouPlaylists(listenHistory, 10)
      if (isMounted) setMixPlaylists(results)
    }

    const loadAlbums = async () => {
      const results = await getAlbumsForYou(listenHistory, 10)
      if (isMounted) setAlbumsForYou(results)
    }

    loadArtists()
    loadMixPlaylists()
    loadAlbums()

    return () => {
      isMounted = false
    }
  }, [listenHistory])

  return (
    <div>
        <div className="space-y-10">
            <MoodChips />
            <ListenAgain songs={listenAgainSongs} />
            <QuickPicks songs={quickPickSongs} />
            <PopularArtists artists={artists} />
            <Library songs={librarySongs} />
            <MixForYou playlists={mixPlaylists} />
            <Moods songs={librarySongs} />
            <Hollywood songs={hollywoodSongs} />
            <Albums albums={albumsForYou} />
            <LongToListen songs={longSongs} />
            {loading && <div className="py-4 text-sm text-white/60">Loading songs…</div>}
            {error && !loading && <div className="py-4 text-sm text-red-400">Unable to load songs right now.</div>}
            {quickLoading && <div className="py-4 text-sm text-white/60">Preparing quick picks…</div>}
            {quickError && !quickLoading && <div className="py-4 text-sm text-red-400">Unable to load quick picks right now.</div>}
            {releaseLoading && <div className="py-4 text-sm text-white/60">Finding fresh releases…</div>}
            {releaseError && !releaseLoading && <div className="py-4 text-sm text-red-400">Unable to load release picks right now.</div>}
            {longLoading && <div className="py-4 text-sm text-white/60">Finding long-form tracks…</div>}
            {longError && !longLoading && <div className="py-4 text-sm text-red-400">Unable to load long-form picks right now.</div>}
        </div>
        <Footer />
    </div>
  )
}