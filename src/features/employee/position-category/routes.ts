import type { RouteRecordRaw } from 'vue-router'

export const positionCategoryRoutes: RouteRecordRaw[] = [
  {
    path: '/position-categories',
    name: 'PositionCategoryList',
    component: () => import('./views/PositionCategoryListView.vue'),
    meta: {
      title: 'Kategori Jabatan',
      requiresAuth: true,
      requiredPermission: 'positions.read',
      breadcrumbs: [
        { title: 'Pengaturan', href: '#' },
        { title: 'Kategori Jabatan', href: '/position-categories' },
      ],
    },
  },
]
