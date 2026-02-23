import React, { useState } from 'react';
import {
    Play, Pause, SkipBack, SkipForward, Volume2,
    VolumeX, ListMusic, Maximize2, Repeat, Shuffle
} from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';

export default function GlobalMusicPlayer() {
    const {
        currentTrack, isPlaying, progress, volume,
        duration, togglePlay, playNext, playPrev,
        seek, setVolume
    } = useMusic();

    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(volume);

    if (!currentTrack) return null;

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVolumeToggle = () => {
        if (isMuted) {
            setVolume(prevVolume);
            setIsMuted(false);
        } else {
            setPrevVolume(volume);
            setVolume(0);
            setIsMuted(true);
        }
    };

    const currentTime = formatTime((progress / 100) * duration);
    const totalTime = formatTime(duration);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-2xl border-t border-white/10 h-20 md:h-28 px-4 md:px-6 flex items-center justify-between transition-all duration-500 animate-[slide-up_0.6s_cubic-bezier(0.23,1,0.32,1)]">

            {/* Playback Progress - Extreme Slim Top bar */}
            <div
                className="absolute top-0 left-0 w-full h-1 bg-white/5 cursor-pointer group/progress"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                    seek(percent);
                }}
            >
                <div
                    className="h-full bg-accent relative transition-all duration-100"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] opacity-0 md:group-hover/progress:opacity-100 transition-opacity"></div>
                </div>
            </div>

            {/* Left Section: Track Metadata */}
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-1/3 min-w-0">
                <div className="relative group flex-shrink-0">
                    <img
                        src={currentTrack.thumbnail}
                        alt={currentTrack.title}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border border-white/10 shadow-lg"
                    />
                </div>
                <div className="min-w-0">
                    <h4 className="text-white font-bold text-xs md:text-base truncate leading-tight">
                        {currentTrack.title}
                    </h4>
                    <p className="text-white/40 text-[10px] md:text-sm truncate">
                        {currentTrack.subtitle}
                    </p>
                </div>
            </div>

            {/* Center Section: Main Controls */}
            <div className="flex flex-col items-center gap-1 md:gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 w-auto md:flex-grow md:max-w-[40%]">
                <div className="flex items-center gap-4 md:gap-10">
                    <button className="text-white/40 hover:text-white transition hidden md:block"><Shuffle size={18} /></button>
                    <button
                        onClick={playPrev}
                        className="text-white/60 hover:text-white transition transform active:scale-90 hidden sm:block"
                    >
                        <SkipBack size={window.innerWidth < 768 ? 20 : 24} fill="currentColor" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        {isPlaying ? (
                            <Pause size={window.innerWidth < 768 ? 20 : 24} className="text-black fill-black" />
                        ) : (
                            <Play size={window.innerWidth < 768 ? 20 : 24} className="text-black fill-black ml-1" />
                        )}
                    </button>

                    <button
                        onClick={playNext}
                        className="text-white/60 hover:text-white transition transform active:scale-90"
                    >
                        <SkipForward size={window.innerWidth < 768 ? 20 : 24} fill="currentColor" />
                    </button>
                    <button className="text-white/40 hover:text-white transition hidden md:block"><Repeat size={18} /></button>
                </div>

                {/* Time Indicators - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-3 w-full max-w-md px-4">
                    <span className="text-[10px] md:text-xs text-white/30 font-medium tabular-nums">{currentTime}</span>
                    <div className="flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white/40" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-[10px] md:text-xs text-white/30 font-medium tabular-nums">{totalTime}</span>
                </div>
            </div>

            {/* Right Section: Volume & Queue - Hidden on small mobile */}
            <div className="hidden md:flex items-center justify-end gap-5 w-1/3">
                <button className="text-white/40 hover:text-white transition">
                    <ListMusic size={20} />
                </button>
                <div className="flex items-center gap-3 group">
                    <button
                        onClick={handleVolumeToggle}
                        className="text-white/40 hover:text-white transition"
                    >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full relative cursor-pointer overflow-hidden">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="h-full bg-accent group-hover:bg-red-500 transition-colors"
                            style={{ width: `${volume * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
