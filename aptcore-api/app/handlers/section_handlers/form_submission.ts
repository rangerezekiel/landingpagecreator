import type { HttpContext } from '@adonisjs/core/http'
import { uploadFile } from '#helpers/upload_file'
import Website from '#models/website'
import SectionDetail from '#models/section_detail'
import Section from '#models/section'

export async function update(ctx: HttpContext) {
  const req = ctx.request.body()

  const domain = ctx.params.domain

  const website = await Website.query()
    .where('active', true)
    .where('domain', domain)
    .select(['id'])
    .firstOrFail()

  const section = await Section.query()
    .where('website_id', website.id)
    .where('key', 'FORM_SUBMISSION')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)
  let backgroundPath = null
  if (req.background) {
    backgroundPath = await uploadFile(req.background, {
      moduleName: 'FORM_SUBMISSION',
      previousPath: req.previous_background,
    })
  }

  let photoPath = null
  if (req.photo) {
    photoPath = await uploadFile(req.photo, {
      moduleName: 'FORM_SUBMISSION',
      previousPath: req.previous_photo,
    })
  }

  for (const content of sectionDetail) {
    switch (content.key) {
      case 'CONTENT':
        content.value = req.content
        break
      case 'PRIVYR_ENABLED':
        // Arrives as multipart form data, so `false` reaches us as the string
        // "false" — which is truthy. Compare explicitly.
        content.value =
          req.privyr_enabled === true || req.privyr_enabled === 'true' ? 'true' : 'false'
        break
      case 'PRIVYR_WEBHOOK_URL':
        // Only overwrite when a value is actually supplied, so saving the page
        // without retyping the URL does not wipe the stored one.
        if (req.privyr_webhook_url !== undefined) {
          content.value = req.privyr_webhook_url || null
        }
        break
    }
    if (req.background) {
      switch (content.key) {
        case 'BACKGROUND':
          content.value = backgroundPath as string
          break
      }
    }

    // Only overwrite on a fresh upload, so saving the page without re-picking
    // an image keeps the stored one.
    if (req.photo && content.key === 'PHOTO') {
      content.value = photoPath as string
    }

    await content.save()
  }

  return ctx.response.ok({ message: 'Form submission updated successfully' })
}
