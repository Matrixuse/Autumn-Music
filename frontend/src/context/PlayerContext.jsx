import { createContext, useContext, useEffect, useState } from 'react'
import { useAudioPlayer } from '../hooks/useAudioPlayer'

const PlayerContext = createContext(null)
const HISTORY_LIMIT = 18

const readHistory = () => {
  try {
    const raw = localStorage.getItem('autumn_listen_history')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const pushHistory = (history, track) => {
  if (!track || !track.id) return history

  const next = history.filter((entry) => entry && entry.id !== track.id)
  const merged = [{ ...track }, ...next].slice(0, HISTORY_LIMIT)
  return merged
}

const shuffleQueue = (tracks, activeTrack) => {
  const remaining = tracks.filter((track) => track?.id !== activeTrack?.id)
  for (let index = remaining.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[remaining[index], remaining[randomIndex]] = [remaining[randomIndex], remaining[index]]
  }
  return activeTrack ? [activeTrack, ...remaining] : remaining
}

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [listenHistory, setListenHistory] = useState(() => readHistory())
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false)
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isRecommendationQueue, setIsRecommendationQueue] = useState(false)

  useEffect(() => {
    localStorage.setItem('autumn_listen_history', JSON.stringify(listenHistory))
  }, [listenHistory])

  const playTrack = (track, nextQueue) => {
    if (!track) return

    const hasNewQueue = Array.isArray(nextQueue)
    const sourceQueue = hasNewQueue && nextQueue.length ? nextQueue : [track]
    setCurrentTrack(track)
    if (hasNewQueue) {
      setQueue(isShuffleEnabled ? shuffleQueue(sourceQueue, track) : sourceQueue)
      setIsRecommendationQueue(false)
    }
    setListenHistory((history) => pushHistory(history, track))
    setProgress(0)
    setIsPlaying(true)
  }

  const togglePlay = () => setIsPlaying((playing) => !playing)
  const next = () => {
    const index = queue.findIndex((track) => track.id === currentTrack?.id)
    const nextTrack = queue[index + 1]
    if (nextTrack) playTrack(nextTrack)
    else if (isShuffleEnabled && queue.length > 1) {
      const shuffledQueue = shuffleQueue(queue, currentTrack)
      playTrack(shuffledQueue[1], shuffledQueue)
    }
  }
  const previous = () => {
    const index = queue.findIndex((track) => track.id === currentTrack?.id)
    if (queue[index - 1]) playTrack(queue[index - 1])
  }
  const seek = (value) => { setProgress(Number(value)); if (audioRef.current) audioRef.current.currentTime = Number(value) }
  const handleTimeUpdate = (event) => setProgress(Number(event.currentTarget?.currentTime) || 0)
  const handleLoadedMetadata = (event) => setDuration(Number(event.currentTarget?.duration) || 0)
  const handleEnded = () => {
    if (isRepeatEnabled) {
      setProgress(0)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
      return
    }
    next()
  }
  const toggleShuffle = () => {
    setIsShuffleEnabled((enabled) => {
      const nextEnabled = !enabled
      if (nextEnabled && currentTrack && queue.length > 1) setQueue(shuffleQueue(queue, currentTrack))
      return nextEnabled
    })
  }
  const toggleRepeat = () => setIsRepeatEnabled((enabled) => !enabled)
  const toggleQueue = () => setIsQueueOpen((open) => !open)
  const closeQueue = () => setIsQueueOpen(false)
  const setPlaybackQueue = (tracks) => {
    if (!Array.isArray(tracks) || !tracks.length) return
    setQueue(tracks)
    setIsRecommendationQueue(true)
  }
  const { audioRef } = useAudioPlayer({ src: currentTrack?.audio, isPlaying, volume, onTimeUpdate: handleTimeUpdate, onEnded: handleEnded })

  return (
    <PlayerContext.Provider value={{ currentTrack, queue, listenHistory, isPlaying, progress, duration, volume, setVolume, isShuffleEnabled, isRepeatEnabled, isQueueOpen, isRecommendationQueue, playTrack, setPlaybackQueue, togglePlay, next, previous, seek, toggleShuffle, toggleRepeat, toggleQueue, closeQueue }}>
        {children}
        <audio ref={audioRef} src={currentTrack?.audio || undefined} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded} />
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)