export const SERVICE_PREFIXES = {
  identity: [
    '/auth',
    '/users',
    '/profiles',
    '/school-units',
    '/school-unit-types',
    '/religions',
    '/blood-types',
  ],

  presence: [
    '/presence',
  ],

  academic: [
    '/academic-years',
    '/academic-calendars',
  ],

  hr: [
    '/employees',
    '/employee-positions',
    '/positions',
    '/position-categories',
    '/employment-types',
    '/payroll',
  ],

  student: [
    '/students',
  ],
} as const

export const UNROUTED_PREFIXES: readonly string[] = ['/dashboard', '/settings']

export const HEALTH_ROUTES = [
  { path: '/health/identity', service: 'identity' },
  { path: '/health/presence', service: 'presence' },
  { path: '/health/academic', service: 'academic' },
  { path: '/health/hr', service: 'hr' },
  { path: '/health/student', service: 'student' },
] as const
