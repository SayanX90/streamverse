import { Play, Heart, Star, Clock, Plus, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLike } from '../../hooks/useLike';
import useMyList from '../../hooks/useMyList';
import { trackView, upsertWatchHistory } from '../../lib/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&q=80";

export default function ContentCard({ item }) {
    const [imgError, setImgError] = useState(false);
    const [playLoading, setPlayLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { liked, likeLoading, handleToggleLike } = useLike(item.id);
    const { inList, handleToggleList, loading: listLoading } = useMyList(item.id);

    const handlePlay = async (e) => {
        e.stopPropagation();
        if (playLoading || !user) return;
        setPlayLoading(true);
        try {
            await Promise.all([
                trackView(item.id),
                upsertWatchHistory(item.id, user.uid, 0, item.duration || 120),
            ]);

            navigate(`/watch/${item.id}`, { state: { type: item.type } });
        } catch (err) {
            console.error('[ContentCard] handlePlay error:', err);
            navigate(`/watch/${item.id}`, { state: { type: item.type } });
        } finally {
            setPlayLoading(false);
        }
    };

    return (
        <div className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-black hover:-translate-y-2">

            <img
                src={imgError ? FALLBACK_IMG : (item.thumbnail || item.image || FALLBACK_IMG)}
                alt={item.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />

            {/* Static Rating Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-bold text-white">{item.rating}</span>
            </div>

            {/* Duration Badge */}
            {item.duration && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                    <Clock size={10} className="text-white/70" />
                    <span className="text-[10px] font-bold text-white/80">{item.duration}</span>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="absolute inset-0 p-5 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-[10px] font-black tracking-widest px-2 py-0.5 bg-black/50 backdrop-blur-md rounded border border-white/20 text-white uppercase">{item.genre}</span>
                </div>

                <div>
                    <h3 className="text-lg font-black text-white leading-tight mb-1 drop-shadow-md line-clamp-2">
                        {item.title}
                    </h3>
                    {item.subtitle && (
                        <p className="text-white/60 text-xs font-medium mb-1 truncate">{item.subtitle}</p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
                            <Star size={10} className="fill-yellow-400" /> {item.rating}
                        </span>
                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                        <span className="text-xs text-white/50">{item.releaseYear || item.year}</span>
                    </div>

                    <div className="flex gap-2">
                        {/* Play Button */}
                        <button
                            onClick={handlePlay}
                            disabled={playLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors disabled:opacity-60"
                        >
                            {playLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="fill-black" />}
                            PLAY
                        </button>

                        {/* My List Button */}
                        <button
                            onClick={handleToggleList}
                            disabled={listLoading}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border backdrop-blur-md
                                ${inList
                                    ? 'bg-accent/20 border-accent/50 text-accent'
                                    : 'border-white/20 text-white hover:bg-white/10'
                                }
                                ${listLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {listLoading ? <Loader2 size={16} className="animate-spin" /> : (inList ? <Check size={16} /> : <Plus size={16} />)}
                        </button>

                        {/* Like Button */}
                        <button
                            onClick={handleToggleLike}
                            disabled={likeLoading}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border backdrop-blur-md
                                ${liked
                                    ? 'bg-accent/20 border-accent/50 text-accent'
                                    : 'border-white/20 text-white hover:bg-white/10'
                                }
                                ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <Heart size={16} className={liked ? 'fill-accent' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

