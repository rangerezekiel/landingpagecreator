"use client"

import { SimillarProjectContents } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from '@/components/animated'
import LocationCarousel from '@/components/web-template/theme/t01/partial/location-carousel'

export default function SimillarProject({ data }: { data: SimillarProjectContents | null }) {
  if (!data || !data.active || !data.details) {
    return null
  }

  const title = data.details.TITLE?.value || "SIMILLAR PROJECT"
  const projects = data.details.PROJECTS?.items || []

  // Transform projects data for the carousel
  const carouselData = projects.map((item, index) => {
    const rawImage = item.contents.BACKGROUND?.value || ''
    const image = rawImage ? storageUrl(rawImage) : ''
    return {
      id: index,
      title: item.contents.TITLE?.value || '',
      link: item.contents.WEBSITE_LINK?.value || '',
      image,
      alt: item.contents.TITLE?.value || 'Location',
    }
  })

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="similarprojects" className="bg-[#fff] py-8 md:py-12 lg:py-[50px]">
        <div className="container px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-bebas-neue uppercase font-bold  text-center mb-8 md:mb-10 lg:mb-[40px]">
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
            <p className="text-black/70 text-sm text-center mt-2">
              *The information is subject to change and photos/images used are for illustration purposes only.
            </p>
          </Animated>

        </div>
      </div>
    </Animated>
  )
}