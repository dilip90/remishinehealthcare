'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const slides = [
  { src: '/hero-banner/1.png', alt: 'Remishine Healthcare hero banner 1' },
  { src: '/hero-banner/2.png', alt: 'Remishine Healthcare hero banner 2' },
  { src: '/hero-banner/3.png', alt: 'Remishine Healthcare hero banner 3' },
  { src: '/hero-banner/4.png', alt: 'Remishine Healthcare hero banner 4' },
  { src: '/hero-banner/5.png', alt: 'Remishine Healthcare hero banner 5' },
  { src: '/hero-banner/6.png', alt: 'Remishine Healthcare hero banner 6' },
];

const AUTOPLAY_DELAY = 2500;

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const goToPrevious = () => {
    goToSlide(activeSlide - 1);
  };

  const goToNext = () => {
    goToSlide(activeSlide + 1);
  };

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  return (
    <section
      className="w-full overflow-hidden bg-white"
      aria-label="Remishine Healthcare featured banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full overflow-hidden bg-white">
        <div className="relative h-[220px] w-full sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[560px] 2xl:h-[600px]">
          {slides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              draggable={false}
              className={`object-cover object-center transition-opacity duration-700 ease-in-out ${
                activeSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:left-6 sm:h-12 sm:w-12"
          aria-label="Previous slide"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:right-6 sm:h-12 sm:w-12"
          aria-label="Next slide"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex justify-center gap-2 bg-white py-4 sm:gap-3 sm:py-5">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:h-3 ${
              activeSlide === index
                ? 'w-8 bg-primary sm:w-9'
                : 'w-2.5 bg-gray-300 hover:bg-gray-400 sm:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeSlide === index ? 'true' : undefined}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
