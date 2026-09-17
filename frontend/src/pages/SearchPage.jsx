import { Search } from 'lucide-react'
import SearchBar from '../components/common/SearchBar'

export default function SearchPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-1 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/6 text-[#e6a44a]">
        <Search size={28} />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#d29a55]">Find your next repeat</p>
      <h1 className="font-['Space_Grotesk'] text-3xl font-bold sm:text-4xl">Search music</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-white/45">Look through songs, albums, artists, and playlists.</p>
      <div className="mt-8 w-full max-w-2xl">
        <SearchBar />
      </div>
    </section>
  )
}
