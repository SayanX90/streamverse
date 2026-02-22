import { Play, Plus } from 'lucide-react';
import { cn } from '../layout/Navbar';

export default function Card({ item, isContinueWatching = false, isVertical = false }) {
    return (
        <div className={cn(
            "group relative flex-shrink-0 cursor-pointer rounded-2xl transition-all duration-500 transform hover:-translate-y-2",
            isVertical ? "w-[200px] md:w-[240px] aspect-[2/3]" : "w-[280px] md:w-[320px] aspect-video",
            isContinueWatching ? "md:w-[360px]" : ""
        )}>

            {/* Thumbnail */}
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/5 relative bg-card">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />

                {/* Elegant Dark Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 hover:bg-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <Play size={24} className="text-white fill-white ml-1" />
                    </div>
                </div>

                {/* Continue Watching Progress - Cleaner Integration */}
                {isContinueWatching && (
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                            <div
                                className="h-full bg-accent relative"
                                style={{ width: `${item.progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
                            </div>
                        </div>
                        <p className="text-xs text-white/80 mt-2 font-medium">{item.progress}% Completed</p>
                    </div>
                )}

                {/* Data Overlay visible on hover */}
                {!isContinueWatching && (
                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-white border border-white/10">{item.match || '4K'}</span>
                            <span className="text-xs text-gray-300 font-medium">{item.rating}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-400 font-medium">{item.type} • 2024</p>
                    </div>
                )}

                {/* Quick Add Button top right */}
                {!isContinueWatching && (
                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:border-accent z-20 -translate-y-2 group-hover:translate-y-0">
                        <Plus size={16} className="text-white" />
                    </button>
                )}
            </div>

            {/* Title Below Card (Option for cleaner look when not hovered) */}
            {!isContinueWatching && !isVertical && (
                <div className="mt-3 group-hover:opacity-0 transition-opacity duration-300">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{item.type}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="text-xs text-accent font-medium">{item.rating} Rating</span>
                    </div>
                </div>
            )}
        </div>
    );
}
