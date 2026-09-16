import MoodChips from '../components/sections/MoodChips'
import SongCard from '../components/cards/SongCard'

const songs = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({ id, title: `Discovery ${id}`, artist: `Artist ${String.fromCharCode(64 + (id % 5 || 5))}`, image: null, audio: null }))
export default function Explore() { return (
    <div className="space-y-10">
        <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#d29a55]">
                Browse the feeling
            </p>
            <h1 className="font-['Space_Grotesk'] text-4xl font-bold">
                For you
            </h1>
            <p className="mt-3 text-sm text-white/45">
                A little more of what makes the day sound right.
            </p>
        </div>
        <MoodChips />
        <section>
            <h2 className="mb-5 text-xl font-bold">
                Fresh discoveries
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {songs.map((song) => 
                <SongCard key={song.id} song={song} queue={songs} />)}
            </div>
        </section>
    </div>
)}