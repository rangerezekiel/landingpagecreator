import type { HttpContext } from '@adonisjs/core/http'
import Website from '#models/website'
import SectionDetail from '#models/section_detail'
import SectionDetailItem from '#models/section_detail_item'
import SectionDetailItemContent from '#models/section_detail_item_content'
import Section from '#models/section'
import { deleteFn } from '#helpers/crud'
import { randomUUID } from 'node:crypto'

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
    .where('key', 'WHAT_IS_NEXT')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)

  if (req.type_data === 'LIST') {
    const id = ctx.params.id
    const item = await SectionDetailItem.findOrFail(id)
    item.sortOrder = req.sort_order
    await item.save()

    const contentMap = await SectionDetailItemContent.query().where('sectionDetailItemId', item.id)

    for (const content of contentMap) {
      switch (content.key) {
        case 'SUBTITLE':
          content.value = req.subtitle
          break
        case 'TITLE':
          content.value = req.title
          break
        case 'DESCRIPTION':
          content.value = req.description
          break
      }

      await content.save()
    }
  } else {
    for (const content of sectionDetail) {
      switch (content.key) {
        case 'TITLE':
          content.value = req.title
          break
      }
      await content.save()
    }

    return req.title
  }

  return ctx.response.ok({ message: 'What Is Next updated successfully' })
}

export async function destroy(ctx: HttpContext) {
  const id = ctx.params.id
  return deleteFn(SectionDetailItem, 'section', id, ctx)
}

export async function show(ctx: HttpContext) {
  const id = ctx.params.id

  const item = await SectionDetailItem.query().where('id', id).preload('contents').firstOrFail()
  const transformed = Object.fromEntries(item.contents.map((c) => [c.key, c]))

  return {
    id: item.id,
    sectionDetailId: item.sectionDetailId,
    sortOrder: item.sortOrder,
    contents: transformed,
  }
}

export async function store(ctx: HttpContext) {
  const req = ctx.request.body()

  const detailItem = await SectionDetailItem.create({
    id: randomUUID(),
    sectionDetailId: req.detail_id,
    sortOrder: req.sort_order,
  })

  const payloadContents = [
    {
      id: randomUUID(),
      sectionDetailItemId: detailItem.id,
      key: 'SUBTITLE',
      type: 'TEXT',
      value: req.subtitle,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: detailItem.id,
      key: 'TITLE',
      type: 'TEXT',
      value: req.title,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: detailItem.id,
      key: 'DESCRIPTION',
      type: 'TEXTAREA',
      value: req.description,
    },
  ]

  await SectionDetailItemContent.createMany(payloadContents)

  return ctx.response.ok({ message: 'What Is Next created successfully' })
}
