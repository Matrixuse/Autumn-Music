import SongCard from '../cards/SongCard'

export default function Moods({ songs }) { return (
    <section>
        <div className="mb-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-[#d29a55]">
                    Moods that you like
                </p>
                <h2 className="font-['Space_Grotesk'] text-3xl font-bold">
                    Your Moods
                </h2>
            </div>
        <div className="scrollbar-none -mx-1 flex gap-6 overflow-x-auto px-1 pb-2">
            {songs.map((song) => 
                <SongCard key={song.id} song={song} queue={songs} />
            )}
        </div>
    </section>
)}