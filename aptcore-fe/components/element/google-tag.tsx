import Script from "next/script"

interface GoogleTagProps {
  /** Per-website gtag.js measurement / conversion ID, e.g. "G-XXXXXXXXXX" or "AW-690775838" */
  tagId?: string | null
}

// Google only accepts IDs in this shape (G- GA4, AW- Ads, GT- / UA- legacy).
// Anything else is a typo or a pasted full snippet, and injecting it would break the page.
const TAG_ID_PATTERN = /^(G|AW|GT|UA|DC)-[A-Z0-9-]+$/i

/**
 * Renders the per-website Google tag. Driven by the GOOGLE_TAG_ID website setting,
 * so each domain reports to its own Google property. Renders nothing when unset.
 */
export default function GoogleTag({ tagId }: GoogleTagProps) {
  const id = tagId?.trim()

  if (!id || !TAG_ID_PATTERN.test(id)) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(id)});
        `}
      </Script>
    </>
  )
}
