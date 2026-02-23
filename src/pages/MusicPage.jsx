import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAvailableSections } from '../services/musicService';
import MusicSection from '../components/music/MusicSection';
import { Loader2 } from 'lucide-react';
import { useContentContext } from '../contexts/ContentContext';

export default function MusicPage() {
    const { globalLanguage } = useContentContext();
    const allSectionNames = getAvailableSections();
    const [visibleSections, setVisibleSections] = useState(allSectionNames.slice(0, 3));
    const [loadingMore, setLoadingMore] = useState(false);
    const observerTarget = useRef(null);

    // Reset visible sections when language changes
    useEffect(() => {
        setVisibleSections(allSectionNames.slice(0, 3));
    }, [globalLanguage]);

    const loadMoreSections = useCallback(() => {
        if (loadingMore || visibleSections.length >= allSectionNames.length) return;

        setLoadingMore(true);
        // Simulate a slight delay for better UX
        setTimeout(() => {
            setVisibleSections(prev => {
                const nextBatch = allSectionNames.slice(prev.length, prev.length + 2);
                return [...prev, ...nextBatch];
            });
            setLoadingMore(false);
        }, 800);
    }, [visibleSections, allSectionNames, loadingMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMoreSections();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMoreSections]);

    return (
        <div className="min-h-screen bg-[#050505] pt-16 md:pt-20 pb-32">
            {/* Hero Section for Music */}
            <div className="relative h-[35vh] md:h-[60vh] w-full overflow-hidden flex items-end px-4 md:px-12 pb-8 md:pb-12 mb-4 md:mb-8">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80"
                        alt="Music Hero"
                        className="w-full h-full object-cover scale-105 animate-[slow-zoom_20s_linear_infinite]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-4xl space-y-3 md:space-y-4">
                    <span className="px-2 md:px-3 py-1 bg-accent rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                        Premium Experience
                    </span>
                    <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">
                        Your Daily <br /> <span className="text-accent">Soundtrack</span>
                    </h1>
                    <p className="text-white/70 text-sm md:text-xl font-medium max-w-xl line-clamp-2 md:line-clamp-none">
                        Immerse yourself in high-fidelity audio, curated playlists, and trending hits from across the globe.
                    </p>
                </div>
            </div>

            {/* Dynamic Sections (Vertical Infinite Scroll) */}
            <div className="space-y-4">
                {visibleSections.map((name) => {
                    let displayTitle = name;
                    if (name === 'Top Hindi' && globalLanguage === 'bn') displayTitle = 'Top Bengali';

                    return <MusicSection key={name} title={name} displayTitle={displayTitle} language={globalLanguage} />;
                })}
            </div>

            {/* End of Page Observer */}
            <div
                ref={observerTarget}
                className="h-20 flex items-center justify-center w-full"
            >
                {loadingMore && (
                    <div className="flex items-center gap-3 text-white/40 font-bold uppercase tracking-widest text-sm">
                        <Loader2 className="animate-spin text-accent" />
                        Loading more sections
                    </div>
                )}
                {!loadingMore && visibleSections.length >= allSectionNames.length && (
                    <div className="text-white/20 font-bold uppercase tracking-widest text-xs py-10 border-t border-white/5 w-full text-center mx-12">
                        You've reached the end of the soundscape
                    </div>
                )}
            </div>
        </div>
    );
}
