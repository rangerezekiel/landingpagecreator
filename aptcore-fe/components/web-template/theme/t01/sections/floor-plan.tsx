"use client"

import { UnitTypesContents } from "@/app/_types/section"
import Animated from "@/components/animated"
import FloorplanItem from "@/components/web-template/theme/t01/partial/floorplan-item"
import { storageUrl } from "@/app/_utils/objectTransformers"

interface FloorPlanProps {
  data?: UnitTypesContents
}

export default function FloorPlan({ data }: FloorPlanProps) {
  if (!data || !data.active || !data.details?.LIST?.items || data.details.LIST.items.length === 0) {
    return null
  }

  const detail = data.details
  const thisTitle = detail.TITLE?.value
  const thisButton = detail.BUTTON?.jsonValue
  const thisList = detail.LIST.items

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="floorplan" className="py-12 md:py-16 lg:py-20 bg-[#C1BAA1]">
        <div className="container px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-8 md:mb-12 lg:mb-16">
            <Animated animation="fade-right" delay={0.4}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bebas-neue font-normal text-[#39362C] uppercase tracking-wider mb-4 md:mb-0">
                {thisTitle || 'TAMPINES ST 94 GLS FLOORPLANS'}
              </h2>
            </Animated>

            {thisButton && (
              <Animated animation="fade-left" delay={0.6}>
                <a 
                  href={thisButton.LINK || "#"} 
                  className="bg-[transparent] border border-white shadow-[0px_0px_10px_0px_rgba(255,249,241,0.48)] text-black w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                >
                  {thisButton.TITLE || 'DOWNLOAD ALL FLOOR PLAN'}
                </a>
              </Animated>
            )}
          </div>

          {/* Floor Plan Grid */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {thisList.map((item, index) => (
              <Animated key={item.contents.TITLE?.value || index} animation="fade-up" delay={0.4} className="w-full md:w-[calc((100%-2rem)/2)] xl:w-[calc((100%-4rem)/3)]">
                <FloorplanItem
                  image={storageUrl(item.contents.IMAGE?.value) || "/assets/theme/t01/floorplans-1.jpg"}
                  title={item.contents.TITLE?.value || `TAMPINES ST 94 GLS FLOORPLANS - ${index + 1} BEDROOM`}
                  // link={item.contents.BUTTON?.jsonValue?.LINK}
                />
              </Animated>
            ))}
          </div>

          <Animated animation="fade-up" delay={0.4} className="mt-10">
            <p className="text-[10px]">
              *The information is subject to change and photos/images used are for illustration purposes only.
            </p>
          </Animated>
        </div>
      </div>
    </Animated>
  )
}
