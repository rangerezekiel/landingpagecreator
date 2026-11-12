import { createHash } from "crypto"

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const GRAPH_API_VERSION = "v21.0"

type MetaEventPayload = {
  eventName: string
  eventId: string
  eventSourceUrl?: string
  userData?: {
    email?: string
    phone?: string
  }
}

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex")
}

// Meta requires phone numbers in the hash to be digits-only, with country code, no leading +
function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "")
}

export async function handleMetaEvent(req: Request): Promise<Response> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    // Not configured yet — swallow silently so the frontend event firing never breaks the page
    return Response.json({ skipped: true }, { status: 200 })
  }

  let payload: MetaEventPayload
  try {
    payload = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!payload.eventName || !payload.eventId) {
    return Response.json({ error: "eventName and eventId are required" }, { status: 400 })
  }

  const forwardedFor = req.headers.get("x-forwarded-for")
  const clientIp = forwardedFor?.split(",")[0]?.trim()
  const userAgent = req.headers.get("user-agent") ?? undefined

  const userData: Record<string, string[] | string | undefined> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  }

  if (payload.userData?.email) {
    userData.em = [sha256(payload.userData.email)]
  }
  if (payload.userData?.phone) {
    userData.ph = [sha256(normalizePhone(payload.userData.phone))]
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`

  const graphPayload = {
    data: [
      {
        event_name: payload.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        event_source_url: payload.eventSourceUrl,
        action_source: "website",
        user_data: userData,
      },
    ],
  }

  try {
    const graphRes = await fetch(graphUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphPayload),
    })

    if (!graphRes.ok) {
      const errorText = await graphRes.text()
      console.error("[meta-conversions] Graph API error:", graphRes.status, errorText)
      return Response.json({ error: "Failed to forward event to Meta" }, { status: 502 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[meta-conversions] request to Graph API failed:", error)
    return Response.json({ error: "Failed to reach Meta" }, { status: 502 })
  }
}
