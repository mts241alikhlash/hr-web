import type { AddressSavePayload } from '@/features/platform/address'

export interface EmploymentTypeOption {
  id: string
  code: string
  name: string
}

export interface EmployeeProfile {
  name: string
  nik: string
  gender: 'MALE' | 'FEMALE'
}

export interface EmployeeUser {
  id: string
  identifier: string
  isActive: boolean
  profile: EmployeeProfile | null
}

export interface EmployeePosition {
  id: string
  isPrimary: boolean
  hireDate: string
  position: {
    id: string
    name: string
    category: {
      id: string
      code: string
      name: string
    }
    isActive: boolean
  }
}

export interface Employee {
  id: string
  nip: string | null
  nuptk: string | null
  employmentType: EmploymentTypeOption
  user: EmployeeUser
  positions: EmployeePosition[]
}

export interface EmployeeQueryParams {
  page?: number
  limit?: number
  search?: string
  employmentTypeId?: string
  academicYearId?: string
  positionCategoryId?: string
  isActive?: boolean
}

export interface EmployeeExportParams {
  search?: string
  employmentTypeId?: string
  isActive?: boolean
}

export interface EmployeeSavePayload {
  identifier?: string
  password?: string
  name: string
  nik: string
  gender: 'MALE' | 'FEMALE'
  birthPlace: string
  birthDate: string
  email?: string
  phone?: string
  nip?: string
  nuptk?: string
  employmentTypeId: string
  positionId?: string
}

export interface EmployeeUpdatePayload {
  nip?: string
  nuptk?: string
  employmentTypeId?: string
}

export interface EmployeePositionSavePayload {
  positionId: string
  hireDate: string
  isPrimary?: boolean
}

export interface EmployeePositionInput {
  positionId: string
  hireDate: string
  isPrimary: boolean
}

export interface CreateEmployeeWithRelationsInput {
  core: EmployeeSavePayload
  address?: AddressSavePayload | null
  positions?: EmployeePositionInput[]
}

export interface CreateEmployeeWithRelationsResult {
  success: boolean
  employeeId?: string
  userId?: string
  warnings: string[]
}

export interface EmployeePositionUpdatePayload {
  hireDate?: string
  isPrimary?: boolean
}

export interface EmployeeEditData {
  id?: string
  nip?: string | null
  nuptk?: string | null
  employmentTypeId?: string
  employmentType?: EmploymentTypeOption
  positions?: EmployeePosition[]
  user?: {
    profile?: EmployeeProfile | null
  } | null
}

export interface PositionOption {
  id: string
  name: string
}

export interface PositionEditData {
  id?: string
  positionId?: string
  hireDate?: string
  isPrimary?: boolean
  position?: { id: string; name?: string }
}

export interface PositionCategoryRef {
  id: string
  code: string
  name: string
}

export interface PositionListItem {
  id: string
  name: string
  category: PositionCategoryRef
}

export interface BulkImportEmployeeRow {
  identifier: string
  password: string
  name: string
  nik: string
  gender: string
  birthPlace: string
  birthDate: string
  email?: string
  phone?: string
  nip?: string
  nuptk?: string
  employmentTypeCode: string
}

export interface BulkImportRowResult {
  row: number
  status: 'SUCCESS' | 'FAILED' | 'CONFLICT'
  identifier?: string
  error?: string
  existingId?: string
  data?: BulkImportEmployeeRow
}

export interface BulkImportResult {
  total: number
  success: number
  failed: number
  conflict: number
  results: BulkImportRowResult[]
}

export interface ResolveBulkImportConflict {
  existingId?: string
  action: 'update' | 'skip'
  data: BulkImportEmployeeRow
}

export interface ResolveBulkImportResult {
  total: number
  updated: number
  skipped: number
  failed: number
  errors: { existingId: string; error: string }[]
}

export interface EmployeeColumnActions {
  onView?: (employee: Employee) => void
  onEdit?: (employee: Employee) => void
  onViewDetail?: (employee: Employee) => void
  onDelete?: (
    employee: Employee,
    callbacks: { closeAlert: () => void; setLoading: (s: boolean) => void },
  ) => Promise<void>
  onToggleActive?: (employee: Employee, isActive: boolean) => Promise<void>
  showActions?: boolean
  canUpdate?: boolean
  canDelete?: boolean
}
