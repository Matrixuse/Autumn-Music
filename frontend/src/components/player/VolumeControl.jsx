import { Volume2 } from 'lucide-react'

export default function VolumeControl({ volume, onChange }) { 
    return (
        <div className="hidden items-center gap-2 text-white/55 xl:flex">
            <Volume2 size={17} />
            <input className="range-amber w-20" type="range" min="0" max="1" step=".01" value={volume} onChange={(event) => onChange(Number(event.target.value))} />
        </div>
    )
}