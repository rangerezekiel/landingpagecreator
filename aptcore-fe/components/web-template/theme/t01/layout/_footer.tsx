"use client"

import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt, FaRegFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { WebsiteInfo } from "@/app/_utils/webInfo";
import { trackMetaEvent } from "@/lib/meta-conversions";

interface FooterProps {
  webInfo?: WebsiteInfo;
}

// Keep any URL inside FOOTER_CONTENT clickable, since the setting is a single free-text line
function renderFooterContent(text: string) {
  return text.split(/(https?:\/\/\S+|www\.\S+)/gi).map((part, i) =>
    /^(https?:\/\/|www\.)/i.test(part) ? (
      <Link
        key={i}
        href={part.startsWith("http") ? part : `https://${part}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[#6b7280]"
      >
        {part}
      </Link>
    ) : (
      part
    )
  );
}

export default function Footer({ webInfo }: FooterProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the bottom (within 100px for smoother transition)
      const isBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsAtBottom(isBottom);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer that appears when footer is visible */}
      <div className={`h-[255px] block md:hidden transition-opacity duration-500 ${
        isAtBottom ? 'opacity-100' : 'opacity-0'
      }`} />
      
      <footer className={`w-full fixed bottom-0 left-0 md:relative z-[99]`}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Agency info on white */}
          <div className={`bg-white text-center transition-opacity duration-500 px-3 ${
            isAtBottom ? 'opacity-100 py-6 md:py-8' : 'opacity-0 md:opacity-100 h-0 py-0'
          }`}>
            <p className="text-[12px] md:text-sm text-[#6b7280]">
              {webInfo?.setting?.footer_agency_label || "Appointed Marketing Agency:"}
            </p>
            <p className="mt-3 text-[12px] md:text-sm text-[#9ca3af]">
              {renderFooterContent(
                webInfo?.setting?.FOOTER_CONTENT ||
                  "Huttons Asia Pte. Ltd - Licence No: L3008899K - www.huttonsgroup.com"
              )}
            </p>
            <p className="mt-4">
              <Link href={webInfo?.setting?.footer_privacy_link || "#privacy"} className="text-[12px] md:text-sm text-[#9ca3af] underline hover:text-[#6b7280]">
                {webInfo?.setting?.footer_privacy_label || "Privacy Policy"}
              </Link>
            </p>
          </div>

          {/* Right: Actions on gold background */}
          <div className={`text-white transition-opacity duration-500 z-1 md:!bg-[#ccaf80] ${isAtBottom ? 'bg-[#ccaf80]' : 'bg-[#212529]'}`}>
            <div className="h-full px-6 md:px-10 py-5 md:py-8 flex items-center justify-around gap-6">
              <Link
                href={webInfo?.setting?.WHATSAPP_LINK || `https://wa.me/${webInfo?.setting?.footer_whatsapp_number || "+6598765023"}?text=${encodeURIComponent(webInfo?.setting?.footer_whatsapp_message || "Hi, I am interested to view Tampines St 94 GLS sales gallery. Thank you")}`}
                target="_blank"
                onClick={() => trackMetaEvent("Contact")}
                className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <FaWhatsapp className="w-9 h-9 md:w-11 md:h-11" />
                <span className="text-[14px] md:text-base">{webInfo?.setting?.footer_whatsapp_label || "WhatsApp"}</span>
              </Link>

              <Link
                href={`tel:${webInfo?.setting?.footer_phone_number || "+65 9876 5023"}`}
                className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <FaPhoneAlt className="w-9 h-9 md:w-11 md:h-11" />
                <span className="text-[14px] md:text-base">{webInfo?.setting?.footer_phone_label || "Call"}</span>
              </Link>

              <Link
                href={webInfo?.setting?.footer_register_link || "#contact"}
                className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <FaRegFileAlt className="w-9 h-9 md:w-11 md:h-11" />
                <span className="text-[14px] md:text-base">{webInfo?.setting?.footer_register_label || "Register"}</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}