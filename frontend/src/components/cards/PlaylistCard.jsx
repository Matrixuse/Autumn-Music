import { Link } from 'react-router-dom'
import { getBestImageUrl } from '../../utils/mediaQuality'

export default function PlaylistCard({ playlist, to, compact = false }) { 
    const image = getBestImageUrl(playlist.image || playlist.images || playlist.more_info?.images)
    const playlistId = playlist.id || playlist._id
    const playlistSlug = encodeURIComponent(String(playlist.name || playlist.title || 'playlist'))
    const destination = to || `/playlist/${encodeURIComponent(String(playlistId))}/${playlistSlug}`
    
    return (
        <Link to={destination} className={compact ? 'block w-36 min-w-36 shrink-0' : 'block min-w-42.5 flex-1'}>
            <article className={compact ? 'w-36' : 'min-w-42.5 flex-1'}>
                <div className={`${compact ? 'aspect-square rounded-lg' : 'aspect-square rounded-xl'} overflow-hidden bg-[#28251f]`}>
                    {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full art-sheen" />}
                </div>
                <h3 className={`${compact ? 'mt-2 text-xs' : 'mt-3 text-sm'} truncate font-bold text-white`}>
                    {playlist.name}
                </h3>
                <p className={`${compact ? 'mt-1 text-[10px]' : 'mt-1 text-xs'} truncate text-white/40`}>
                    {playlist.description || 'A personal collection'}
                </p>
            </article>
        </Link>
    )
}