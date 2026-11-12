"use client"

import { FAQContents } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from "@/components/animated"
import Image from "next/image"
import FaqAccordion from "@/components/web-template/theme/t01/partial/faq-accordion"

interface FaqItem {
  id: string
  question: string
  answer: string
}

export default function FAQ({ data }: { data: FAQContents }) {
  if (!data || !data.active) {
    return null
  }

  const image = data?.details?.IMAGE?.value
  const faqList = data?.details?.LIST?.items

  // Transform FAQ data to match FaqAccordion interface
  const faqItems: FaqItem[] = faqList?.map((item, index) => ({
    id: `faq-${index}`,
    question: item.contents?.TITLE?.value || `Question ${index + 1}`,
    answer: item.contents?.DESCRIPTION?.value || "No answer available."
  })) || []

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="faq" className="py-8 md:py-12 lg:py-[40px] bg-[#A59D84]">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="order-1 lg:order-1 text-white">
              <Animated animation="fade-left" delay={0.4}>
                <div className="mb-8 md:mb-12">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[86px] font-bold leading-[0.8] font-bebas-neue tracking-[2px] md:tracking-[2.5px]">
                    FAQ
                  </h2>
                </div>
              </Animated>

              {/* Accordion */}
              <FaqAccordion faqItems={faqItems} />
            </div>

            {/* Right - Image */}
            <div className="order-2 lg:order-2">
              <Animated animation="fade-up" delay={0.4}>
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden flex justify-center items-center">
                  <Image 
                    src={storageUrl(image || '/assets/theme/t01/location.png')} 
                    alt="FAQ Section" 
                    width={500} 
                    height={500} 
                    className="w-auto h-full object-cover" 
                  />
                </div>
                <p className="text-[10px] font-arial text-center text-white mt-5">  
                  *The information is subject to change and photos/images used are for illustration purposes only.
                </p>
              </Animated>
            </div>
          </div>
        </div>
      </div>
    </Animated>
  )
}
