import type { HttpContext } from '@adonisjs/core/http'
import SectionDetailItem from '#models/section_detail_item'
import SectionDetailItemContent from '#models/section_detail_item_content'
import { uploadFile } from '#helpers/upload_file'
import { deleteFn } from '#helpers/crud'
import { randomUUID } from 'node:crypto'

export async function store(ctx: HttpContext) {
  const req = ctx.request.body()

  const detailItem = await SectionDetailItem.create({
    id: randomUUID(),
    sectionDetailId: req.detail_id,
    sortOrder: req.sort_order,
  })

  const backgroundPath = await uploadFile(req.background, {
    moduleName: 'BANNER',
    previousPath: null,
  })

  const payloadContents = [
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
    {
      id: randomUUID(),
      sectionDetailItemId: detailItem.id,
      key: 'BUTTON',
      type: 'BUTTON',
      jsonValue: {
        TITLE: req.button_title,
        SUBTITLE: null,
        ICON: null,
        LINK: req.button_link,
      },
    },
  ]

  await SectionDetailItemContent.createMany(payloadContents)

  return ctx.response.ok({ message: 'Banner created successfully' })
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

export async function update(ctx: HttpContext) {
  const req = ctx.request.body()
  const id = ctx.params.id

  const item = await SectionDetailItem.findOrFail(id)

  item.sortOrder = req.sort_order
  await item.save()

  let backgroundPath = null
  if (req.background) {
    backgroundPath = await uploadFile(req.background, {
      moduleName: 'BANNER',
      previousPath: req.previous_background,
    })
  }

  const contentMap = await SectionDetailItemContent.query().where('sectionDetailItemId', item.id)

  for (const content of contentMap) {
    switch (content.key) {
      case 'TITLE':
        content.value = req.title
        break
      case 'DESCRIPTION':
        content.value = req.description
        break
      case 'BUTTON':
        content.jsonValue = JSON.stringify({
          TITLE: req.button_title,
          SUBTITLE: null,
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

  return ctx.response.ok({ message: 'Banner updated successfully' })
}
