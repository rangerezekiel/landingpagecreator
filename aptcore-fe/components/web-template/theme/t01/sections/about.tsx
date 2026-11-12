import { AboutContent } from "@/app/_types/section"
import Animated from "@/components/animated"
import Image from "next/image"
import { storageUrl } from "@/app/_utils/objectTransformers"
import { FaQuoteLeft } from "react-icons/fa6"

export default function About({ data }: { data: AboutContent["details"] }) {
  if (!data) {
    return null
  }

  const image = data.IMAGE.value
  const title = data.TITLE.value
  const content = data.CONTENT.value

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="about" className="bg-[#a59d84] py-12 md:py-20 lg:py-[100px] px-4">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-[60px] items-start">
            {/* Left Image */}
            <div className="relative">
              <Animated animation="fade-right" delay={0.4}>
                <div className="relative h-[300px] md:h-[400px] lg:h-[347px] overflow-hidden">
                  <Image
                    src={storageUrl(image) || "/assets/theme/t01/future.png"}
                    alt="Future Growth - Swimming Pool and Development"
                    fill
                    className="object-cover"
                    priority={false}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
                <div className="text-white text-xs mt-2">
                  *The information is subject to change and photos/images used are for illustration purposes only.
                </div>
              </Animated>
            </div>

            {/* Right Content */}
            <div className="text-white">
              <Animated animation="fade-left" delay={0.5}>
                <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-3 md:gap-5">
                  <FaQuoteLeft className="text-4xl md:text-5xl lg:text-[76px] text-white flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px] font-bold leading-tight uppercase font-bebas-neue tracking-wider">
                    {title || "FUTURE GROWTH AND INVESTMENT POTENTIAL"}
                  </h2>
                </div>
              </Animated>
              
              <Animated animation="fade-left" delay={0.6}>
                <div 
                  className="space-y-4 md:space-y-6 text-sm md:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content || "Default content about future growth and investment potential." }}
                />
              </Animated>
            </div>
          </div>
        </div>
      </div>
    </Animated>
  )
}
