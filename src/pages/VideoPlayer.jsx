import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchDetails } from '../api/tmdb';
import { fetchSportsDetails } from '../api/sports';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function VideoPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const type = location.state?.type || 'movie'; // Default to movie if no state passed
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Prevent body scroll while on player page
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const loadContent = async () => {
            try {
                let data = null;
                if (type === 'sports') {
                    data = await fetchSportsDetails(id);
                } else {
                    data = await fetchDetails(id, type);
                }

                if (data) {
                    setContent(data);
                } else {
                    setError(`Content not found on ${type === 'sports' ? 'TheSportsDB' : 'TMDB'}.`);
                }
            } catch (err) {
                console.error('[VideoPlayer] fetch error:', err);
                setError('Failed to load content details.');
            } finally {
                setLoading(false);
                // Trigger fade-in after data loads
                setTimeout(() => setVisible(true), 50);
            }
        };
        loadContent();
    }, [id, type]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                <Loader2 className="animate-spin text-white/40" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] gap-4">
                <p className="text-white/60 text-lg">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
                >
                    ← Go Back
                </button>
            </div>
        );
    }

    const videoSrc = content?.videoUrl || DEMO_VIDEO;

    return (
        <div
            className={`fixed inset-0 bg-[#050505] z-[9999] flex flex-col transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Top Bar — Title + Back (No longer absolute to fix mobile touch events) */}
            <div className="w-full px-4 sm:px-6 py-4 flex items-center gap-4 bg-[#0a0a0a] z-10 shrink-0 border-b border-white/5 shadow-md">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-white/5 sm:bg-transparent rounded-full sm:rounded-none text-white/70 hover:text-white hover:bg-white/10 transition-colors group"
                >
                    <ArrowLeft size={20} className="sm:group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="text-sm font-bold hidden sm:block ml-2">Back</span>
                </button>
                <div className="flex-1 truncate">
                    <h1 className="text-white text-base sm:text-lg font-bold tracking-tight leading-none truncate mb-1">
                        {content?.title}
                    </h1>
                    {content?.type && (
                        <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                            {content.type}
                            {content.rating ? ` · ${content.rating}` : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Video Element Setup */}
            {content?.videoUrl ? (
                <div className="w-full aspect-video md:aspect-auto md:h-[70vh] lg:h-[75vh] bg-black shrink-0 relative shadow-2xl border-b border-white/5">
                    <iframe
                        src={content.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                        title={content.title || "Trailer"}
                        frameBorder="0"
                    />
                </div>
            ) : (
                <div className="w-full aspect-video md:aspect-auto md:h-[70vh] lg:h-[75vh] flex flex-col items-center justify-center bg-[#0a0a0a] shrink-0 border-b border-white/5 shadow-2xl">
                    <AlertCircle size={32} className="text-white/20 mb-3" />
                    <p className="text-white/60 text-sm md:text-base">
                        {content?.type === 'sports'
                            ? 'Highlights not available for this event.'
                            : 'No official trailer available for this title.'}
                    </p>
                </div>
            )}

            {/* Details Section for Mobile/Desktop */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#050505] hide-scrollbar">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/50 mb-6 font-medium tracking-wide">
                        {content?.rating && (
                            <span className="text-accent border border-accent/20 bg-accent/10 px-2 py-0.5 rounded-sm font-bold">
                                {content.rating}
                            </span>
                        )}
                        {content?.releaseDate && <span>{content.releaseDate.split('-')[0]}</span>}
                        {content?.duration && <span>{content.duration} min</span>}
                        {content?.type && <span className="uppercase tracking-widest text-[#fff] bg-white/10 px-2 py-0.5 rounded-sm">{content.type}</span>}
                    </div>

                    <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
                        {content?.description || 'No description available for this content.'}
                    </p>

                    {/* Metadata Grid */}
                    {content?.genres && content.genres.length > 0 && (
                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-black mb-3">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {content.genres.map(g => (
                                    <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 text-white/70 text-xs rounded-full">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
