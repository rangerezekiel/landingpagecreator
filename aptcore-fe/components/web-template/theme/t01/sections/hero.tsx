import { HeroContent } from "@/app/_types/section"
import Animated from "@/components/animated"
import Image from "next/image"
import { storageUrl } from "@/app/_utils/objectTransformers"
import ShinyButton from "@/components/web-template/theme/t01/partial/shiny-button"
import { FaFingerprint } from "react-icons/fa6"

export default function Hero({ data }: { data: HeroContent["details"] }) {
  if (!data) {
    return null
  }

  const backgroundImage = data.BACKGROUND.value
  const content = data.CONTENT.value
  const buttonData = data.REGISTER_BUTTON.jsonValue

  return (
    <Animated animation="fade-down" delay={0.2} className="relative t01-hero">
      <div id="hero" className="relative h-fit overflow-hidden font-bebas-neue tracking-wider">
        <Image
          src={storageUrl(backgroundImage) || "/assets/theme/t01/limited-bg.png"}
          alt="Limited Time Offer"
          fill
          className="object-cover absolute"
          priority={false}
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="relative inset-0 bg-black/50 flex justify-center items-center py-12 md:py-20 lg:py-[100px] px-4">
          <div className="container text-white">
            <div className="flex flex-col gap-6 md:gap-10 max-w-full lg:max-w-[580px]">
              <Animated animation="fade-right" delay={0.5}>
                <div 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[58px] font-bold leading-[1.2]"
                  dangerouslySetInnerHTML={{ __html: content || "Discover the Ultimate Lifestyle at Tampines Street 94" }}
                />
              </Animated>
            </div>

            <ShinyButton href={buttonData?.LINK}>
              <FaFingerprint />
              <div className="flex flex-col items-start gap-1 ms-3">
                <p className="text-base md:text-lg lg:text-xl leading-[1] mb-1">
                  {buttonData?.TITLE || "Register for VVIP Access"}
                </p>
                <p className="text-sm md:text-base leading-[1]">
                  {buttonData?.SUBTITLE || "Limited Units Available - Act Fast!"}
                </p>
              </div>
            </ShinyButton>
          </div>
        </div>
      </div>
    </Animated>
  )
}
