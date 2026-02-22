import { useEffect, useState, useRef } from "react";
import { fetchMusic } from "../../services/musicApi";
import { usePlayer } from "../../contexts/PlayerContext";
import { Play, Pause, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function MusicSection({ title, searchTerm }) {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack, isPlaying } = usePlayer();
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadMusic = async () => {
            setLoading(true);
            const data = await fetchMusic(searchTerm);
            setTracks(data || []);
            setLoading(false);
        };
        loadMusic();
    }, [searchTerm]);

    const handlePlay = (track) => {
        playTrack({
            id: track.trackId,
            title: track.trackName,
            subtitle: track.artistName,
            image: track.artworkUrl100?.replace('100x100bb', '300x300bb') || track.artworkUrl100, // Higher res image if possible
            audioUrl: track.previewUrl
        });
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.clientWidth : current.clientWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="py-4">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-6 md:px-12 flex items-center gap-2">
                    {title}
                </h2>
                <div className="flex items-center justify-center h-48">
                    <Loader2 size={32} className="animate-spin text-white/40" />
                </div>
            </div>
        );
    }

    if (tracks.length === 0) return null;

    return (
        <div className="py-4 group/section relative">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-6 md:px-12 flex items-center gap-2">
                {title}
            </h2>

            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/60 opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-black/80"
            >
                <ChevronLeft size={36} className="text-white drop-shadow-md" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-0 bottom-0 z-40 w-12 flex items-center justify-center bg-black/60 opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-black/80"
            >
                <ChevronRight size={36} className="text-white drop-shadow-md" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-4 snap-x"
            >
                {tracks.map((track) => {
                    const isTrackPlaying = currentTrack?.id === track.trackId && isPlaying;

                    return (
                        <div
                            key={track.trackId}
                            className="relative flex-none w-[180px] md:w-[220px] aspect-square rounded-lg overflow-hidden snap-start group cursor-pointer border border-white/5 transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:border-white/20"
                            onClick={() => handlePlay(track)}
                        >
                            {/* Artwork */}
                            <img
                                src={track.artworkUrl100?.replace('100x100bb', '300x300bb') || track.artworkUrl100}
                                alt={track.trackName}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                    {isTrackPlaying ? (
                                        <Pause size={28} className="text-white fill-white" />
                                    ) : (
                                        <Play size={28} className="text-white fill-white ml-1" />
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-bold text-base line-clamp-1 drop-shadow-md">
                                    {track.trackName}
                                </h3>
                                <p className="text-white/60 text-xs truncate mt-1">
                                    {track.artistName}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
