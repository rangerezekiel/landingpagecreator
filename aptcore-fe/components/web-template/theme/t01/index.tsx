// import Link from "next/link"
import Animated from "@/components/animated"

// Style
import "@/styles/scss/theme/t01/style.scss"
// end Style 

// React icon 
// import { FaFingerprint } from "react-icons/fa6"
// import { FaQuoteLeft } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaHourglass } from "react-icons/fa6";
import { HiHome } from "react-icons/hi";
import { FaRegAddressCard } from "react-icons/fa";
// import { IoIosCall } from "react-icons/io";
// import { FaSun } from "react-icons/fa6";
// import { FaUnlockKeyhole } from "react-icons/fa6";
// end React icon

// Template Component
import Navbar from "@/components/web-template/theme/t01/layout/_navbar"
import Footer from "@/components/web-template/theme/t01/layout/_footer"
// end Template Component

// Website data 
import { getWebsiteData } from "@/app/_utils/webInfo";
import { 
    getBannerData,
    getVideoData,
    getHeroData,
    getAboutData,
    getEBrocureData,
    getShowflatViewingData,
    getDevelopedByData,
    getFormSubmissionData,
    getFAQData,
    getWhatIsNextData,
    getUnitTypesAccordionData,
    getNextStepData,
    getUnitTypesData,
    getLocationData,
    getSimillarProjectData,
} from "@/app/_utils/webSection"
// end Website data 

// Section Component
import Banner from "@/components/web-template/theme/t01/sections/banner"
import Hero from "@/components/web-template/theme/t01/sections/hero"
import About from "@/components/web-template/theme/t01/sections/about"
import EBrochure from "@/components/web-template/theme/t01/sections/e-brochure"
import Location from "@/components/web-template/theme/t01/sections/location"
import UnitType from "@/components/web-template/theme/t01/sections/unit-type"
import FloorPlan from "@/components/web-template/theme/t01/sections/floor-plan"
import ShowflatViewing from "@/components/web-template/theme/t01/sections/showflat-viewing"
import FAQ from "@/components/web-template/theme/t01/sections/faq"
import NextStep from "@/components/web-template/theme/t01/sections/next-step"
import SimillarProject from "@/components/web-template/theme/t01/sections/simillar-project"
import Video from "@/components/web-template/theme/t01/sections/video"
import Developer from "@/components/web-template/theme/t01/sections/developer"
import FormSubmission from "@/components/web-template/theme/t01/sections/form-submission"
// end Section Component

