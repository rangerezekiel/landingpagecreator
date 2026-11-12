import { ShowflatViewingContent } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from "@/components/animated"
import Image from "next/image"
import { IoIosCall } from "react-icons/io"
import { WebsiteSetting } from "@/app/_utils/webInfo"

export default function ShowflatViewing({ data, webSettings }: { data: ShowflatViewingContent["details"], webSettings?: WebsiteSetting | null }) {
  if (!data) {
    return null
  }

  const title = data?.TITLE?.value
  const image = data?.IMAGE?.value
  const description = data?.DESCRIPTION?.value
  // const hotlineButton = data?.HOTLINE_BUTTON?.jsonValue
  // const requestButton = data?.REQUEST_BUTTON?.jsonValue

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="showflatviewing" className="py-8 md:py-12 lg:py-[40px] tracking-wider bg-[#FFFFFF]">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-[40px]">
            <div className="flex flex-col gap-5 order-1 lg:order-1">
              <Animated animation="fade-left" delay={0.4}>
                {/* 16/9 matches the dashboard's crop ratio — see e-brochure. */}
                <Image
                  src={storageUrl(image || '/assets/theme/t01/showflat.png')}
                  alt={title || "Showflat Viewing"}
                  width={800}
                  height={450}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <small className="text-xs tracking-normal text-[#625950] mt-2 block">
                  *The information is subject to change and photos/images used are for illustration purposes only.
                </small>
              </Animated>
            </div>
            <div className="flex flex-col items-end gap-5 text-[#625950] order-2 text-end">
              <Animated animation="fade-right" delay={0.4}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-bold leading-[1] font-bebas-neue">
                  {title || "SHOWFLAT VIEWING"}
                </h2>
              </Animated>
              
              <Animated animation="fade-right" delay={0.5}>
                <div 
                  className="text-sm md:text-base lg:text-[16px] font-arial"
                  dangerouslySetInnerHTML={{ __html: description || "Tampines St 94 GLS Sales Gallery is Strictly by Appointment only.<br />Contact us now to receive your invitation to visit our showflat." }}
                />
              </Animated>

              {/* {hotlineButton && (
                <Animated animation="fade-right" delay={0.6}>
                  <a 
                    href={hotlineButton.LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#ceb183] text-white w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base font-bold rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                  >
                    <IoIosCall className="mr-2" />
                    {hotlineButton.TITLE || "SHOWFLAT HOTLINE"}
                  </a>
                </Animated>
              )} */}

              <Animated animation="fade-right" delay={0.6}>
                <a 
                  href={`tel:${webSettings?.PHONE || "+65 9876 5023"}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#ceb183] text-white w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base font-bold rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                >
                  <IoIosCall className="mr-2" />
                  SHOWFLAT HOTLINE: {webSettings?.PHONE || "+65 9876 5023"}
                </a>
              </Animated>

              <Animated animation="fade-right" delay={0.6}>
                <a 
                  href="#contact"
                  rel="noopener noreferrer"
                  className="bg-[#ceb183] text-white w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base font-bold rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                >
                  REQUEST SHOWFLAT VIEWING
                </a>
              </Animated>

              {/* {requestButton && (
                <Animated animation="fade-right" delay={0.6}>
                  <a 
                    href={requestButton.LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#ceb183] text-white w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base font-bold rounded-full mt-4 md:mt-[5px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                  >
                    {requestButton.TITLE || "REQUEST SHOWFLAT VIEWING"}
                  </a>
                </Animated>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </Animated>
  )
}
