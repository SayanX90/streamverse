import { Search as SearchIcon, Filter, SlidersHorizontal, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchMovies, fetchTrendingMovies } from '../api/tmdb';
import HorizontalCard from '../components/ui/HorizontalCard';

export default function Search() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [trending, setTrending] = useState([]);
    const [results, setResults] = useState([]);

    // Load default trending searches on mount
    useEffect(() => {
        fetchTrendingMovies().then(res => setTrending(res.slice(0, 6)));
    }, []);

    // Perform live search when query changes
    useEffect(() => {
        if (query.trim() === '') {
            setIsSearching(false);
            setResults([]);
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(async () => {
            const data = await searchMovies(query);
            setResults(data);
            setIsSearching(false);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="w-full min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">

            {/* Search Header */}
            <div className="relative mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-8">Search. <span className="text-white/30">Discover.</span></h1>

                <div className="relative w-full max-w-3xl group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <SearchIcon size={24} className="text-white/50 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Movies, Series, Actors, or Genres..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-full py-5 pl-16 pr-6 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all font-medium text-lg placeholder-white/30 backdrop-blur-md"
                    />
                    {/* Glowing underglow effect on focus */}
                    <div className="absolute inset-0 -z-10 bg-white/20 blur-2xl opacity-0 group-focus-within:opacity-20 transition-opacity rounded-full"></div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    <button className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                        All
                    </button>
                    <button className="px-6 py-2.5 rounded-full bg-transparent border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
                        Movies
                    </button>
                    <button className="px-6 py-2.5 rounded-full bg-transparent border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
                        Series
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-2"></div>
                    <button className="px-4 py-2.5 rounded-full bg-transparent border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Results / Default State */}
            <div className={`transition-opacity duration-500 ${isSearching ? 'opacity-30' : 'opacity-100'}`}>
                {query === '' ? (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-white/80">Trending Searches</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trending.map((item) => (
                                <HorizontalCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-white/80">Top Results for "{query}"</h2>
                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map((item) => (
                                    <HorizontalCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-white/50">
                                No results found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
