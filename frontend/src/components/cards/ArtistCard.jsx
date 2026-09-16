import { getBestImageUrl } from '../../utils/mediaQuality'

export default function ArtistCard({ artist }) { 
    const image = getBestImageUrl(artist.image); 
    
    return (
        <article className="min-w-[180px] flex-1 text-center">
            <div className="mx-auto aspect-square max-w-[150px] overflow-hidden rounded-full border-4 border-[#28251f] bg-[#28251f] shadow-xl">
                {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full art-sheen" />}
            </div>
            <h3 className="mt-3 truncate text-sm font-semibold">
                {artist.name}
            </h3>
            <p className="mt-1 text-xs text-white/40">
                Artist
            </p>
        </article>
    ) 
}