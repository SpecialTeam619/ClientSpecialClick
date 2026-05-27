import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import type { RefObject } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

type UseAutoplayProgressType = {
    showAutoplayProgress: boolean;
    currentSlide: number;
    totalSlides: number;
    timeLeftMs: number | null;
};

export const useAutoplayProgress = <ProgressElement extends HTMLElement | null>(
    emblaApi: EmblaCarouselType | undefined,
    progressNode: RefObject<ProgressElement>,
): UseAutoplayProgressType => {
    const [showAutoplayProgress, setShowAutoplayProgress] = useState(false);
    const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null);
    const animationName = useRef('');
    const timeoutId = useRef(0);
    const rafId = useRef(0);
    const intervalId = useRef(0);

    const startProgress = useCallback(
        (node: ProgressElement, timeUntilNext: number | null) => {
            if (!node) return;
            if (timeUntilNext === null) return;

            if (!animationName.current) {
                const style = window.getComputedStyle(node);
                animationName.current = style.animationName;
            }

            node.style.setProperty('animation-name', 'none');
            node.style.setProperty('transform', 'translate3d(0,0,0)');

            rafId.current = window.requestAnimationFrame(() => {
                timeoutId.current = window.setTimeout(() => {
                    node.style.setProperty(
                        'animation-name',
                        animationName.current,
                    );
                    node.style.setProperty(
                        'animation-duration',
                        `${timeUntilNext}ms`,
                    );
                }, 0);
            });

            setShowAutoplayProgress(true);
        },
        [],
    );

    const currentSlide = useSyncExternalStore(
        (onStoreChange) => {
            if (!emblaApi) return () => {};

            emblaApi.on('select', onStoreChange).on('reInit', onStoreChange);

            return () => {
                emblaApi
                    .off('select', onStoreChange)
                    .off('reInit', onStoreChange);
            };
        },
        () => (emblaApi ? emblaApi.selectedScrollSnap() + 1 : 1),
        () => 1,
    );

    const totalSlides = useSyncExternalStore(
        (onStoreChange) => {
            if (!emblaApi) return () => {};

            emblaApi.on('select', onStoreChange).on('reInit', onStoreChange);

            return () => {
                emblaApi
                    .off('select', onStoreChange)
                    .off('reInit', onStoreChange);
            };
        },
        () => emblaApi?.scrollSnapList().length ?? 0,
        () => 0,
    );

    const updateTimeLeft = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) {
            setTimeLeftMs(null);
            return;
        }

        const timeUntilNext = autoplay.timeUntilNext();
        setTimeLeftMs(
            timeUntilNext === null
                ? null
                : Math.max(0, Math.ceil(timeUntilNext)),
        );
    }, [emblaApi]);

    const stopTimeTicker = useCallback(() => {
        if (intervalId.current) {
            window.clearInterval(intervalId.current);
            intervalId.current = 0;
        }
    }, []);

    const startTimeTicker = useCallback(() => {
        stopTimeTicker();
        updateTimeLeft();

        intervalId.current = window.setInterval(() => {
            updateTimeLeft();
        }, 100);
    }, [stopTimeTicker, updateTimeLeft]);

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const onTimerSet = () => {
            startProgress(progressNode.current, autoplay.timeUntilNext());
            startTimeTicker();
        };
        const onTimerStopped = () => {
            stopTimeTicker();
            setShowAutoplayProgress(false);
            setTimeLeftMs(null);
        };

        emblaApi
            .on('autoplay:timerset', onTimerSet)
            .on('autoplay:timerstopped', onTimerStopped);

        onTimerSet();

        return () => {
            stopTimeTicker();
            emblaApi
                .off('autoplay:timerset', onTimerSet)
                .off('autoplay:timerstopped', onTimerStopped);
        };
    }, [
        emblaApi,
        progressNode,
        startProgress,
        startTimeTicker,
        stopTimeTicker,
    ]);

    useEffect(() => {
        return () => {
            stopTimeTicker();
            cancelAnimationFrame(rafId.current);
            clearTimeout(timeoutId.current);
        };
    }, [stopTimeTicker]);

    return {
        showAutoplayProgress,
        currentSlide,
        totalSlides,
        timeLeftMs,
    };
};
