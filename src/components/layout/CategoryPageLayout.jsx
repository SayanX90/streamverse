import { useContentContext } from '../../contexts/ContentContext';
import { usePaginatedContent } from '../../hooks/usePaginatedContent';
import FilterBar from '../ui/FilterBar';
import SortDropdown from '../ui/SortDropdown';
import ContentGrid from './ContentGrid';
import { ExternalLink } from 'lucide-react';

export default function CategoryPageLayout({ type, title, description, heroImage }) {
    const { globalFilters, globalSort } = useContentContext();

    const { data, totalCount, loading, loadingMore, hasMore, loadMore, error, errorIndexLink } = usePaginatedContent(
        type,
        globalFilters,
        globalSort
    );

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Category Hero Banner */}
            <div className="relative w-full h-[50vh] flex items-end justify-center overflow-hidden mb-12">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${heroImage}")` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-black/30"></div>
                <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col pb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-4 uppercase drop-shadow-2xl">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl font-light">
                        {description}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-32">

                {/* Sticky Controls Bar */}
                <div className="sticky top-16 z-30 bg-[#050505]/90 backdrop-blur-xl -mx-6 md:-mx-12 px-6 md:px-12 py-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-4">
                        <div className="flex-1 w-full">
                            <FilterBar type={type} />
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="text-white/50 text-sm font-medium">
                                {totalCount > 0 ? (
                                    <>Showing <span className="text-white font-bold">{data.length}</span> of <span className="text-white font-bold">{totalCount}</span> titles</>
                                ) : (
                                    <>Showing <span className="text-white font-bold">{data.length}</span> titles</>
                                )}
                            </div>
                            <SortDropdown />
                        </div>
                    </div>
                </div>

                {/* Firestore Index Error Display */}
                {error && (
                    <div className="w-full p-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl mb-8 mt-6">
                        <span className="font-bold text-lg mb-2 block">Query Error</span>
                        <span className="font-mono text-sm break-all block mb-3">{error}</span>
                        {errorIndexLink && (
                            <a
                                href={errorIndexLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
                            >
                                <ExternalLink size={14} />
                                Create Required Index →
                            </a>
                        )}
                    </div>
                )}

                {/* Content Data Grid with Infinite Scroll */}
                <div className="mt-6">
                    <ContentGrid
                        data={data}
                        loading={loading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        loadMore={loadMore}
                    />
                </div>

            </div>
        </div>
    );
}
