"use client"

import { LocationContents } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from '@/components/animated'
import LocationCarousel from '@/components/web-template/theme/t01/partial/location-carousel'

export default function Location({ data }: { data: LocationContents }) {
  if (!data || !data.active || !data.details) {
    return null
  }

  const title = data.details.TITLE?.value || "LOCATION"
  const button = data.details.BUTTON?.jsonValue
  const highlights = data.details.HIGHLIGHT?.items || []
  const locationList = data.details.LIST?.items || []

  // Transform highlights data for the carousel
  const carouselData = highlights.map((item, index) => {
    const rawImage = item.contents.BACKGROUND?.value || ''
    const image = rawImage ? storageUrl(rawImage) : ''
    return {
      id: index,
      title: item.contents.TITLE?.value || '',
      image,
      alt: item.contents.TITLE?.value || 'Location',
    }
  })

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="location" className="bg-[#c1baa1] py-8 md:py-12 lg:py-[50px]">
        <div className="container px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-bebas-neue uppercase font-bold text-white text-center mb-8 md:mb-10 lg:mb-[40px]">
            {title}
          </h2>
          
          {/* Location Carousel */}
          {carouselData.length > 0 && (
            <LocationCarousel 
              items={carouselData}
              slidesToShow={3}
              slidesToScroll={3}
              autoplay={false}
              autoplaySpeed={4000}
              pauseOnHover={true}
              showArrows={false}
            />
          )}

          <Animated animation="fade-up" delay={0.4}>
            <p className="text-white/70 text-sm text-center mt-2">
              *The information is subject to change and photos/images used are for illustration purposes only.
            </p>
          </Animated>

          {/* Location List Content */}
          {locationList.length > 0 && (
            <div className="flex flex-col gap-5 mt-8 md:mt-10">
              <div className="flex flex-col gap-5 font-arial text-center items-center text-white max-w-4xl mx-auto">
                {locationList.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Animated animation="fade-up" delay={0.4 + (index * 0.1)}>
                      <p className="font-bold text-sm md:text-base">
                        {item.contents.TITLE?.value}
                      </p>
                    </Animated>
                    <Animated animation="fade-up" delay={0.5 + (index * 0.1)}>
                      <p className="text-sm md:text-base">
                        {item.contents.DESCRIPTION?.value}
                      </p>
                    </Animated>
                  </div>
                ))}
                
                {button && (
                  <Animated animation="fade-up" delay={0.6}>
                    <a 
                      href={button.LINK} 
                      className="bg-[#ceb183] text-white w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base font-bold rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                    >
                      {button.TITLE || "REQUEST YOUR INTEREST"}
                    </a>
                  </Animated>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Animated>
  )
}