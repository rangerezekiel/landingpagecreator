import { Metadata } from "next"
import { notFound } from "next/navigation"
import WebTemplate from "@/components/web-template/web-template"
import { getWebsiteData } from "@/app/_utils/webInfo"
import { storageUrl } from "@/app/_utils/objectTransformers"
import GoogleTag from "@/components/element/google-tag"

// Force dynamic rendering since we use headers()
export const dynamic = 'force-dynamic'

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const webInfo = await getWebsiteData()
  
  // If website not found or not active, return 404 metadata
  if (!webInfo.info || !webInfo.info.active) {
    return {
      title: "Page Not Found",
      description: "The requested website could not be found or is not active.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }
  
  // Create cache-busting favicon URL
  const faviconUrl = webInfo.info.favicon ? 
    `${storageUrl(webInfo.info.favicon)}?v=${webInfo.info.updatedAt || Date.now()}` : 
    "/logo.svg"
  
  return {
    title: webInfo.info.metaTitle || webInfo.info.title || "Default Title",
    description: webInfo.info.metaDescription || "Default description",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: webInfo.info.metaTitle || webInfo.info.title || "Default Title",
      description: webInfo.info.metaDescription || "Default description",
      images: [
        {
          url: webInfo.info.logo ? storageUrl(webInfo.info.logo) : "logo.png",
          width: 1200,
          height: 630,
          alt: webInfo.info.title || "Default Title",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: webInfo.info.metaTitle || webInfo.info.title || "Default Title",
      description: webInfo.info.metaDescription || "Default description",
      images: [webInfo.info.logo ? storageUrl(webInfo.info.logo) : "logo.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Home() {
  const webInfo = await getWebsiteData()

  // If website not found or not active, show 404
  if (!webInfo.info || !webInfo.info.active) {
    notFound()
  }

  return (
    <>
      <GoogleTag tagId={webInfo.setting?.GOOGLE_TAG_ID} />
      <WebTemplate
        theme={webInfo.info.theme || "T01"}
      />
    </>
  );
}
