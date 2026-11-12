import { EBrocureContent } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from "@/components/animated"
import Image from "next/image"

export default function EBrochure({ data }: { data: EBrocureContent["details"] }) {
  if (!data) {
    return null
  }

  const title = data?.TITLE?.value
  const image = data?.IMAGE?.value
  const description = data?.DESCRIPTION?.value
  const button = data?.BUTTON?.jsonValue

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="brochure" className="py-8 md:py-12 lg:py-[40px] tracking-wider bg-[#ecebde]">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-[40px]">
            <div className="flex flex-col gap-5 text-[#3f3d03] order-2 lg:order-1">
              <Animated animation="fade-right" delay={0.4}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-bold leading-[1] font-bebas-neue">
                  {title || "Get Your E-Brochure Now!"}
                </h2>
              </Animated>
              
              <Animated animation="fade-right" delay={0.5}>
                <div 
                  className="text-sm md:text-base lg:text-lg font-arial"
                  dangerouslySetInnerHTML={{ __html: description || "Explore our comprehensive E-Brochure to discover impressive amenities and exciting upcoming developments." }}
                />
              </Animated>

              {button && (
                <Animated animation="fade-right" delay={0.6}>
                  <a 
                    href={button.LINK} 
                    rel="noopener noreferrer"
                    className="bg-[#ceb183] text-white w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base font-bold rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                  >
                    {button.TITLE || "REQUEST E-BROCHURE"}
                  </a>
                </Animated>
              )}
            </div>
            
            <div className="flex flex-col gap-5 order-1 lg:order-2">
              <Animated animation="fade-left" delay={0.4}>
                <div className="relative">
                  {/* 16/9 matches the dashboard's crop ratio. A square box here
                      reserves the wrong height and shifts the page once the image
                      loads, which throws off #anchor jumps. */}
                  <Image
                    src={storageUrl(image || '/assets/theme/t01/brochure.png')}
                    alt={title || "E-Brochure"}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <small className="text-xs tracking-normal text-[#3f3d03] mt-2 block">
                    *The information is subject to change and photos/images used are for illustration purposes only.
                  </small>
                </div>
              </Animated>
            </div>
          </div>
        </div>
      </div>
    </Animated>
  )
}
