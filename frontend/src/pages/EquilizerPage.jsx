import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Volume2, Zap, Power, Music2, RotateCcw, ArrowLeft } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { EQ_PRESETS, EQ_FREQUENCIES, useEqualizerEngine } from '../hooks/useEqualizerEngine'

const createPresetBands = (presetName) => EQ_PRESETS[presetName] || EQ_PRESETS.Flat

export default function EquilizerPage() {
  const navigate = useNavigate()
  const { currentTrack, isPlaying, togglePlay, volume, setVolume } = usePlayer()
  const [audioElement, setAudioElement] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState('Flat')
  const [isEnabled, setIsEnabled] = useState(true)
  const [bands, setBands] = useState(createPresetBands('Flat'))

  useEffect(() => {
    if (typeof document !== 'undefined') setAudioElement(document.querySelector('audio'))
  }, [currentTrack])

  useEqualizerEngine({
    audioElement,
    gains: bands,
    enabled: isEnabled,
  })

  const bandControls = useMemo(
    () =>
      EQ_FREQUENCIES.map((frequency, index) => ({
        frequency,
        value: bands[index] ?? 0,
        label: frequency >= 1000 ? `${Math.round(frequency / 1000)}k` : `${frequency}`,
      })),
    [bands],
  )

  const updateBand = (index, nextValue) => {
    const updated = [...bands]
    updated[index] = Number(nextValue)
    setBands(updated)
    setSelectedPreset('Custom')
  }

  const applyPreset = (presetName) => {
    const nextBands = createPresetBands(presetName)
    setBands(nextBands)
    setSelectedPreset(presetName)
  }

  const resetToFlat = () => {
    setBands(EQ_PRESETS.Flat)
    setSelectedPreset('Flat')
  }

  const setPresetFromCurrentBands = () => {
    const hasCustom = bands.some((band) => band !== 0)
    if (!hasCustom) {
      setSelectedPreset('Flat')
      return
    }
    setSelectedPreset('Custom')
  }

  useEffect(() => {
    setPresetFromCurrentBands()
  }, [bands])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[28px] border border-white/10 bg-[#0b0b0c]/80 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center rounded-full gap-2 text-sm text-white/50 hover:text-white" aria-label="Go back">
            <ArrowLeft size={21} />
        </button>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b86a24]/15 text-[#f0b76a]">
            <SlidersHorizontal size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/45">Audio control</p>
            <h1 className="text-2xl font-bold text-white">Equalizer</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEnabled((value) => !value)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isEnabled ? 'bg-[#b86a24] text-[#1b130a]' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
          >
            <Power size={16} className={isEnabled ? 'text-[#1b130a]' : 'text-white'} />
            {isEnabled ? 'EQ On' : 'EQ Off'}
          </button>

          <button
            onClick={resetToFlat}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/[0.08]"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#111214] p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Music2 size={18} />
              <span className="text-sm font-medium">Frequency response</span>
            </div>
            <div className="rounded-full border border-[#b86a24]/30 bg-[#b86a24]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f3c07a]">
              {selectedPreset}
            </div>
          </div>

          <div className="flex h-[260px] items-end justify-between gap-2 overflow-hidden rounded-2xl border border-white/5 bg-[linear-gradient(180deg,#16181d_0%,#0f1013_100%)] px-2 py-4 md:gap-3 md:px-4">
            {bandControls.map(({ frequency, value, label }) => (
              <div key={frequency} className="flex flex-1 flex-col items-center justify-end gap-3">
                <div className="flex w-full items-end justify-center">
                  <input
                    aria-label={`Equalizer band ${label}`}
                    className="h-[170px] w-full cursor-pointer appearance-none rounded-xl bg-transparent accent-[#d88843]"
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={value}
                    onChange={(event) => updateBand(bandControls.findIndex((item) => item.frequency === frequency), event.target.value)}
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                  />
                </div>
                <div className="flex w-full flex-col items-center gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">{label}</span>
                  <span className="text-[10px] text-white/70">{value} dB</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/10 bg-[#111214] p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-white/75">
              <Zap size={18} />
              <h2 className="text-base font-semibold text-white">Presets</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.keys(EQ_PRESETS).map((presetName) => (
                <button
                  key={presetName}
                  onClick={() => applyPreset(presetName)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${selectedPreset === presetName ? 'border-[#d88843] bg-[#d88843]/15 text-[#f0b76a]' : 'border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]'}`}
                >
                  {presetName}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#111214] p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2 text-white/75">
              <Volume2 size={18} />
              <h2 className="text-base font-semibold text-white">Output</h2>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-white/70">
                <div className="mb-2 flex items-center justify-between">
                  <span>Master volume</span>
                  <span>{Number(volume).toFixed(2)}</span>
                </div>
                <input
                  aria-label="Master volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-[#d88843]"
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Current track</p>
                <div className="mt-2 min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{currentTrack?.title || 'No track selected'}</p>
                  <p className="truncate text-xs text-white/55">{currentTrack?.artist || 'Choose a song to preview the equalizer'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => (isPlaying ? togglePlay() : togglePlay())}
          className="rounded-full bg-[#b86a24] px-5 py-2.5 text-sm font-bold text-[#1b130a] transition hover:bg-[#d88843]"
        >
        </button>
      </div>
    </div>
  )
}
