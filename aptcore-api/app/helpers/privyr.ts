import Section from '#models/section'
import SectionDetail from '#models/section_detail'
import Website from '#models/website'

const PRIVYR_TIMEOUT_MS = 8000

export interface PrivyrLead {
  name: string
  email?: string | null
  phone?: string | null
  displayName?: string | null
  otherFields?: Record<string, string>
}

export interface PrivyrResult {
  success: boolean
  leadId?: string
  error?: string
  /** True when the website simply has Privyr turned off — not a failure. */
  skipped?: boolean
}

interface PrivyrApiResponse {
  success?: boolean
  lead_id?: string
}

/**
 * Read a website's Privyr config from its FORM_SUBMISSION section.
 *
 * The webhook URL lives here rather than in an env var so each website can point
 * at its own Privyr account. It is only ever read server-side.
 */
async function getPrivyrConfig(
  websiteId: string
): Promise<{ enabled: boolean; webhookUrl: string | null }> {
  const section = await Section.query()
    .where('website_id', websiteId)
    .where('key', 'FORM_SUBMISSION')
    .select(['id'])
    .first()

  if (!section) return { enabled: false, webhookUrl: null }

  const details = await SectionDetail.query()
    .where('section_id', section.id)
    .whereIn('key', ['PRIVYR_ENABLED', 'PRIVYR_WEBHOOK_URL'])
    .select(['key', 'value'])

  const byKey = Object.fromEntries(details.map((detail) => [detail.key, detail.value]))

  return {
    enabled: byKey.PRIVYR_ENABLED === 'true',
    webhookUrl: byKey.PRIVYR_WEBHOOK_URL || null,
  }
}

/**
 * Push a lead to Privyr's incoming-leads webhook.
 *
 * Callers treat this as best-effort: the lead is already stored in our own
 * database, which stays the source of truth, so a Privyr outage must never fail
 * the visitor's submission.
 */
export async function pushLeadToPrivyr(websiteId: string, lead: PrivyrLead): Promise<PrivyrResult> {
  const { enabled, webhookUrl } = await getPrivyrConfig(websiteId)

  if (!enabled) return { success: false, skipped: true }

  // Enabled but unconfigured is a real misconfiguration, so it is not skipped.
  if (!webhookUrl) {
    return { success: false, error: 'Privyr is enabled but no webhook URL is configured' }
  }

  // Attribution: which of our websites the lead came from. Resolved here rather
  // than at the call site so every caller gets it without having to remember,
  // and so several websites sharing one Privyr account stay tellable apart.
  const website = await Website.query().where('id', websiteId).select(['title', 'domain']).first()

  const otherFields: Record<string, string> = {
    ...lead.otherFields,
    ...(website?.title ? { Source: website.title } : {}),
    ...(website?.domain ? { Website: website.domain } : {}),
  }

  // Privyr only requires `name`; empty fields are intentionally omitted.
  const body: Record<string, unknown> = { name: lead.name }
  if (lead.email) body.email = lead.email
  if (lead.phone) body.phone = lead.phone
  if (lead.displayName) body.display_name = lead.displayName
  if (Object.keys(otherFields).length > 0) {
    body.other_fields = otherFields
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(PRIVYR_TIMEOUT_MS),
    })

    const text = await res.text()

    if (!res.ok) {
      return { success: false, error: `Privyr responded ${res.status}: ${text}` }
    }

    const parsed = JSON.parse(text) as PrivyrApiResponse
    return { success: parsed.success === true, leadId: parsed.lead_id }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
