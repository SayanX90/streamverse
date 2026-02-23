import { Search as SearchIcon, Filter, SlidersHorizontal, Play, Music } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { searchMulti, fetchTrendingMovies } from '../api/tmdb';
import { searchMusic } from '../services/musicService';
import HorizontalCard from '../components/ui/HorizontalCard';

export default function Search() {
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [isSearching, setIsSearching] = useState(false);
    const [trending, setTrending] = useState([]);
    const [results, setResults] = useState({ videos: [], music: [] });

    // Load default trending searches on mount
    useEffect(() => {
        fetchTrendingMovies().then(res => setTrending(res.slice(0, 6)));
    }, []);

    // Perform live search when query changes
    useEffect(() => {
        if (query.trim() === '') {
            setIsSearching(false);
            setResults({ videos: [], music: [] });
            return;
        }

        setIsSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const [videoData, musicData] = await Promise.all([
                    searchMulti(query),
                    searchMusic(query, 12)
                ]);
                setResults({ videos: videoData, music: musicData });
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeout);
    }, [query]);

    const filteredResults = useMemo(() => {
        const { videos, music } = results;
        if (activeFilter === 'Movies') return videos.filter(v => v.type === 'movie');
        if (activeFilter === 'Series') return videos.filter(v => v.type === 'series');
        if (activeFilter === 'Songs') return music;

        // Combined 'All' view
        return [...videos, ...music];
    }, [results, activeFilter]);

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
                        placeholder="Search for movies, songs, or series..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-full py-5 pl-16 pr-6 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all font-medium text-lg placeholder-white/30 backdrop-blur-md"
                    />
                    <div className="absolute inset-0 -z-10 bg-white/20 blur-2xl opacity-0 group-focus-within:opacity-20 transition-opacity rounded-full"></div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    {['All', 'Movies', 'Series', 'Songs'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-6 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2",
                                activeFilter === filter
                                    ? "bg-white text-black font-semibold scale-105"
                                    : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                            )}
                        >
                            {filter === 'Songs' && <Music size={14} />}
                            {filter}
                        </button>
                    ))}
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
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white/80">
                                {activeFilter} Results for "{query}"
                            </h2>
                            <span className="text-sm text-white/40">Found {filteredResults.length} items</span>
                        </div>

                        {filteredResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {filteredResults.map((item) => (
                                    <HorizontalCard key={`${item.type}-${item.id}`} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <SearchIcon size={48} className="mx-auto text-white/10 mb-4" />
                                <p className="text-white/50 text-lg">No results found matching your search.</p>
                                <button onClick={() => setQuery('')} className="mt-4 text-accent font-bold hover:underline">Clear Search</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
