"use client"

import { UnitTypesAccordionContents } from "@/app/_types/section"
import Animated from "@/components/animated"
import Image from "next/image"
import { IoGridSharp } from "react-icons/io5"
import { storageUrl } from "@/app/_utils/objectTransformers"
import UnitTypesAccordion from "@/components/web-template/theme/t01/partial/unit-types-accordion"

interface UnitTypeProps {
  accordionData?: UnitTypesAccordionContents
}

export default function UnitType({ accordionData }: UnitTypeProps) {
  // For now, render the component regardless of data since accordion has defaults
  // This matches the current inline implementation

  // console.log(accordionData?.details?.TITLE?.value)
  const detail = accordionData?.details
  const description = detail?.DESCRIPTION?.value || ''

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="price" className="py-8 md:py-12 lg:py-[40px] bg-[#a59e85]">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left - Image */}
            <div className="order-2 lg:order-1">
              <Animated animation="fade-right" delay={0.4}>
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[845px] rounded-t-full overflow-hidden flex justify-center items-center bg-white/10">
                  <Image 
                    src={storageUrl(accordionData?.details?.IMAGE?.value || 'assets/theme/t01/book-faq.png')} 
                    alt="Tampines St 94 GLS Unit Type" 
                    width={500} 
                    height={500} 
                    className="w-auto h-full object-cover" 
                  />
                </div>
              </Animated>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 text-white">
              <Animated animation="fade-left" delay={0.4}>
                <div className="mb-8 md:mb-12">
                  <IoGridSharp className="mb-4" />
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[86px] font-bold leading-[0.8] font-bebas-neue tracking-[2px] md:tracking-[2.5px]">
                    {accordionData?.details?.TITLE?.value || "UNIT"} <br/>
                  </h2>
                  <div className="font-bebas-neue tracking-[2px] md:tracking-[2.5px] mt-4">
                    <div className="text-sm md:text-base lg:text-[16px] leading-[1] mb-2" dangerouslySetInnerHTML={{ __html: description || '' }} />
                  </div>
                </div>
              </Animated>

              {/* Accordion */}
              <UnitTypesAccordion unitTypes={accordionData} />
            </div>
          </div>
        </div>
      </div>
    </Animated>
  )
}