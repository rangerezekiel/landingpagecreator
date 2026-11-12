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
    .where('key', 'HERO')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)
  let backgroundPath = null
  if (req.background) {
    backgroundPath = await uploadFile(req.background, {
      moduleName: 'HERO',
      previousPath: req.previous_background,
    })
  }

  for (const content of sectionDetail) {
    switch (content.key) {
      case 'TITLE':
        content.value = req.title
        break
      case 'CONTENT':
        content.value = req.content
        break
      case 'REGISTER_BUTTON':
        content.jsonValue = JSON.stringify({
          TITLE: req.button_title,
          SUBTITLE: req.button_subtitle,
          ICON: null,
          LINK: req.button_link,
        })
        break
    }
    if (req.background) {
      switch (content.key) {
        case 'BACKGROUND':
          content.value = backgroundPath as string
          break
      }
    }

    await content.save()
  }

  return ctx.response.ok({ message: 'Hero updated successfully' })
}
