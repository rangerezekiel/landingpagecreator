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
    .where('key', 'ABOUT')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)
  let imagePath = null
  if (req.image) {
    imagePath = await uploadFile(req.image, {
      moduleName: 'ABOUT',
      previousPath: req.previous_image,
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

  return ctx.response.ok({ message: 'About updated successfully' })
}
