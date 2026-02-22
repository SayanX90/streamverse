import { useEffect, useRef } from 'react';
import ContentCard from '../ui/ContentCard';
import { Loader2, SearchX } from 'lucide-react';
import { useContentContext } from '../../contexts/ContentContext';

function SkeletonCard() {
    return (
        <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skeleton-shimmer" />
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
            </div>
        </div>
    );
}

export default function ContentGrid({ data, loading, loadingMore, hasMore, loadMore }) {
    const observerTarget = useRef(null);
    const { resetFilters } = useContentContext();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loadingMore, loading, loadMore]);

    if (loading && data.length === 0) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (data.length === 0 && !loading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center text-white/40 space-y-4">
                <SearchX size={48} className="text-white/20" />
                <p className="text-lg font-medium">No titles match your filters.</p>
                <button
                    onClick={resetFilters}
                    className="text-sm text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
                >
                    Reset All Filters
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                {data.map((item) => (
                    <ContentCard key={item.id} item={item} />
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
                {loadingMore && (
                    <Loader2 className="animate-spin text-white/50" size={32} />
                )}
            </div>
        </div>
    );
}
