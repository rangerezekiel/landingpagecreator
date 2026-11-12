import { BannerPayload } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from "@/components/animated"
import Image from "next/image"

export default function Banner({ data }: { data: BannerPayload[] }) {
    if (!data || data.length === 0) {
      return null
    }

    // Get the first banner item's content
    const firstBanner = data[0]
    const content = firstBanner.contents
    const backgroundImage = content.BACKGROUND.value
    const title = content.TITLE.value
    const description = content.DESCRIPTION.value
    const btnLink = content.BUTTON.jsonValue.LINK
    const btnText = content.BUTTON.jsonValue.TITLE
  
    return (
      <Animated animation="fade-right" delay={0.2} className="relative">
        <div className="relative h-[calc(95vh-130px)] min-h-[400px] overflow-hidden">
            <Image
                src={storageUrl(backgroundImage)}
                alt={title}
                fill
                className="object-cover"
                priority={false}
                sizes="100vw"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-black/50 flex justify-center items-center px-4">
                <div className="container text-white text-center flex flex-col items-center w-fit max-w-4xl">
                    <Animated animation="fade-up" delay={0.4}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight">
                            {title}
                        </h1>
                    </Animated>
                    <div className="h-[2px] w-full bg-white my-4 md:my-6"/>
                    <Animated animation="fade-down" delay={0.6}>
                        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl uppercase font-bold leading-tight">
                            {description}
                        </p>
                    </Animated>
                    <a href={btnLink} className="bg-[#ceb183] text-white w-fit px-4 sm:px-6 md:px-8 py-2 md:py-3 text-sm sm:text-base md:text-lg lg:text-xl font-bold border-2 md:border-3 border-white rounded-full mt-6 md:mt-8 flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out text-center">
                        {btnText}
                    </a>
                </div>
            </div>
        </div>
  
        <p className="absolute bottom-4 md:bottom-6 left-0 w-full text-center text-white text-xs px-4">
            *The information is subject to change and photos/images used are for illustration purposes only.
        </p>
      </Animated>
    )
  }