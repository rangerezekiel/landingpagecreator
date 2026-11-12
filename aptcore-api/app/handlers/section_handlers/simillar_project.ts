import type { HttpContext } from '@adonisjs/core/http'
import Website from '#models/website'
import SectionDetail from '#models/section_detail'
import SectionDetailItem from '#models/section_detail_item'
import SectionDetailItemContent from '#models/section_detail_item_content'
import Section from '#models/section'
import { deleteFn } from '#helpers/crud'
import { uploadFile } from '#helpers/upload_file'
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
    .where('key', 'SIMILLAR_PROJECT')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)

  if (req.type_data === 'PROJECTS') {
    const id = ctx.params.id
    const item = await SectionDetailItem.findOrFail(id)
    item.sortOrder = req.sort_order
    await item.save()

    const contentMap = await SectionDetailItemContent.query().where('sectionDetailItemId', item.id)

    let backgroundPath = null
    if (req.background) {
      backgroundPath = await uploadFile(req.background, {
        moduleName: 'SIMILLAR_PROJECT',
        previousPath: req.previous_background,
      })
    }

    for (const content of contentMap) {
      switch (content.key) {
        case 'TITLE':
          content.value = req.title
          break
        case 'WEBSITE_LINK':
          content.value = req.website_link
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
  } else {
    for (const content of sectionDetail) {
      switch (content.key) {
        case 'TITLE':
          content.value = req.title
          break
        case 'DESCRIPTION':
          content.value = req.description
          break
      }
      await content.save()
    }

    return req.title
  }

  return ctx.response.ok({ message: 'Similar Project updated successfully' })
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

  let backgroundPath = null
  if (req.background) {
    backgroundPath = await uploadFile(req.background, {
      moduleName: 'SIMILLAR_PROJECT',
      previousPath: req.previous_background,
    })
  }

  const payloadContents = [
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
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: backgroundPath,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: detailItem.id,
      key: 'WEBSITE_LINK',
      type: 'TEXT',
      value: req.website_link,
    },
  ]

  await SectionDetailItemContent.createMany(payloadContents)

  return ctx.response.ok({ message: 'Similar Project created successfully' })
}
