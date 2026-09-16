import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import axiosInstance from '../api/axiosInstance'
import { getBestImageUrl } from '../utils/mediaQuality'
import SongCard from '../components/cards/SongCard'
import MoodChips from '../components/sections/MoodChips'

const moodMap = {
  Relax: 'relaxing',
  Romance: 'romantic',
  'Feel good': 'happy',
  Party: 'party',
  Energise: 'energetic',
  Sad: 'sad',
  Focus: 'focus',
  'Work out': 'workout',
  Sleep: 'sleep'
}

const normalizeSong = (song = {}) => ({
  id: song.id || song._id || `${song.name || song.title || 'song'}-${Math.random().toString(36).slice(2, 8)}`,
  title: song.name || song.title || 'Unknown Track',
  artist: Array.isArray(song.artists?.all)
    ? song.artists.all.map((artist) => artist?.name || artist?.title).filter(Boolean).join(', ')
    : Array.isArray(song.artists?.primary)
      ? song.artists.primary.map((artist) => artist?.name || artist?.title).filter(Boolean).join(', ')
      : song.artist || song.subtitle || 'Unknown Artist',
  image: getBestImageUrl(song.image || song.cover || song.artwork || song.thumbnail || []) || null,
  duration: Number(song.duration || song.more_info?.duration || 0) || 0,
  raw: song,
})

export default function MoodChipsPage() {
  const { moodName } = useParams()
  const decodedMood = decodeURIComponent(String(moodName || ''))
  const query = moodMap[decodedMood] ? `${moodMap[decodedMood]} songs` : `${decodedMood || 'happy'} songs`
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadMoodSongs = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axiosInstance.get('/search/songs', {
          params: { query, page: 0, limit: 20 },
          signal: controller.signal,
        })

        const results = response.data?.data?.results || []

        if (!controller.signal.aborted) {
          setSongs(results.map(normalizeSong))
        }
      } catch {
        if (!controller.signal.aborted) {
          setSongs([])
          setError('Unable to load songs for this mood right now.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMoodSongs()
    return () => controller.abort()
  }, [query])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8 text-center text-white">
        <div className="max-w-md rounded-2xl border border-gray-700 bg-[#0f0f0f]/80 p-8 shadow-xl">
          <p className="text-lg font-semibold">Loading {decodedMood || 'this mood'}...</p>
          <p className="mt-2 text-sm text-gray-400">Please wait while we find songs for your mood.</p>
        </div>
      </div>
    )
  }

  if (error || !songs.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8 text-center text-white">
        <div className="max-w-md rounded-2xl border border-gray-700 bg-[#0f0f0f]/80 p-8 shadow-xl">
          <p className="text-lg font-semibold">No songs for this mood yet.</p>
          <p className="mt-2 text-sm text-gray-400">{error || 'Try another mood chip to explore more music.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <MoodChips />
      
      <div>
        <h1 className="mt-2 font-['Space_Grotesk'] text-4xl font-bold">{decodedMood}</h1>
      </div>
    </div>
  )
};
