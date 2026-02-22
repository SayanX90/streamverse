import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, ListVideo } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function MiniPlayer() {
    const { currentTrack, isPlaying, progress, togglePlay, volume, changeVolume, seek } = usePlayer();
    const location = useLocation();

    const isMusicPage = location.pathname.includes('/category/music');

    // Auto-pause when leaving the music page
    useEffect(() => {
        if (!isMusicPage && isPlaying) {
            togglePlay();
        }
    }, [isMusicPage, isPlaying, togglePlay]);

    // Hide player if nothing is playing OR if not on the music page
    if (!currentTrack || !isMusicPage) return null;

    const handleVolume = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        changeVolume(x / rect.width);
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        seek((x / rect.width) * 100);
    };

    return (
        <div className="fixed bottom-0 w-full glass-player bg-black/90 backdrop-blur-xl border-t border-white/10 h-20 md:h-24 z-[60] flex items-center px-4 md:px-8 justify-between animate-[slide-up_0.5s_ease-out]">
            {/* Progress Bar Top Edge - Now Clickable */}
            <div
                className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-white/10 cursor-pointer group/progress"
                onClick={handleSeek}
            >
                <div
                    className="h-full bg-[#E50914] transition-all duration-100 pointer-events-none group-hover/progress:bg-red-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Left: Info */}
            <div className="flex items-center gap-4 flex-1 md:w-1/3 mr-4 md:mr-0 min-w-0">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden group cursor-pointer hidden sm:block border border-white/10">
                    <img src={currentTrack.image || currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 size={16} className="text-white" />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-sm md:text-base text-white line-clamp-1">{currentTrack.title}</h4>
                    <p className="text-xs text-white/50">{currentTrack.subtitle || 'Now Playing'}</p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 md:w-1/3">
                <div className="flex items-center gap-6 md:gap-8">
                    <button className="text-white/50 hover:text-white transition"><SkipBack size={20} /></button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                        {isPlaying ? (
                            <Pause size={20} className="fill-black text-black" />
                        ) : (
                            <Play size={20} className="fill-black text-black ml-1" />
                        )}
                    </button>

                    <button className="text-white/50 hover:text-white transition"><SkipForward size={20} /></button>
                </div>
            </div>

            {/* Right: Extra Controls */}
            <div className="hidden md:flex w-1/3 items-center justify-end gap-4 md:gap-6">
                <button className="text-white/50 hover:text-white transition hidden md:block">
                    <ListVideo size={20} />
                </button>
                <div className="flex items-center gap-2 group hidden sm:flex">
                    <Volume2 size={20} className="text-white/50 group-hover:text-white transition" />
                    <div
                        className="w-20 h-1.5 bg-white/20 rounded relative cursor-pointer"
                        onClick={handleVolume}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-white rounded group-hover:bg-[#E50914] transition-colors pointer-events-none"
                            style={{ width: `${volume * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
