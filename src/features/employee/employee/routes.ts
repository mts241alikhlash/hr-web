import type { RouteRecordRaw } from 'vue-router'

export const employeeRoutes: RouteRecordRaw[] = [
  {
    path: '/employees',
    name: 'employee',
    component: () => import('./views/EmployeeListView.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'employees.read',
      title: 'Daftar Pegawai',
      breadcrumbs: [
        { title: 'Kepegawaian', href: '#' },
        { title: 'Daftar Pegawai' },
      ],
    },
  },
  {
    path: '/employees/create',
    name: 'employee-create',
    component: () => import('./views/EmployeeCreateView.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'employees.read',
      title: 'Tambah Pegawai',
      breadcrumbs: [
        { title: 'Pegawai', href: '/employees' },
        { title: 'Tambah Pegawai' },
      ],
    },
  },
  {
    path: '/employees/accounts',
    name: 'employee-accounts',
    component: () => import('./views/EmployeeAccountView.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'users.read',
      title: 'Akun Pegawai',
      breadcrumbs: [
        { title: 'Pegawai', href: '/employees' },
        { title: 'Akun Pegawai' },
      ],
    },
  },
]
