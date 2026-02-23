import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
    const audioRef = useRef(new Audio());
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(localStorage.getItem('music-volume') ? parseFloat(localStorage.getItem('music-volume')) : 0.7);

    // Sync volume with audio element
    useEffect(() => {
        audioRef.current.volume = volume;
        localStorage.setItem('music-volume', volume.toString());
    }, [volume]);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;

        const onTimeUpdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const onEnded = () => {
            setIsPlaying(false);
            playNext(); // Auto-play next track
        };

        const onError = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
        };
    }, [currentIndex, queue]); // Re-bind onEnd to handle closure over playNext

    const playTrack = useCallback((track, newQueue = []) => {
        const audio = audioRef.current;

        // If a new queue is provided, update it
        if (newQueue.length > 0) {
            setQueue(newQueue);
            const index = newQueue.findIndex(t => t.id === track.id);
            setCurrentIndex(index);
        } else {
            // Find in current queue
            const index = queue.findIndex(t => t.id === track.id);
            if (index !== -1) setCurrentIndex(index);
        }

        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }

        audio.pause();
        audio.src = track.audioUrl;
        audio.currentTime = 0;

        audio.play()
            .then(() => setIsPlaying(true))
            .catch(err => {
                console.error("Error playing track:", err);
                setIsPlaying(false);
            });

        setCurrentTrack(track);
        setProgress(0);
    }, [currentTrack, queue]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!currentTrack) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
        }
    }, [isPlaying, currentTrack]);

    const playNext = useCallback(() => {
        if (queue.length === 0 || currentIndex === -1) return;
        const nextIdx = (currentIndex + 1) % queue.length;
        playTrack(queue[nextIdx]);
    }, [queue, currentIndex, playTrack]);

    const playPrev = useCallback(() => {
        if (queue.length === 0 || currentIndex === -1) return;
        const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
        playTrack(queue[prevIdx]);
    }, [queue, currentIndex, playTrack]);

    const seek = (percent) => {
        const audio = audioRef.current;
        if (audio.duration) {
            const time = (percent / 100) * audio.duration;
            audio.currentTime = time;
            setProgress(percent);
        }
    };

    const value = {
        currentTrack,
        isPlaying,
        queue,
        progress,
        duration,
        volume,
        setVolume,
        playTrack,
        togglePlay,
        playNext,
        playPrev,
        seek
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}
