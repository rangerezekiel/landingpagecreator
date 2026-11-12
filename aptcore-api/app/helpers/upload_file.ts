import { existsSync, unlinkSync } from 'node:fs'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { HttpContext } from '@adonisjs/core/http'

interface UploadOptions {
  moduleName: string
  previousPath?: string | null
}

export async function uploadFile(
  file: ReturnType<HttpContext['request']['file']>,
  options: UploadOptions
) {
  const { moduleName, previousPath } = options

  // 🧹 Delete old file if exists
  if (previousPath) {
    const fullOldPath = app.makePath(previousPath)
    if (existsSync(fullOldPath)) {
      unlinkSync(fullOldPath)
    }
  }

  if (!file) {
    return false
  }

  // 🆕 Save new file
  const fileName = `${cuid()}.${file.extname}`
  const storagePath = `public/storage/${moduleName}`
  const storagePathInfo = `storage/${moduleName}`
  const fullNewPath = app.makePath(storagePath)

  await file.move(fullNewPath, { name: fileName })

  return `${storagePathInfo}/${fileName}`
}
