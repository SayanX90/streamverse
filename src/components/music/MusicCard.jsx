import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';

export default function MusicCard({ track }) {
    const { playTrack, currentTrack, isPlaying } = useMusic();
    const isThisPlaying = currentTrack?.id === track.id && isPlaying;

    return (
        <div
            onClick={() => playTrack(track)}
            className="relative flex-none w-[150px] md:w-[220px] aspect-square rounded-xl overflow-hidden snap-start group cursor-pointer bg-white/5 border border-white/5 transition-all duration-500 md:hover:scale-105 hover:z-10 hover:shadow-2xl md:hover:border-white/20 active:scale-95"
        >
            {/* Album Art */}
            <img
                src={track.thumbnail}
                alt={track.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
            />

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

            {/* Play/Pause Button Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isThisPlaying ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.6)] transform transition-transform duration-300 ${isThisPlaying ? 'scale-100' : 'scale-75 md:group-hover:scale-100'}`}>
                    {isThisPlaying ? (
                        <Pause size={24} className="text-white fill-white md:w-7 md:h-7" />
                    ) : (
                        <Play size={24} className="text-white fill-white ml-0.5 md:ml-1 md:w-7 md:h-7" />
                    )}
                </div>
            </div>

            {/* Track Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform md:translate-y-1 md:group-hover:translate-y-0 transition-transform">
                <h3 className="text-white font-bold text-xs md:text-base line-clamp-1 drop-shadow-lg">
                    {track.title}
                </h3>
                <p className="text-white/60 text-[9px] md:text-xs truncate font-medium mt-0.5">
                    {track.subtitle}
                </p>
            </div>

            {/* Playing Indicator */}
            {isThisPlaying && (
                <div className="absolute top-3 right-3 flex gap-0.5 items-end h-3">
                    <div className="w-0.5 bg-accent animate-[music-bar_0.8s_ease-in-out_infinite]"></div>
                    <div className="w-0.5 bg-accent animate-[music-bar_1.2s_ease-in-out_infinite_0.2s]"></div>
                    <div className="w-0.5 bg-accent animate-[music-bar_1s_ease-in-out_infinite_0.4s]"></div>
                </div>
            )}
        </div>
    );
}
