import { Play, Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '../layout/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { trackView, upsertWatchHistory } from '../../lib/firestoreService';
import useMyList from '../../hooks/useMyList';
import { useState } from 'react';

export default function HorizontalCard({ item, isContinueWatching = false }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { inList, handleToggleList, loading: listLoading } = useMyList(item.id);
    const [playLoading, setPlayLoading] = useState(false);

    const handlePlay = async (e) => {
        if (e) e.stopPropagation();
        if (!user || playLoading) return;

        setPlayLoading(true);
        try {
            const duration = item.duration || 120;
            const progress = isContinueWatching ? item.progress : 0;

            await Promise.all([
                trackView(item.id),
                upsertWatchHistory(item.id, user.uid, progress, duration)
            ]);

            navigate(`/watch/${item.id}`);
        } catch (err) {
            console.error('[HorizontalCard] handlePlay error:', err);
            navigate(`/watch/${item.id}`);
        } finally {
            setPlayLoading(false);
        }
    };

    return (
        <div className={cn(
            "group relative flex-shrink-0 cursor-pointer rounded overflow-hidden transition-all duration-500",
            "w-full aspect-video",
            "hover:z-10 hover:shadow-2xl hover:shadow-black"
        )}>

            {/* Thumbnail */}
            <img
                src={item.thumbnail || item.banner || 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=500&q=80'}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* V3 Luxurious Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {/* Metadata Row */}
                    {!isContinueWatching && (
                        <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {item.type === 'sports' ? (
                                <div className="flex items-center gap-3 w-full bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-sm">
                                    {/* Home Team */}
                                    <div className="flex items-center gap-2">
                                        {item.homeBadge && <img src={item.homeBadge} alt={item.homeTeam} className="w-5 h-5 object-contain" />}
                                        <span className="text-white font-bold text-xs truncate max-w-[80px] hidden md:block">{item.homeTeam}</span>
                                    </div>

                                    {/* VS / Score Element */}
                                    <div className="flex items-center gap-1">
                                        {item.status === 'Match Finished' ? (
                                            <span className="bg-accent/20 text-accent font-black text-xs px-2 py-0.5 rounded-sm whitespace-nowrap">
                                                {item.homeScore} - {item.awayScore}
                                            </span>
                                        ) : (
                                            <span className="text-white/40 font-bold text-[10px] px-1 italic">VS</span>
                                        )}
                                    </div>

                                    {/* Away Team */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-xs truncate max-w-[80px] hidden md:block">{item.awayTeam}</span>
                                        {item.awayBadge && <img src={item.awayBadge} alt={item.awayTeam} className="w-5 h-5 object-contain" />}
                                    </div>

                                    <div className="ml-auto w-1 h-1 bg-white/20 rounded-full mx-1 hidden sm:block"></div>
                                    <span className="text-white/60 text-[10px] font-medium tracking-wide whitespace-nowrap hidden sm:block">
                                        {item.matchDate ? item.matchDate : 'TBA'}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <span className="text-[10px] font-black tracking-widest px-2 py-0.5 border border-white/20 text-white uppercase backdrop-blur-sm">{item.match || '4K HDR'}</span>
                                    <span className="text-xs text-white/50 uppercase tracking-widest">{item.type}</span>
                                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                    <span className="text-xs text-accent font-bold">{item.rating}</span>
                                </>
                            )}
                        </div>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                        {item.title}
                        {item.subtitle && <span className="block text-sm font-medium text-white/60 mt-1">{item.subtitle}</span>}
                    </h3>

                    {/* Action Row */}
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 mt-4">
                        <div className="flex gap-2">
                            <button
                                onClick={handlePlay}
                                disabled={playLoading}
                                className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-sm font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {playLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-black" />}
                                Play
                            </button>
                            <button
                                onClick={handleToggleList}
                                disabled={listLoading}
                                className={cn(
                                    "w-9 h-9 border border-white/20 text-white rounded-sm flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md",
                                    inList && "bg-accent border-accent text-white"
                                )}
                            >
                                {listLoading ? <Loader2 size={14} className="animate-spin" /> : (inList ? <Check size={16} /> : <Plus size={16} />)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Watching Progress - Ultra minimal */}
            {isContinueWatching && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                        className="h-full bg-white transition-all duration-500 relative"
                        style={{ width: `${item.progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white shadow-[0_0_8px_#fff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

