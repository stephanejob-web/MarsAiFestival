import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

interface UseFilmPlayerOptions {
    filmId?: number;
    startMuted?: boolean;
}

interface UseFilmPlayerReturn {
    videoRef: RefObject<HTMLVideoElement>;
    isPlaying: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
    handleFullscreen: () => void;
    handlePlay: () => void;
    handlePause: () => void;
    handleEnded: () => void;
}

const useFilmPlayer = ({ filmId, startMuted = true }: UseFilmPlayerOptions = {}): UseFilmPlayerReturn => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(startMuted);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (filmId === undefined) return;
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }, [filmId]);

    const togglePlay = useCallback((): void => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.pause();
        } else {
            void video.play();
        }
    }, [isPlaying]);

    const toggleMute = useCallback((): void => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    const handleFullscreen = useCallback((): void => {
        if (videoRef.current) void videoRef.current.requestFullscreen();
    }, []);

    const handlePlay = useCallback((): void => setIsPlaying(true), []);
    const handlePause = useCallback((): void => setIsPlaying(false), []);
    const handleEnded = useCallback((): void => setIsPlaying(false), []);

    return { videoRef, isPlaying, isMuted, togglePlay, toggleMute, handleFullscreen, handlePlay, handlePause, handleEnded };
};

export default useFilmPlayer;
