import { kioskApi } from '../api/kioskApi'
import type { QueuedScan, ScanResult } from '../types'

const LEGACY_TOKEN_KEY = 'presence_kiosk_device_token'
const PAIRED_KEY = 'presence_kiosk_paired'

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
  isPaired: () =>
    localStorage.getItem(PAIRED_KEY) === '1' ||
    localStorage.getItem(LEGACY_TOKEN_KEY) !== null,

  pair: async (token: string): Promise<boolean> => {
    try {
      await kioskApi.pair(token)
      localStorage.setItem(PAIRED_KEY, '1')
      return true
    } catch {
      return false
    }
  },

  migrateLegacyToken: async (): Promise<void> => {
    const legacy = localStorage.getItem(LEGACY_TOKEN_KEY)
    if (legacy && (await kioskService.pair(legacy))) {
      localStorage.removeItem(LEGACY_TOKEN_KEY)
    }
  },

  syncClock: async (clock: ClockPort): Promise<boolean> => {
    try {
      const res = await kioskApi.getClockAnchor()
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
      const res = await kioskApi.scan(scan)
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
    queue: ScanQueuePort,
  ): Promise<{ sent: number; cleared: number }> => {
    const pending = await queue.all()
    let sent = 0
    let cleared = 0

    for (let from = 0; from < pending.length; from += MAX_FLUSH_BATCH_SIZE) {
      const chunk = pending.slice(from, from + MAX_FLUSH_BATCH_SIZE)

      try {
        const res = await kioskApi.flush(chunk)
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
