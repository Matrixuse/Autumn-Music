import { useEffect, useRef } from 'react'

export const EQ_FREQUENCIES = [30, 60, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

export const EQ_PRESETS = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Bass Boost': [6, 6, 5, 4, 2, 0, -2, -3, -4, -5],
  Vocal: [0, 1, 2, 4, 5, 3, 1, -1, -1, 0],
  'Treble Boost': [-2, -1, 0, 1, 2, 3, 5, 7, 8, 9],
  Pop: [4, 3, 2, 1, 0, -1, 0, 2, 3, 4],
  Rock: [5, 4, 3, 2, 1, 0, -1, 1, 3, 5],
  'Night Drive': [3, 3, 2, 1, 0, -1, -1, 1, 2, 4],
}

const defaultBands = EQ_PRESETS.Flat

export const useEqualizerEngine = ({ audioElement, gains = defaultBands, enabled = true }) => {
  const contextRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const preGainRef = useRef(null)
  const outputGainRef = useRef(null)
  const filtersRef = useRef([])

  useEffect(() => {
    if (!audioElement || typeof window === 'undefined') return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    if (!contextRef.current) {
      const context = new AudioContextClass()
      const mediaSource = context.createMediaElementSource(audioElement)
      const preGain = context.createGain()
      const outputGain = context.createGain()
      const filters = EQ_FREQUENCIES.map((frequency) => {
        const filter = context.createBiquadFilter()
        filter.type = 'peaking'
        filter.frequency.value = frequency
        filter.Q.value = 1.2
        filter.gain.value = 0
        return filter
      })

      let previousNode = mediaSource
      previousNode.connect(preGain)
      previousNode = preGain
      filters.forEach((filter) => {
        previousNode.connect(filter)
        previousNode = filter
      })
      previousNode.connect(outputGain)
      outputGain.connect(context.destination)

      contextRef.current = context
      sourceNodeRef.current = mediaSource
      preGainRef.current = preGain
      outputGainRef.current = outputGain
      filtersRef.current = filters
    }

    const context = contextRef.current
    if (context.state === 'suspended') {
      context.resume().catch(() => {})
    }

    const safeGains = Array.isArray(gains) ? gains : defaultBands
    filtersRef.current.forEach((filter, index) => {
      filter.gain.value = Number(safeGains[index] ?? 0)
    })

    if (outputGainRef.current) {
      outputGainRef.current.gain.value = enabled ? 1 : 0
    }
  }, [audioElement, gains, enabled])

  useEffect(() => {
    return () => {
      if (contextRef.current && contextRef.current.state !== 'closed') {
        contextRef.current.close().catch(() => {})
      }
    }
  }, [])

  return null
}
