import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { fetchMusicSection } from '../../services/musicService';
import MusicCard from './MusicCard';

export default function MusicSection({ title, displayTitle, language = 'All' }) {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            setPage(1); // Reset page on language change
            const data = await fetchMusicSection(title, 1, 20, language);
            setTracks(data.tracks);
            setHasMore(data.hasMore);
            setLoading(false);
        };
        loadInitial();
    }, [title, language]);

    const handleScroll = async () => {
        if (!scrollRef.current || loadingMore || !hasMore) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isNearEnd = scrollWidth - (scrollLeft + clientWidth) < 500;

        if (isNearEnd) {
            setLoadingMore(true);
            const nextPage = page + 1;
            const data = await fetchMusicSection(title, nextPage, 20, language);

            setTracks(prev => {
                const existingIds = new Set(prev.map(t => t.id));
                const newTracks = data.tracks.filter(t => !existingIds.has(t.id));
                return [...prev, ...newTracks];
            });

            setPage(nextPage);
            setHasMore(data.hasMore);
            setLoadingMore(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading && page === 1) {
        return (
            <div className="py-8 animate-pulse">
                <div className="h-8 w-48 bg-white/5 rounded mx-6 md:px-12 mb-6"></div>
                <div className="flex gap-4 px-6 md:px-12">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex-none w-[180px] md:w-[220px] aspect-square bg-white/5 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (tracks.length === 0) return null;

    return (
        <div className="py-4 md:py-8 group/section relative">
            <h2 className="text-xl md:text-3xl font-black text-white mb-4 md:mb-6 px-4 md:px-12 flex items-center gap-3">
                {displayTitle || title}
                <ChevronRight className="text-accent opacity-0 group-hover/section:opacity-100 transition-opacity hidden md:block" />
            </h2>

            {/* Navigation Buttons - Desktop Only */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-[60%] -translate-y-1/2 z-40 w-14 h-24 hidden md:flex items-center justify-center bg-black/60 backdrop-blur-md border-r border-white/10 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-black/90 text-white rounded-r-xl"
            >
                <ChevronLeft size={40} />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-[60%] -translate-y-1/2 z-40 w-14 h-24 hidden md:flex items-center justify-center bg-black/60 backdrop-blur-md border-l border-white/10 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-black/90 text-white rounded-l-xl"
            >
                <ChevronRight size={40} />
            </button>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-4 md:pb-8 snap-x"
            >
                {tracks.map((track) => (
                    <MusicCard key={track.id} track={track} />
                ))}

                {loadingMore && (
                    <div className="flex-none w-[180px] md:w-[220px] aspect-square flex items-center justify-center bg-white/5 rounded-xl border border-dashed border-white/10">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                )}
            </div>
        </div>
    );
}
