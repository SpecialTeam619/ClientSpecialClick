import { isValidElement, useRef } from 'react';
import type { ReactNode } from 'react';
import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useAutoplay } from './EmblaCarouselAutoplay';
import { useAutoplayProgress } from './EmblaCarouselAutoplayProgress';

type SlideContent = number | ReactNode;

type PropType = {
    slides: SlideContent[];
    options?: EmblaOptionsType;
};

const EmblaCarousel = (props: PropType) => {
    const { slides, options } = props;
    const progressNode = useRef<HTMLDivElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ delay: 3000 }),
    ]);

    const { showAutoplayProgress, currentSlide, totalSlides, timeLeftMs } =
        useAutoplayProgress(emblaApi, progressNode);

    useAutoplay(emblaApi);

    // const timeLeftSeconds =
    //     timeLeftMs === null ? '-' : (timeLeftMs / 1000).toFixed(1);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((slide, index) => {
                        const key = isValidElement(slide)
                            ? (slide.key ?? index)
                            : index;

                        return (
                            <div className="embla__slide" key={key}>
                                {typeof slide === 'number' ? (
                                    <div className="embla__slide__number">
                                        <span>{slide + 1}</span>
                                    </div>
                                ) : (
                                    slide
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__meta">
                    {Array.from({ length: totalSlides }, (_, i) => (
                        <div
                            key={i}
                            className={[
                                'embla__meta__dot',
                                currentSlide === i + 1
                                    ? 'embla__meta__dot--active'
                                    : 'embla__meta__dot--hidden',
                                showAutoplayProgress
                                    ? ''
                                    : 'embla__meta__dot--idle',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            <div
                                className="embla__meta__dot-fill"
                                style={{
                                    width:
                                        currentSlide === i + 1
                                            ? `${
                                                  100 - ((timeLeftMs ?? 0) / 3000) *
                                                  100
                                              }%`
                                            : '0%',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
