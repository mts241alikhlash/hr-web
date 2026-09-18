import { kioskApi } from '../api/kioskApi'
import type { QueuedScan, ScanResult } from '../types'

const TOKEN_KEY = 'presence_kiosk_device_token'

export interface ScanQueuePort {
  enqueue: (scan: QueuedScan) => Promise<void>
  all: () => Promise<QueuedScan[]>
  acknowledge: (ids: string[]) => Promise<void>
  refreshCount: () => Promise<void>
}

export interface ClockPort {
  anchorId: { value: string | null }
  setAnchor: (anchor: {
    serverTime: string
    anchorId: string
    maxOfflineWindowHours: number
  }) => void
  deriveOccurredAt: () => string | null
}

export const MAX_FLUSH_BATCH_SIZE = 500

export const QUEUED: ScanResult = {
  outcome: 'ACCEPTED',
  direction: 'NONE',
  dayStatus: 'PRESENT',
  lateMinutes: 0,
  recordedAt: '',
}

export const kioskService = {
  readToken: () => localStorage.getItem(TOKEN_KEY),
  saveToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  syncClock: async (token: string, clock: ClockPort): Promise<boolean> => {
    try {
      const res = await kioskApi.getClockAnchor(token)
      if (res.data?.data) {
        clock.setAnchor(res.data.data)
        return true
      }
      return false
    } catch {
      return false
    }
  },

  submit: async (
    token: string,
    code: string,
    clock: ClockPort,
    queue: ScanQueuePort,
  ): Promise<{ result: ScanResult; queued: boolean }> => {
    const scan: QueuedScan = {
      clientEventId: crypto.randomUUID(),
      code,
      occurredAt: null,
      clockAnchorId: null,
    }

    try {
      const res = await kioskApi.scan(token, scan)
      return { result: res.data.data, queued: false }
    } catch {
      await queue.enqueue({
        ...scan,
        occurredAt: clock.deriveOccurredAt(),
        clockAnchorId: clock.anchorId.value,
      })
      return {
        result: { ...QUEUED, recordedAt: new Date().toISOString() },
        queued: true,
      }
    }
  },

  flush: async (
    token: string,
    queue: ScanQueuePort,
  ): Promise<{ sent: number; cleared: number }> => {
    const pending = await queue.all()
    let sent = 0
    let cleared = 0

    for (let from = 0; from < pending.length; from += MAX_FLUSH_BATCH_SIZE) {
      const chunk = pending.slice(from, from + MAX_FLUSH_BATCH_SIZE)

      try {
        const res = await kioskApi.flush(token, chunk)
        const settled = (res.data?.data ?? [])
          .filter((entry) => entry.accepted)
          .map((entry) => entry.clientEventId)

        await queue.acknowledge(settled)
        sent += chunk.length
        cleared += settled.length
      } catch {
        break
      }
    }

    return { sent, cleared }
  },
}
