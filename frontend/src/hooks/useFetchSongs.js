import { useEffect, useState } from 'react'
import { getSongs, getQuickPicksSongs, getNewReleaseSongs, getLongToListenSongs, recentGlobalQueries, LIBRARY_ROTATION_MS } from '../api/songs'

const getLibraryBucketKey = () => Math.floor(Date.now() / LIBRARY_ROTATION_MS)
const getDailyKey = (prefix) => `${prefix}_${new Date().toISOString().slice(0, 10)}`

export const useFetchSongs = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      const bucketKey = getLibraryBucketKey()
      const cachedKey = `autumn_library_${bucketKey}`
      const cached = localStorage.getItem(cachedKey)

      if (cached) {
        try {
          setSongs(JSON.parse(cached))
          setLoading(false)
          return
        } catch {
          localStorage.removeItem(cachedKey)
        }
      }

      setLoading(true)
      setError(null)

      try {
        const results = await getSongs(recentGlobalQueries, 5)
        setSongs(results)
        localStorage.setItem(cachedKey, JSON.stringify(results))
      } catch (err) {
        setError(err)
        setSongs([])
      } finally {
        setLoading(false)
      }
    }

    loadSongs()
  }, [])

  return { songs, setSongs, loading, error }
}

export const useFetchQuickPicks = (history = []) => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      const bucketKey = getDailyKey('autumn_quick_picks')
      const cached = localStorage.getItem(bucketKey)

      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length >= 24) {
            setSongs(parsed)
            setLoading(false)
            return
          }
          localStorage.removeItem(bucketKey)
        } catch {
          localStorage.removeItem(bucketKey)
        }
      }

      setLoading(true)
      setError(null)

      try {
        const results = await getQuickPicksSongs(history, 24)
        setSongs(results)
        localStorage.setItem(bucketKey, JSON.stringify(results))
      } catch (err) {
        setError(err)
        setSongs([])
      } finally {
        setLoading(false)
      }
    }

    loadSongs()
  }, [history])

  return { songs, loading, error }
}

export const useFetchNewReleases = (history = []) => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true)
      setError(null)

      try {
        const results = await getNewReleaseSongs(history, 8)
        setSongs(results)
      } catch (err) {
        setError(err)
        setSongs([])
      } finally {
        setLoading(false)
      }
    }

    loadSongs()
  }, [history])

  return { songs, loading, error }
}

export const useFetchLongSongs = (history = []) => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true)
      setError(null)

      try {
        const results = await getLongToListenSongs(history, 24)
        setSongs(results)
      } catch (err) {
        setError(err)
        setSongs([])
      } finally {
        setLoading(false)
      }
    }

    loadSongs()
  }, [history])

  return { songs, loading, error }
}