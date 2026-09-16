import { formatTime } from '../../utils/formatTime'

export default function ProgressBar({ progress, duration, onSeek }) { 
    return (
        <div className="flex items-center gap-2 text-[10px] text-white/35">
            <span>{formatTime(progress)}</span>
            <input className="range-amber h-1 min-w-0 flex-1 cursor-pointer" type="range" min="0" max={duration || 1} value={progress} onChange={(event) => onSeek(event.target.value)} />
            <span>{formatTime(duration)}</span>
        </div>
    )
}