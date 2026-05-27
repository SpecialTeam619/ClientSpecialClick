import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

type UseAutoplayType = {
    autoplayIsPlaying: boolean;
    toggleAutoplay: () => void;
    onAutoplayButtonClick: (callback: () => void) => void;
};

export const useAutoplay = (
    emblaApi: EmblaCarouselType | undefined,
): UseAutoplayType => {
    const idleTimeoutId = useRef<number | null>(null);

    const autoplayIsPlaying = useSyncExternalStore(
        (onStoreChange) => {
            const autoplay = emblaApi?.plugins()?.autoplay;
            if (!emblaApi || !autoplay) return () => {};

            const notify = () => onStoreChange();

            emblaApi
                .on('autoplay:play', notify)
                .on('autoplay:stop', notify)
                .on('reInit', notify);

            return () => {
                emblaApi
                    .off('autoplay:play', notify)
                    .off('autoplay:stop', notify)
                    .off('reInit', notify);
            };
        },
        () => emblaApi?.plugins()?.autoplay?.isPlaying() ?? false,
        () => false,
    );

    const onAutoplayButtonClick = useCallback(
        (callback: () => void) => {
            const autoplay = emblaApi?.plugins()?.autoplay;
            if (!autoplay) return;

            autoplay.stop();
            callback();
        },
        [emblaApi],
    );

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const inactivityDelayMs = 2000;
        const activityEvents: Array<keyof WindowEventMap> = [
            'pointerdown',
            'pointermove',
            'keydown',
            'touchstart',
            'scroll',
            'mousemove',
        ];

        const clearIdleTimer = () => {
            if (idleTimeoutId.current !== null) {
                window.clearTimeout(idleTimeoutId.current);
                idleTimeoutId.current = null;
            }
        };

        const armIdleTimer = () => {
            clearIdleTimer();

            idleTimeoutId.current = window.setTimeout(() => {
                autoplay.play();
            }, inactivityDelayMs);
        };

        const handleActivity = () => {
            armIdleTimer();
        };

        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, handleActivity, {
                passive: true,
            });
        });

        document.addEventListener('visibilitychange', handleActivity);
        armIdleTimer();

        return () => {
            clearIdleTimer();

            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, handleActivity);
            });

            document.removeEventListener('visibilitychange', handleActivity);
        };
    }, [emblaApi]);

    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
        playOrStop();
    }, [emblaApi]);

    return {
        autoplayIsPlaying,
        toggleAutoplay,
        onAutoplayButtonClick,
    };
};
