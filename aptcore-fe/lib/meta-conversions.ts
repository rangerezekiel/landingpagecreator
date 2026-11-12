"use client"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export type MetaUserData = {
  email?: string
  phone?: string
}

export type MetaEventName = "Lead" | "Contact"

function generateEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Fires a Meta Pixel + Conversions API event pair for the same user action.
 * Both use the same event_id so Meta dedupes the browser and server copies
 * instead of double-counting the conversion.
 */
export function trackMetaEvent(eventName: MetaEventName, userData?: MetaUserData) {
  const eventId = generateEventId()
  const eventSourceUrl = typeof window !== "undefined" ? window.location.href : undefined

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, {}, { eventID: eventId })
  }

  fetch("/api/meta-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl,
      userData,
    }),
    keepalive: true,
  }).catch((error) => {
    console.error("[meta-conversions] failed to send server-side event:", error)
  })
}
