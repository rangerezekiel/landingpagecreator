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
    .where('key', 'DEVELOPED_BY')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)
  let backgroundPath = null
  if (req.background) {
    backgroundPath = await uploadFile(req.background, {
      moduleName: 'DEVELOPED_BY',
      previousPath: req.previous_background,
    })
  }

  let logoPath = null
  if (req.logo) {
    logoPath = await uploadFile(req.logo, {
      moduleName: 'DEVELOPED_BY',
      previousPath: req.previous_logo,
    })
  }

  for (const content of sectionDetail) {
    switch (content.key) {
      case 'DESCRIPTION':
        content.value = req.description
        break
    }
    if (req.background) {
      switch (content.key) {
        case 'BACKGROUND':
          content.value = backgroundPath as string
          break
      }
    }

    if (req.logo) {
      switch (content.key) {
        case 'LOGO':
          content.value = logoPath as string
          break
      }
    }

    await content.save()
  }

  return ctx.response.ok({ message: 'Developed by updated successfully' })
}
