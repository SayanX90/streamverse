import { createContext, useContext, useRef, useState, useEffect } from 'react';

const PlayerContext = createContext(null);

// Demo audio fallback for tracks without an audioUrl
const DEMO_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export function PlayerProvider({ children }) {
    const audioRef = useRef(new Audio());
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.8);

    // Sync volume with audio element
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Track time progress
    useEffect(() => {
        const audio = audioRef.current;
        const onTimeUpdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const playTrack = (track) => {
        const audio = audioRef.current;
        const src = track.audioUrl || DEMO_AUDIO;

        // If same track, just toggle
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }

        // Load new track
        audio.pause();
        audio.src = src;
        audio.currentTime = 0;
        audio.play().catch(console.error);
        setCurrentTrack(track);
        setIsPlaying(true);
        setProgress(0);
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    const seek = (percent) => {
        const audio = audioRef.current;
        if (audio.duration) {
            audio.currentTime = (percent / 100) * audio.duration;
            setProgress(percent);
        }
    };

    const changeVolume = (val) => {
        const clamped = Math.max(0, Math.min(1, val));
        audioRef.current.volume = clamped;
        setVolume(clamped);
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, isPlaying, progress, volume, playTrack, togglePlay, seek, changeVolume }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
    return ctx;
}