export default async function T01() {
    
    // Data
    const webInfo = await getWebsiteData()
    const websiteId = webInfo.info?.id || null
    const webSettings = webInfo.setting
    const bannerData = await getBannerData()
    const heroData = await getHeroData()
    const videoData = await getVideoData()
    const aboutData = await getAboutData()
    const eBrocureData = await getEBrocureData()
    const showflatViewingData = await getShowflatViewingData()
    const developedByData = await getDevelopedByData()
    const formSubmissionData = await getFormSubmissionData()
    const faqData = await getFAQData()
    const whatIsNextData = await getWhatIsNextData()
    const unitTypesAccordionData = await getUnitTypesAccordionData()
    const nextStepData = await getNextStepData()
    const unitTypesData = await getUnitTypesData()
    const locationData = await getLocationData()
    const simillarData = await getSimillarProjectData()
    // console.log(webInfo)

    return (
        <>
            <Navbar webInfo={webInfo}/>
            
            <div className="mt-[130px] hidden md:block"/>
            
            {/* Banner */}
            {bannerData && bannerData.length > 0 && (
                <Banner data={bannerData} />
            )}
            {/* end Banner */}

            {/* Limited */}
            {heroData && (
                <Hero data={heroData} />
            )}
            {/* end Limited */}

            {/* Future Growth Section */}
            {aboutData && (
                <About data={aboutData} />
            )}
            {/* end Future Growth */}

            {/* Specification */}
            <Animated animation="fade-up" delay={0.2} className="relative">
                <div id="specification" className="py-8 md:py-12 lg:py-[40px] font-bebas-neue tracking-wider">
                    <div className="px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8 lg:gap-[20px]">
                            <div className="flex gap-3 md:gap-5 text-[#6A6453] leading-[1] uppercase items-center">
                                <FaBuilding className="text-2xl md:text-3xl lg:text-[40px] text-[#6A6453] min-w-[32px] md:min-w-[40px] lg:min-w-[48px] flex-shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg md:text-xl lg:text-2xl xl:text-[26px] font-bold leading-[0.85]">
                                        {webInfo.info?.metaTitle || 'TAMPINES ST 94 GLS'}
                                    </p> 
                                    <p className="text-xs md:text-sm lg:text-base">
                                        PROPERTY NAME
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 md:gap-5 text-[#6A6453] leading-[1] uppercase items-center">
                                <FaLocationDot className="text-2xl md:text-3xl lg:text-[40px] text-[#6A6453] min-w-[32px] md:min-w-[40px] lg:min-w-[48px] flex-shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg md:text-xl lg:text-2xl xl:text-[26px] font-bold leading-[0.85]">
                                        {webSettings?.ADDRESS || 'TAMPINES ST 94'}
                                    </p> 
                                    <p className="text-xs md:text-sm lg:text-base">
                                        ADDRESS NAME
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 md:gap-5 text-[#6A6453] leading-[1] uppercase items-center">
                                <FaRegCalendarCheck className="text-2xl md:text-3xl lg:text-[40px] text-[#6A6453] min-w-[32px] md:min-w-[40px] lg:min-w-[48px] flex-shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg md:text-xl lg:text-2xl xl:text-[26px] font-bold leading-[0.85]">
                                        {webSettings?.EXPECTED_DATE || '2029'}
                                    </p> 
                                    <p className="text-xs md:text-sm lg:text-base">
                                        EXPECTED T.O.P DATE
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 md:gap-5 text-[#6A6453] leading-[1] uppercase items-center">
                                <FaHourglass className="text-2xl md:text-3xl lg:text-[40px] text-[#6A6453] min-w-[32px] md:min-w-[40px] lg:min-w-[48px] flex-shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg md:text-xl lg:text-2xl xl:text-[26px] font-bold leading-[0.85]">
                                        {webSettings?.TENURE || '99 YEARS'}
                                    </p> 
                                    <p className="text-xs md:text-sm lg:text-base">
                                        TENURE
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 md:gap-5 text-[#6A6453] leading-[1] uppercase items-center">
                                <HiHome className="text-2xl md:text-3xl lg:text-[40px] text-[#6A6453] min-w-[32px] md:min-w-[40px] lg:min-w-[48px] flex-shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg md:text-xl lg:text-2xl xl:text-[26px] font-bold leading-[0.85]">
                                        {webSettings?.TOTAL_UNITS || '585'}
                                    </p> 
                                    <p className="text-xs md:text-sm lg:text-base">
                                        TOTAL UNITS
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 md:gap-5 text-[#6A6453] leading-[1] uppercase items-center sm:col-span-2 lg:col-span-3 xl:col-span-1">
                                <FaRegAddressCard className="text-2xl md:text-3xl lg:text-[40px] text-[#6A6453] min-w-[32px] md:min-w-[40px] lg:min-w-[48px] flex-shrink-0" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg md:text-xl lg:text-2xl xl:text-[26px] font-bold leading-[0.85]">
                                        {webSettings?.DEVELOPER || 'Hoi Hup Realty and Sunway Developments'}
                                    </p> 
                                    <p className="text-xs md:text-sm lg:text-base">
                                        Developer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Animated>
            {/* end Specification */}

            {/* E-Brochure */}
            {eBrocureData && (
                <EBrochure data={eBrocureData} />
            )}
            {/* end E-Brochure */}

            {/* Location */}
            {locationData && locationData.active && (
                <Location data={locationData} />
            )}
            {/* end Location */}

            {/* Unit Type Accordion */}
            {unitTypesAccordionData && unitTypesAccordionData.active && (
                <UnitType accordionData={unitTypesAccordionData} />
            )}
            {/* end Unit Type Accordion */}

            {/* Floor Plan (Unit Type) */}
            {unitTypesData && unitTypesData.active && (
                <FloorPlan data={unitTypesData} />
            )}
            {/* end Floor Plan */}

            {/* Showflat Viewing */}
            {showflatViewingData && (
                <ShowflatViewing data={showflatViewingData} webSettings={webSettings} />
            )}
            {/* end Showflat Viewing */}

            {/* Video */}
            {videoData && videoData.length > 0 && (
                <Video data={videoData} />
            )}
            {/* end Video */}

            {/* FAQ */}
            {faqData && (
                <FAQ data={faqData} />
            )}
            {/* end FAQ*/}

            {/* Next Step */}
            {nextStepData && (
                <NextStep data={nextStepData} whatIsNextData={whatIsNextData} />
            )}
            {/* end Next Step */}

            {/* Simillar Project */}
            {simillarData && simillarData.active && (
                <SimillarProject data={simillarData} />
            )}
            {/* end Simillar Project */}

            {/* Developer */}
            {developedByData && (
                <Developer data={developedByData} />
            )}
            {/* end Developer */}

            {/* Form Contact */}
            <FormSubmission data={formSubmissionData || undefined} websiteId={websiteId} />
            {/* end Form Contact */}

            {/* Footer */}
            <Footer webInfo={webInfo} />
            {/* end Footer */}
        </>
    )
}