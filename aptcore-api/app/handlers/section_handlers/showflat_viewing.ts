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
    .where('key', 'SHOWFLAT_VIEWING')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)
  let imagePath = null
  if (req.image) {
    imagePath = await uploadFile(req.image, {
      moduleName: 'SHOWFLAT_VIEWING',
      previousPath: req.previous_image,
    })
  }

  for (const content of sectionDetail) {
    switch (content.key) {
      case 'TITLE':
        content.value = req.title
        break
      case 'DESCRIPTION':
        content.value = req.description
        break
      case 'REQUEST_BUTTON':
        content.jsonValue = JSON.stringify({
          TITLE: req.request_button_title,
          SUBTITLE: null,
          ICON: null,
          LINK: req.request_button_link,
        })
        break
      case 'HOTLINE_BUTTON':
        content.jsonValue = JSON.stringify({
          TITLE: req.hotline_button_title,
          SUBTITLE: null,
          ICON: null,
          LINK: req.hotline_button_link,
        })
        break
    }
    if (req.image) {
      switch (content.key) {
        case 'IMAGE':
          content.value = imagePath as string
          break
      }
    }

    await content.save()
  }

  return ctx.response.ok({ message: 'E-brocure updated successfully' })
}
