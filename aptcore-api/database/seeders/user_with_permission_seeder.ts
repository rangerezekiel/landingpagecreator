import User from '#models/user'
import Website from '#models/website'
import { Role, Permission } from '@holoyan/adonisjs-permissions'
import { Acl } from '@holoyan/adonisjs-permissions'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { createSections, createWebsiteSettings } from '#helpers/sections'

async function createWebsite(createdBy: string) {
  let website = await Website.firstOrCreate(
    { domain: 'localhost:3999' },
    {
      title: 'Tampines St 94 GLS',
      domain: 'localhost:3999',
      theme: 'T02',
      metaTitle: 'Tampines St 94 GLS',
      metaDescription: 'Tampines St 94 GLS Website',
      logo: 'sample_storage/logo.jpg',
      favicon: 'sample_storage/logo.jpg',
      createdBy,
    }
  )

  // create website setting
  await createWebsiteSettings(website.id)
  await createSections(website.id, createdBy)

  // create Website
  website = await Website.firstOrCreate(
    { domain: 'localhost:3000' },
    {
      title: 'Local Website',
      domain: 'localhost:3000',
      theme: 'T01',
      metaTitle: 'Lain St 94 GLS',
      metaDescription: 'Local St 94 GLS Website',
      logo: 'sample_storage/logo.jpg',
      favicon: 'sample_storage/logo.jpg',
      createdBy,
    }
  )

  // create website setting
  await createWebsiteSettings(website.id)
  await createSections(website.id, createdBy)

  return website
}

export default class UserWithPermissionsSeeder extends BaseSeeder {
  public async run() {
    const superdevUser = await User.firstOrCreate(
      { email: 'super@dev.com' },
      {
        username: 'superdev',
        password: 'inipassword',
        fullName: 'Super Developer',
        countryCode: 'ID',
        phoneCode: '62',
        phoneNumber: '81234567890',
        phone: '6281234567890',
      }
    )

    const superadminUser = await User.firstOrCreate(
      { email: 'super@admin.com' },
      {
        username: 'superadmin',
        password: 'inipassword',
        fullName: 'Super Admin',
        countryCode: 'ID',
        phoneCode: '62',
        phoneNumber: '81234567891',
        phone: '6281234567891',
      }
    )

    const website = await createWebsite(superadminUser.id)

    const adminAccount = await User.firstOrCreate(
      { email: 'admin@admin.com' },
      {
        username: 'adminwebsite',
        password: 'inipassword',
        fullName: 'Admin Website',
        countryCode: 'ID',
        phoneCode: '62',
        phoneNumber: '81234567898',
        phone: '6281234567898',
        websiteId: JSON.stringify([website.id]),
      }
    )

    // ROLE
    const superdevRole = await Role.firstOrCreate(
      { slug: 'superdev' },
      { title: 'Super Developer' }
    )

    const superadminRole = await Role.firstOrCreate(
      { slug: 'superadmin' },
      { title: 'Super Admin' }
    )

    const userRole = await Role.firstOrCreate({ slug: 'admin' }, { title: 'Admin' })

    // PERMISSIONS
    const permissionSlugs = [
      'user',
      'role',
      'permission',
      'website',
      'website-setting',
      'form-submission',
      'activity-log',
    ]

    const actions = [
      'index',
      'index-with-trash',
      'index-only-trash',
      'store',
      'show',
      'update',
      'update-restore',
      'delete',
      'delete-permanently',
    ]

    const permissionAdminPrefix = [
      'user',
      'website',
      'website-setting',
      'form-submission',
      'activity-log',
    ]

    const permissionSuperadminPrefix = permissionAdminPrefix.concat(['role', 'permission'])

    let superadminPermissions: string[] = []
    let adminPermissions: string[] = []

    const permissionPromises = permissionSlugs.flatMap((prefixSlug) =>
      actions.map((action) => {
        const slug = `${prefixSlug}-${action}`
        if (permissionSuperadminPrefix.includes(prefixSlug)) {
          superadminPermissions.push(slug)
        }

        if (permissionAdminPrefix.includes(prefixSlug)) {
          adminPermissions.push(slug)
        }

        const title = slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .replace(/\B\w/g, (c) => c.toLowerCase())

        return Permission.firstOrCreate({ slug }, { title })
      })
    )

    const toRemove = ['user-update-restore', 'user-delete-permanently']
    adminPermissions = adminPermissions.filter((p) => !toRemove.includes(p))

    permissionPromises.push(
      Permission.firstOrCreate({ slug: 'role-permissions' }, { title: 'Role Permissions' })
    )

    const allPermissions = await Promise.all(permissionPromises)

    // Assign PERMISSIONS to ROLE
    await Acl.role(superdevRole).giveAll(allPermissions.map((p) => p.slug))
    await Acl.role(superadminRole).giveAll(superadminPermissions)
    await Acl.role(userRole).giveAll(adminPermissions)

    // Assign ROLE to USER
    await Acl.model(superdevUser).assignRole(superdevRole.slug)
    await Acl.model(superadminUser).assignRole(superadminRole.slug)
    await Acl.model(adminAccount).assignRole(userRole.slug)

    console.log(`Seeder success!`)
  }
}
