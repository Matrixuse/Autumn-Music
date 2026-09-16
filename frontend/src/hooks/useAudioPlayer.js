import { useEffect, useRef } from 'react'

export const useAudioPlayer = ({ src, isPlaying, volume, onTimeUpdate, onEnded }) => {
  const audioRef = useRef(null)

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying && src) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }, [isPlaying, src])

  return { audioRef, onTimeUpdate, onEnded }
}