import axios from 'axios'
import type {
  BatchScanResult,
  ClockAnchor,
  QueuedScan,
  ScanResult,
} from '../types'

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:3000'
).replace(/\/+$/, '')

const deviceApi = axios.create({ baseURL: API_BASE_URL })

function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const kioskApi = {
  getClockAnchor: (token: string) =>
    deviceApi.get<{ data: ClockAnchor }>('/presence/scans/clock', auth(token)),

  scan: (token: string, payload: QueuedScan) =>
    deviceApi.post<{ data: ScanResult }>(
      '/presence/scans',
      payload,
      auth(token),
    ),

  flush: (token: string, scans: QueuedScan[]) =>
    deviceApi.post<{ data: BatchScanResult[] }>(
      '/presence/scans/batch',
      { scans },
      auth(token),
    ),
}
