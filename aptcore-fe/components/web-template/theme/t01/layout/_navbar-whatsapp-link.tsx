"use client"

import { FaWhatsapp } from "react-icons/fa"
import { trackMetaEvent } from "@/lib/meta-conversions"

export default function NavbarWhatsappLink({ href }: { href?: string }) {
  return (
    <a
      href={href}
      onClick={() => trackMetaEvent("Contact")}
      className="flex justify-center items-center bg-[#ceb183] text-white h-[61px] min-w-[200px] px-[25px] py-[17px] text-[18px] gap-[5px] transition-transform duration-200 hover:scale-110 hover:rounded-[4px] font-bold"
    >
      <FaWhatsapp />
      Whatsapp
    </a>
  )
}
