import type { HttpContext } from '@adonisjs/core/http'
import { uploadFile } from '#helpers/upload_file'
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
    .where('key', 'NEXT_STEP')
    .firstOrFail()

  const sectionDetail = await SectionDetail.query().where('section_id', section.id)

  if (req.type_data === 'LIST') {
    const id = ctx.params.id
    const item = await SectionDetailItem.findOrFail(id)
    item.sortOrder = req.sort_order
    await item.save()

    const contentMap = await SectionDetailItemContent.query().where('sectionDetailItemId', item.id)

    let backgroundPath = null
    if (req.background) {
      backgroundPath = await uploadFile(req.background, {
        moduleName: 'NEXT_STEP',
        previousPath: req.previous_background,
      })
    }
    for (const content of contentMap) {
      switch (content.key) {
        case 'TITLE':
          content.value = req.title
          break
        case 'SUBTITLE':
          content.value = req.subtitle
          break
        case 'DESCRIPTION':
          content.value = req.description
          break
        case 'BUTTON':
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
  }

  return ctx.response.ok({ message: 'NEXT_STEP updated successfully' })
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

  const nextStepDetailItem = await SectionDetailItem.create({
    id: randomUUID(),
    sectionDetailId: req.detail_id,
    sortOrder: req.sort_order,
  })

  const backgroundPath = await uploadFile(req.background, {
    moduleName: 'NEXT_STEP',
    previousPath: null,
  })

  const payloadContents = [
    {
      id: randomUUID(),
      sectionDetailItemId: nextStepDetailItem.id,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: backgroundPath,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: nextStepDetailItem.id,
      key: 'TITLE',
      type: 'TEXT',
      value: req.title,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: nextStepDetailItem.id,
      key: 'DESCRIPTION',
      type: 'TEXTAREA',
      value: req.description,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: nextStepDetailItem.id,
      key: 'SUBTITLE',
      type: 'TEXTAREA',
      value: req.subtitle,
    },
    {
      id: randomUUID(),
      sectionDetailItemId: nextStepDetailItem.id,
      key: 'BUTTON',
      type: 'BUTTON',
      jsonValue: {
        TITLE: req.button_title,
        SUBTITLE: req.button_subtitle,
        ICON: null,
        LINK: req.button_link,
      },
    },
  ]

  await SectionDetailItemContent.createMany(payloadContents)

  return ctx.response.ok({ message: 'NEXT_STEP created successfully' })
}
