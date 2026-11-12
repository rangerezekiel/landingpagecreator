"use client"

import Animated from "@/components/animated"
import Image from "next/image"
import { storageUrl } from "@/app/_utils/objectTransformers"
import { VideoPayload } from "@/app/_types/section"
import { useState } from "react"
import { FaPlay } from "react-icons/fa"

interface VideoSectionProps {
  data?: VideoPayload[] | null
}

export default function Video({ data }: VideoSectionProps) {
  const [playingIds, setPlayingIds] = useState<Set<string>>(new Set())

  const markPlaying = (id: string) => {
    setPlayingIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const toYouTubeEmbed = (url?: string | null): string | null => {
    if (!url) return null
    try {
      const u = new URL(url)
      const hostname = u.hostname.replace(/^www\./, "")
      // Handle youtu.be short links
      if (hostname === "youtu.be") {
        const videoId = u.pathname.split("/").filter(Boolean)[0]
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      }
      // Handle youtube.com/watch?v=, shorts, and embed-safe
      if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com" || hostname === "youtube.googleapis.com") {
        // shorts
        if (u.pathname.startsWith("/shorts/")) {
          const videoId = u.pathname.split("/").filter(Boolean)[1]
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null
        }
        // watch?v=
        const v = u.searchParams.get("v")
        if (v) return `https://www.youtube.com/embed/${v}`
        // already an embed path
        if (u.pathname.startsWith("/embed/")) return url
      }
      // Handle www.youtube.com
      if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
        const v = u.searchParams.get("v")
        if (v) return `https://www.youtube.com/embed/${v}`
      }
    } catch {
      return null
    }
    return null
  }

  const items = Array.isArray(data) ? data : []
  if (items.length === 0) {
    return null
  }

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      <div id="video" className="bg-[#fff] py-8 md:py-12 lg:py-[50px]">
        <div className="container px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-bebas-neue uppercase font-bold text-center mb-8 md:mb-10 lg:mb-[40px] text-[#625950]">
            Videos
          </h2>

          {(() => {
            const count = items.length
            const gridColsClass = count === 1
              ? "grid-cols-1"
              : count === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            return (
              <div className={`grid ${gridColsClass} gap-6 md:gap-8 lg:gap-10`}>
            {items.map((item, index) => {
              const thumb = item.contents.THUMBNAIL?.value
              const title = item.contents.TITLE?.value
              const description = item.contents.DESCRIPTION?.value
              const link = item.contents.LINK?.value
              const embedUrl = toYouTubeEmbed(link)
              const id = String(item.detailId || index)
              const isPlaying = playingIds.has(id)

              return (
                <Animated key={`${item.detailId || index}`} animation="fade-up" delay={0.2 + index * 0.1}>
                  <div className="block group rounded-lg overflow-hidden border border-black/5 shadow-sm hover:shadow-lg transition-shadow duration-200">
                    {embedUrl && isPlaying ? (
                      <div className="relative w-full aspect-video bg-black">
                        <iframe
                          src={`${embedUrl}?autoplay=1&rel=0`}
                          title={title || `YouTube video ${index + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => embedUrl ? markPlaying(id) : window.open(link || "#", "_blank", "noopener,noreferrer")}
                        className="relative w-full aspect-video bg-black/5 focus:outline-none"
                        aria-label={title ? `Play ${title}` : "Play video"}
                      >
                        <Image
                          src={storageUrl(thumb || "") || "/assets/theme/t01/bg-contact.jpg"}
                          alt={title || `Video ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 text-white transition-transform duration-200 group-hover:scale-110">
                            <FaPlay className="ml-0.5" />
                          </span>
                        </span>
                      </button>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg md:text-xl font-semibold text-[#39362C] line-clamp-2 mb-2">
                        {title || "Video"}
                      </h3>
                      {description && (
                        <p className="text-sm text-black/70 line-clamp-3">{description}</p>
                      )}
                    </div>
                  </div>
                </Animated>
              )
            })}
              </div>
            )
          })()}
        </div>
      </div>
    </Animated>
  )
}


