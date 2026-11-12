"use client"

import { DevelopedByContent } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from "@/components/animated"
import Image from "next/image"
import ParallaxSection from "@/components/web-template/theme/t01/partial/parallax-section"

export default function Developer({ data }: { data: DevelopedByContent["details"] }) {
  if (!data) {
    return null
  }

  const background = data?.BACKGROUND?.value
  const logo = data?.LOGO?.value
  const description = data?.DESCRIPTION?.value

  return (
    <div id="developer" className="relative before:content-[''] before:w-full before:h-[60%] before:absolute before:bottom-0 before:left-0 before:bg-gradient-to-t before:from-black/90 before:via-black/60 to-transparent">
      <ParallaxSection 
        src={storageUrl(background || '/assets/theme/t01/bg-developer.jpg')} 
        alt="Developer Background" 
        className="py-8 md:py-12 lg:py-[40px] min-h-[941px] h-fit" 
        strength={600}
      >
        <div className="container px-4 flex flex-col items-center h-full justify-end relative pb-30">
          <Animated animation="fade-up" delay={0.4}>
            <p className="text-[32px] font-bold font-roboto text-white mb-5">
              Developed By:
            </p>
          </Animated>

          <Animated animation="fade-up" delay={0.6}>
            <Image 
              src={storageUrl(logo || '/assets/theme/t01/hoi-hup.png')} 
              alt="Developer" 
              width={388} 
              height={133} 
              className="w-auto h-auto max-w-[388px]"
            />
          </Animated>

          <Animated animation="fade-up" delay={0.8}>
            <div 
              className="font-[14px] font-arial text-white w-full max-w-[1200px] text-center leading-[1.2] mx-auto mt-10"
              dangerouslySetInnerHTML={{ __html: description || "Since 1983, Hoi Hup Realty has built a strong reputation as a trusted property developer in Singapore, delivering a diverse range of projects, including mixed-use developments, landed homes, and commercial spaces. Their commitment to quality has earned them numerous awards over the years. Similarly, Sunway Group is renowned for its exceptional craftsmanship and stands as one of Malaysia's largest conglomerates, with operations spanning 50 locations worldwide." }}
            />
          </Animated>
        </div>
      </ParallaxSection>
    </div>
  )
}
