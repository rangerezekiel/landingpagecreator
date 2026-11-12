import { NextStepContents, WhatIsNextContents } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Animated from "@/components/animated"
import ShinyButton from "@/components/web-template/theme/t01/partial/shiny-button"
import { FaSun, FaUnlockKeyhole } from "react-icons/fa6"

export default function NextStep({ data, whatIsNextData }: { data: NextStepContents; whatIsNextData?: WhatIsNextContents }) {
  if (!data || !data.active) {
    return null
  }

  const title = data?.details?.TITLE?.value
  const description = data?.details?.DESCRIPTION?.value
  const nextStepList = data?.details?.LIST?.items
  
  // What is Next data
  const whatIsNextTitle = whatIsNextData?.details?.TITLE?.value
  const whatIsNextList = whatIsNextData?.details?.LIST?.items

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="nextstep" className="py-8 md:py-12 lg:py-[40px] bg-[#5B5B4F]">
        <div className="container px-4">
          <div className="flex flex-col gap-5 text-center items-center">
            <Animated animation="fade-up" delay={0.4}>
              <FaSun className="text-white text-[50px] mb-3"/>
            </Animated>

            <Animated animation="fade-up" delay={0.5}>
              <h2 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[73px] font-bold font-bebas-neue leading-[0.8]">
                {title || "HOW DO YOU WANT TO THE NEXT STEP"}
              </h2>
            </Animated>

            <Animated animation="fade-up" delay={0.6}>
              <div 
                className="text-white text-[18px] leading-[1]"
                dangerouslySetInnerHTML={{ __html: description || "The Tampines St 94 GLS is coming soon in,<br/>here's how you can learn more:" }}
              />
            </Animated>

            {/* Top Content - Next Step Cards */}
            {nextStepList && nextStepList.length > 0 && (
              <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-[20px] w-full mt-10">
                {nextStepList.map((item, index) => {
                  const content = item.contents
                  const background = content?.BACKGROUND?.value
                  const subtitle = content?.SUBTITLE?.value
                  const itemTitle = content?.TITLE?.value
                  const itemDescription = content?.DESCRIPTION?.value
                  const button = content?.BUTTON?.jsonValue

                  return (
                    <Animated key={index} animation="fade-up" delay={0.6 + (index * 0.2)} className="w-full max-w-[526px] relative before:content-['*'] before:absolute before:w-full before:h-full before:bg-black/30 before:top-0 before:left-0 before:rounded-[15px]">
                      <div 
                        className="w-full min-h-[420px] md:min-h-[520px] lg:min-h-[593px] shadow-[0_0_10px_0_#000] rounded-[15px] overflow-hidden p-10 flex flex-col items-center"
                        style={{
                          backgroundImage: background ? `url(${storageUrl(background)})` : 'url(/assets/theme/t01/next-step-preview-access.png)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <p className="relative text-white font-bebas-neue text-[20px] uppercase">
                          {subtitle || "SUBSCRIBE NOW FOR FIRSTHAND INFORMATION"}
                        </p>
                        <p className="relative text-white font-bebas-neue text-[34px] lg:text-[83px] leading-[.85] uppercase font-bold mt-5">
                          {itemTitle || "GET PREVIEW ACCESS"}
                        </p>
                        <div 
                          className="relative font-roboto text-[16px] leading-[1.5] mt-5 text-white max-w-[355px] font-[500]"
                          dangerouslySetInnerHTML={{ __html: itemDescription || "✓ Get the E-Brochure + Floor Plans + Viewing Invitation the moment they are released by the developer!" }}
                        />

                        {button && (
                          <ShinyButton 
                            className="relative bg-gradient-to-b from-[#ffa702] via-[#ffa702] to-[#ffcb6a] mt-15 h-fit rounded-[15px] !py-0" 
                            contentClassName="flex gap-4 py-[15px] uppercase"
                            href={button.LINK}
                          >
                            <FaUnlockKeyhole className="text-[30px]" />
                            <p className="flex flex-col">
                              <strong className="text-[20px]">
                                {button.TITLE || "GET PREVIEW ACCESS"}
                              </strong>
                              <small className="text-[16px]">
                                {button.SUBTITLE || "PREVIEW INVITE + PRICE LIST + FLOOR PLANS"}
                              </small>
                            </p>
                          </ShinyButton>
                        )}
                      </div>
                    </Animated>
                  )
                })}
              </div>
            )}

            {/* Bottom Content - What is Next Section */}
            {whatIsNextData && whatIsNextData.active && whatIsNextList && whatIsNextList.length > 0 && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-[40px] mt-[60px] md:mt-[100px] w-full md:justify-start">
                <Animated animation="fade-left" delay={0.4}>
                  <p className="flex justify-center md:justify-start text-center md:text-left text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[90px] font-bold font-bebas-neue leading-[1.2] md:text-nowrap">
                    {whatIsNextTitle || "What is<br/>Next?"}
                  </p>
                </Animated>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-[20px] w-full">
                  {whatIsNextList.map((item, index) => {
                    const content = item.contents
                    const subtitle = content?.SUBTITLE?.value || "Step"
                    const itemTitle = content?.TITLE?.value || "Next Step"
                    const itemDescription = content?.DESCRIPTION?.value || "Description for this step"
                    
                    // Determine background color based on index (first item is highlighted)
                    const bgColor = index === 0 ? "bg-[#ffa600]" : "bg-[#464E6E]"
                    const textColor = index === 0 ? "text-black" : "text-white"
                    const stepLabel = index === 0 ? "You Are Here" : index === 1 ? "Next" : "Finally"
                    
                    return (
                      <Animated key={`what-is-next-${index}`} animation="fade-up" delay={0.6 + (index * 0.2)} className="w-full">
                        <div className={`rounded-[15px] pt-[70px] px-[10px] pb-[100px] flex flex-col items-center ${bgColor} h-full`}>
                          <p className="uppercase font-roboto text-[16px] font-bold text-white">
                            {subtitle || stepLabel}
                          </p>
                          <p className={`uppercase text-3xl sm:text-4xl md:text-5xl xl:text-[66px] font-bold font-bebas-neue leading-[0.8] mt-5 mb-10 ${textColor}`}>
                            {itemTitle}
                          </p>
                          <p className="font-roboto text-[16px] leading-[1.5] text-white max-w-[355px] font-[500]">
                            {itemDescription}
                          </p>
                        </div>
                      </Animated>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Animated>
  )
}
