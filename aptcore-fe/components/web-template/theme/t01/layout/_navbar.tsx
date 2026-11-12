import Animated from "@/components/animated"
import Image from "next/image"
import { WebsiteInfo } from "@/app/_utils/webInfo"
import { storageUrl } from "@/app/_utils/objectTransformers"
import NavbarWhatsappLink from "./_navbar-whatsapp-link"

export default function Navbar({ webInfo }: { webInfo: WebsiteInfo }){
        
    return (
        <>
            <div className="h-[130px] w-full bg-white md:fixed top-0 z-[99]">
               <div className="px-[15px] mx-auto h-full flex justify-around items-center">
                    <Animated animation="zoom-in" delay={0.1} className="hidden md:block">
                        <NavbarWhatsappLink href={webInfo.setting?.WHATSAPP_LINK} />
                    </Animated>
                    <Animated animation="fade-down" delay={0}>
                        <Image 
                            src={webInfo.info?.logo ? storageUrl(webInfo.info.logo) : "/assets/theme/t01/tampines-logo.png"} 
                            alt={webInfo.info?.title || "Website Logo"}
                            width={213}
                            height={100}
                            priority={true} 
                            className="h-[110px] w-[unset] min-w-[unset]"
                        />
                    </Animated>
                    <Animated animation="zoom-in" delay={0.1} className="hidden md:block">    
                        <a href={webInfo.setting?.PHONE_LINK} className="flex justify-center items-center bg-[#ceb183] text-white h-[61px] min-w-[200px] px-[25px] py-[17px] text-[18px] gap-[5px] transition-transform duration-200 hover:scale-110 hover:rounded-[4px] font-bold">
                            CALL: {webInfo.setting?.PHONE}
                        </a>
                    </Animated>
               </div>
            </div>
        </>
    )
}