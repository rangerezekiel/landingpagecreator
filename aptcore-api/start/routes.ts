/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { resourceRoutes } from '#helpers/router_resources'
const RolesController = () => import('#controllers/roles_controller')
import PermissionsController from '#controllers/permissions_controller'
const UsersController = () => import('#controllers/users_controller')
const WebsitesController = () => import('#controllers/websites_controller')
const WebsiteSettingsController = () => import('#controllers/website_settings_controller')
const SectionController = () => import('#controllers/section_controller')
const AuthController = () => import('#controllers/auth_controller')
const FormSubmissionsController = () => import('#controllers/form_submissions_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ActivityLogController = () => import('#controllers/activity_logs_controller')

router.get('/', async () => {
  return {
    hello: 'adostart 🔥',
  }
})

const apiRoutes = () => {
  // AUTH START
  router
    .group(() => {
      router.post('/login', [AuthController, 'login'])
      router.get('/me', [AuthController, 'me']).middleware([middleware.jwtAcl()])
    })
    .prefix('auth')
  // AUTH END

  const routeResources = [
    ['user', UsersController],
    ['role', RolesController],
    ['permission', PermissionsController],
    ['website', WebsitesController],
    ['website-setting', WebsiteSettingsController],
  ] as const

  router
    .group(() => {
      router.group(() => {
        routeResources.forEach(([path, controller]) => {
          resourceRoutes(path, controller)
        })

        // PERMISSIONS START
        router
          .patch('/role/:id/permissions', [RolesController, 'rolePermissions'])
          .middleware([middleware.jwtAcl({ permission: `role-permissions` })])
        router
          .get('/role/:id/permissions', [RolesController, 'getRolePermissions'])
          .middleware([middleware.jwtAcl({ permission: `role-permissions` })])
        router.get('/role-permissions', [RolesController, 'getAllRolesWithPermissions'])
        // PERMISSIONS END

        // DASHBOARD START
        router.get('/dashboard', [DashboardController, 'index'])
        // DASHBOARD END

        // WEBSITE START
        router.get('/website/:domain/domain', [WebsitesController, 'domain'])
        // WEBSITE END

        // WEB SETTINGS START
        router
          .group(() => {
            router.patch('/', [WebsiteSettingsController, 'keysUpdate'])
          })
          .prefix('website-setting/:domain/keys')
        // WEB SETTINGS END

        // SECTION START
        router.get('section/:domain', [SectionController, 'listIndex'])
        router.patch('section/:domain/:section/active', [SectionController, 'activeSection'])
        router
          .group(() => {
            router.get(':id', [SectionController, 'show'])
            router.post('/', [SectionController, 'store'])
            router.patch(':id', [SectionController, 'update'])
            router.delete(':id', [SectionController, 'delete'])
          })
          .prefix('section/:domain/:section')
        // SECTION END

        // FORM SUBMISSION START
        router
          .group(() => {
            router.get('/', [FormSubmissionsController, 'index'])
            router.get(':id', [FormSubmissionsController, 'show'])
            router.patch(':id', [FormSubmissionsController, 'update'])
            router.delete(':id', [FormSubmissionsController, 'destroy'])
          })
          .prefix('form-submission')
        // FORM SUBMISSION END

        // ACTIVITY LOG START
        router
          .group(() => {
            router.get('/', [ActivityLogController, 'index'])
            router.post('/', [ActivityLogController, 'store'])
            router.get(':id', [ActivityLogController, 'show'])
            router.delete(':id', [ActivityLogController, 'destroy'])
          })
          .prefix('activity-log')
        // ACTIVITY LOG END
      })
    })
    .middleware([middleware.jwtAcl()])
  // GET stays public: the landing page renders section content for visitors.
  // Secret detail keys are stripped for unauthenticated readers in the
  // controller. PATCH writes content, so it requires a signed-in user.
  router
    .group(() => {
      router.get('/', [SectionController, 'index'])
    })
    .prefix('section/:domain/:section')
  router
    .group(() => {
      router.patch('/', [SectionController, 'update'])
    })
    .prefix('section/:domain/:section')
    .middleware([middleware.jwtAcl()])
  router
    .group(() => {
      router.get('/', [WebsiteSettingsController, 'keys'])
    })
    .prefix('website-setting/:domain/keys')
  // WEB SETTINGS END

  router.post('/form-submission', [FormSubmissionsController, 'store'])
  router.get('/web/:domain', [WebsitesController, 'showDomain'])

  // ACTIVITY LOG START
  router
    .group(() => {
      router.post('/', [ActivityLogController, 'storeLogin'])
    })
    .prefix('activity-log-login')
  // ACTIVITY LOG END
}

router.group(apiRoutes).middleware([middleware.apiKey()])

// Autoswagger
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

if (process.env.NODE_ENV !== 'production') {
  router.get('/swagger', async () => {
    return AutoSwagger.default.docs(router.toJSON(), swagger)
  })

  router.get('/docs', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
  })
}
