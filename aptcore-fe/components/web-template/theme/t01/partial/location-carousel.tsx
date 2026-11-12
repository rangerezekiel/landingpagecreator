"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Dynamic import for react-slick to improve SSR performance
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading carousel...</div>
    </div>
  )
})

export interface CarouselItem {
  id: number
  title: string
  link?: string
  subtitle?: string
  image: string
  badge?: string
  alt: string
}

export interface LocationCarouselProps {
  items: CarouselItem[]
  className?: string
  slidesToShow?: number
  slidesToScroll?: number
  autoplay?: boolean
  autoplaySpeed?: number
  pauseOnHover?: boolean
  showDots?: boolean
  showArrows?: boolean
  infinite?: boolean
  speed?: number
  responsive?: Array<{
    breakpoint: number
    settings: {
      slidesToShow: number
      slidesToScroll: number
    }
  }>
}

export default function LocationCarousel({
  items,
  className = "",
  slidesToShow = 3,
  slidesToScroll = 3,
  autoplay = true,
  autoplaySpeed = 2000,
  pauseOnHover = true,
  showDots = true,
  showArrows = true,
  infinite = true,
  speed = 500,
  responsive = [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
}: LocationCarouselProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sliderSettings = {
    dots: showDots,
    arrows: showArrows,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    pauseOnHover,
    dotsClass: "slick-dots custom-dots",
    responsive
  }

  if (!mounted) {
    // SSR fallback - show static grid
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="px-2">
              {item.link && item.link !== "" ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative h-[500px] w-full overflow-hidden drop-shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute flex flex-col justify-center items-end text-white text-center px-[20px] bottom-[10px]">
                      <h3 className="text-[40px] md:text-[60px] lg:text-[60px] font-bold font-bebas-neue tracking-wider leading-[0.8] mb-4 drop-shadow-2xl mx-5">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="relative h-[500px] w-full overflow-hidden drop-shadow-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute flex flex-col justify-center items-end text-white text-center px-[20px] bottom-[10px]">
                    <h3 className="text-[40px] md:text-[60px] lg:text-[60px] font-bold font-bebas-neue tracking-wider leading-[0.8] mb-4 drop-shadow-2xl mx-5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-6xl mx-auto location-slider ${className}`}>
      <Slider {...sliderSettings}>
        {items.map((item) => (
          <div key={item.id} className="px-2">
            {item.link && item.link !== "" ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative h-[500px] w-full overflow-hidden drop-shadow-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute flex flex-col justify-center items-end text-white text-center px-[20px] bottom-[10px]">
                    <h3 className="text-[40px] md:text-[60px] lg:text-[60px] font-bold font-bebas-neue tracking-wider leading-[0.8] mb-4 drop-shadow-2xl mx-5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </a>
            ) : (
              <div className="relative h-[500px] w-full overflow-hidden drop-shadow-xl">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute flex flex-col justify-center items-end text-white text-center px-[20px] bottom-[10px]">
                  <h3 className="text-[40px] md:text-[60px] lg:text-[60px] font-bold font-bebas-neue tracking-wider leading-[0.8] mb-4 drop-shadow-2xl mx-5">
                    {item.title}
                  </h3>
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  )
}