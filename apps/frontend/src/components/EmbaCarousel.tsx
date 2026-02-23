import useEmblaCarousel from "embla-carousel-react";
import React from "react";

export const EmblaCarousel = ({ children }: { children: React.ReactNode }) => {
  const [emblaRef] = useEmblaCarousel({ dragFree: true });
  return (
    <ul className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {React.Children.map(children, (slide, index) => (
            <li
              key={index}
              className="min-w-0 shrink-0 grow-0 pl-4 basis-[35%] lg:basis-1/5 flex flex-col gap-2"
            >
              {slide}
            </li>
          ))}
        </div>
      </div>
    </ul>
  );
};
