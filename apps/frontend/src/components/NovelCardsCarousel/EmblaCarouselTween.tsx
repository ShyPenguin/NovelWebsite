import useEmblaCarousel from "embla-carousel-react";
import type {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import { NovelCard } from "./NovelCard";
import { useCallback, useEffect, useRef } from "react";
import type { NovelThumbnail } from "../../types";

type PropType = {
  slides: NovelThumbnail[];
  options?: EmblaOptionsType;
};

const TWEEN_FACTOR_BASE = 1;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export function EmblaCarouselTween(props: PropType) {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenEffects = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          // Handle infinite loop
          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          // Calculate tween values
          const absDiff = Math.abs(diffToTarget * tweenFactor.current);
          const tweenValue = 1 - absDiff;

          // Apply opacity
          const opacity = numberWithinRange(tweenValue, 0.3, 1).toString();

          // Apply saturation - center gets full saturation, others get reduced
          const saturation = tweenValue > 0.9 ? 1 : 0;

          // Apply both effects to the slide
          const slideNode = emblaApi.slideNodes()[slideIndex];
          slideNode.style.opacity = opacity;
          slideNode.style.filter = `saturate(${saturation})`;

          // NEW: Add data-current attribute
          const isCurrent = tweenValue > 0.9; // You can adjust this threshold
          slideNode.setAttribute("data-current", isCurrent.toString());
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenFactor(emblaApi);
    tweenEffects(emblaApi);

    emblaApi
      .on("reInit", setTweenFactor)
      .on("reInit", tweenEffects)
      .on("scroll", tweenEffects)
      .on("slideFocus", tweenEffects);
  }, [emblaApi, tweenEffects]);
  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((card) => (
            <div className="embla__slide group" key={card.id}>
              <NovelCard
                key={card.id}
                id={card.id}
                title={card.title}
                description={card.description}
                coverImageUrl={card.coverImageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
