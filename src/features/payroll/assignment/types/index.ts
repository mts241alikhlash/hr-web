import type { AttendanceDriver, SalaryComponentType } from '../../component'

export interface SalaryAssignment {
  id: string
  userId: string
  componentId: string
  amount: string | null
  rate: string | null
  effectiveFrom: string
  effectiveTo: string | null
  component: {
    id: string
    code: string
    name: string
    type: SalaryComponentType
    driver: AttendanceDriver | null
  }
  holder: { id: string; displayName: string | null }
}

export interface SalaryAssignmentSavePayload {
  userId: string
  componentId: string
  amount?: string | null
  rate?: string | null
  effectiveFrom: string
}

export interface EmployeeOption {
  userId: string
  name: string
  identifier: string
}
