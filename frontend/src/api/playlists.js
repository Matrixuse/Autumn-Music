import axiosInstance from './axiosInstance'
import { getBestImageUrl } from '../utils/mediaQuality'

export const moodPlaylistSeeds = [
  { mood: 'romantic', query: 'romantic songs playlist' },
  { mood: 'party', query: 'party songs playlist' },
  { mood: 'chill', query: 'chill songs playlist' },
  { mood: 'sad', query: 'sad songs playlist' },
  { mood: 'happy', query: 'happy songs playlist' },
  { mood: 'workout', query: 'workout songs playlist' },
  { mood: 'night drive', query: 'night drive songs playlist' },
  { mood: 'travel', query: 'travel songs playlist' },
  { mood: 'rainy', query: 'rainy day songs playlist' },
  { mood: 'indie', query: 'indie music playlist' },
  { mood: 'lofi', query: 'lofi songs playlist' },
  { mood: 'devotional', query: 'devotional songs playlist' },
  { mood: 'fresh', query: 'new trending playlist' },
  { mood: 'focus', query: 'focus songs playlist' },
  { mood: 'dance', query: 'dance songs playlist' },
  { mood: 'old school', query: 'retro songs playlist' }
]

const readLanguageProfile = (history = []) => {
  const counts = {}

  history.forEach((track) => {
    const lang = String(track?.language || track?.lang || '').trim().toLowerCase()
    if (lang) counts[lang] = (counts[lang] || 0) + 1
  })

  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([language]) => language)
}

const chooseMoodOrder = (history = []) => {
  const preferred = readLanguageProfile(history)
  const preferredLanguage = preferred[0] || 'hindi'

  const languageBoost = {
    hindi: ['romantic', 'happy', 'sad', 'party', 'chill'],
    english: ['chill', 'workout', 'night drive', 'happy', 'indie'],
    punjabi: ['party', 'dance', 'happy', 'travel', 'fresh'],
    tamil: ['romantic', 'devotional', 'happy', 'chill', 'travel'],
    telugu: ['romantic', 'happy', 'chill', 'party', 'travel'],
    marathi: ['romantic', 'happy', 'sad', 'travel', 'fresh'],
    bengali: ['romantic', 'happy', 'sad', 'travel', 'fresh'],
    gujarati: ['romantic', 'happy', 'party', 'travel', 'fresh']
  }

  const boostMap = new Map()
  ;(languageBoost[preferredLanguage] || languageBoost.hindi).forEach((mood) => boostMap.set(mood, 2))

  const ranked = [...moodPlaylistSeeds].map((item) => ({
    ...item,
    weight: boostMap.get(item.mood) || 1,
    seed: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${item.mood}`
  })).sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight
    return a.seed.localeCompare(b.seed)
  })

  return ranked
}

export const getDailyMoodPlaylistQueries = (history = [], count = 10) => {
  const ranked = chooseMoodOrder(history)
  return ranked.slice(0, count).map((item) => item.query)
}

const normalizePlaylist = (playlist) => {
  const image = getBestImageUrl(playlist?.image) || getBestImageUrl(playlist?.images)

  return {
    id: playlist?.id || playlist?.title || `${playlist?.name || 'playlist'}-${Math.random().toString(36).slice(2, 8)}`,
    name: playlist?.name || playlist?.title || 'Mood mix',
    description: playlist?.description || playlist?.subtitle || 'A personal mood blend',
    image,
    url: playlist?.url || playlist?.perma_url || null,
    type: playlist?.type || 'playlist',
    language: playlist?.language || null,
    songCount: Number(playlist?.songCount || playlist?.numsongs || 0) || null
  }
}

export const searchPlaylists = async (query, limit = 10, page = 0) => {
  const response = await axiosInstance.get('/search/playlists', {
    params: { query, page, limit }
  })

  return (response.data?.data?.results || []).map(normalizePlaylist)
}

export const getMixForYouPlaylists = async (history = [], limit = 10) => {
  const queries = getDailyMoodPlaylistQueries(history, limit)
  const results = await Promise.all(
    queries.map(async (query) => {
      try {
        const items = await searchPlaylists(query, 6)
        return items.filter((item) => item.image || item.url)
      } catch {
        return []
      }
    })
  )

  const selected = []
  const seen = new Set()

  for (const batch of results) {
    for (const playlist of batch) {
      const key = `${playlist.id}-${playlist.name}`
      if (!seen.has(key)) {
        seen.add(key)
        selected.push(playlist)
      }
      if (selected.length >= limit) break
    }

    if (selected.length >= limit) break
  }

  if (selected.length >= limit) return selected.slice(0, limit)

  const fallback = await Promise.all(
    ['romantic songs playlist', 'party songs playlist', 'chill songs playlist', 'happy songs playlist', 'sad songs playlist', 'travel songs playlist']
      .map((query) => searchPlaylists(query, 3))
  )

  const fallbackItems = fallback.flat().filter((item) => item.image || item.url)
  for (const item of fallbackItems) {
    const key = `${item.id}-${item.name}`
    if (!seen.has(key)) {
      seen.add(key)
      selected.push(item)
    }
    if (selected.length >= limit) break
  }

  return selected.slice(0, limit)
}

export const createPlaylist = async (payload) => { throw new Error(`TODO: confirm playlist create endpoint for ${payload?.name || 'new playlist'}`) }
export const getPlaylistById = async (id) => { throw new Error(`TODO: confirm playlist detail endpoint for ${id}`) }
export const deletePlaylist = async (id) => { throw new Error(`TODO: confirm playlist delete endpoint for ${id}`) }
export { axiosInstance }