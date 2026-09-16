import { Link } from 'react-router-dom'
import ArtistCard from '../cards/ArtistCard'

export default function PopularArtists({ artists }) {
    return (
        <section>
            <div className="mb-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-[#d29a55]">
                    People to know
                </p>
                <h2 className="font-['Space_Grotesk'] text-3xl font-bold">
                    Popular artists
                </h2>
            </div>
            <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2">
                {artists.map((artist) => (
                    <Link key={artist.id} to={`/artist/${artist.id}/${encodeURIComponent(artist.name)}`} className="block min-w-[180px] flex-1 text-center">
                        <ArtistCard artist={artist} />
                    </Link>
                ))}
            </div>
        </section>
    )
}