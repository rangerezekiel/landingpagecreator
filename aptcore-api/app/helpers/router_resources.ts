import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export function resourceRoutes(path: string, controller: any) {
  router
    .get(`/${path}`, [controller, 'index'])
    .use(middleware.jwtAcl({ permission: `${path}-index` }))

  router
    .post(`/${path}`, [controller, 'store'])
    .use(middleware.jwtAcl({ permission: `${path}-store` }))

  router
    .get(`/${path}/:id`, [controller, 'show'])
    .use(middleware.jwtAcl({ permission: `${path}-show` }))

  router
    .patch(`/${path}/:id`, [controller, 'update'])
    .use(middleware.jwtAcl({ permission: `${path}-update` }))

  router
    .delete(`/${path}/:id`, [controller, 'destroy'])
    .use(middleware.jwtAcl({ permission: `${path}-delete` }))
}
