import type { RouteRecordRaw } from 'vue-router'

export const positionRoutes: RouteRecordRaw[] = [
  {
    path: '/positions',
    name: 'positions',
    component: () => import('./views/PositionView.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'positions.read',
      title: 'Kelola Jabatan',
      breadcrumbs: [
        { title: 'Pengaturan', href: '#' },
        { title: 'Jabatan', href: '/positions' },
      ],
    },
  },
]
