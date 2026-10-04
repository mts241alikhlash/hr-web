import { ref } from 'vue'
import type { QueuedScan } from '../types'

const DB_NAME = 'presence-kiosk'
const DB_VERSION = 1
const STORE = 'pending-scans'

export function useScanQueue() {
  const pendingCount = ref(0)
  let db: IDBDatabase | null = null

  function open(): Promise<IDBDatabase> {
    if (db) return Promise.resolve(db)

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result
        if (!database.objectStoreNames.contains(STORE)) {
          database.createObjectStore(STORE, { keyPath: 'clientEventId' })
        }
      }
      request.onsuccess = () => {
        db = request.result
        resolve(db)
      }
      request.onerror = () =>
        reject(new Error('Tidak dapat membuka antrean lokal'))
    })
  }

  function transact<T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    return open().then(
      (database) =>
        new Promise<T>((resolve, reject) => {
          const request = run(
            database.transaction(STORE, mode).objectStore(STORE),
          )
          request.onsuccess = () => resolve(request.result)
          request.onerror = () =>
            reject(new Error('Antrean lokal gagal diakses'))
        }),
    )
  }

  async function enqueue(scan: QueuedScan): Promise<void> {
    await transact('readwrite', (store) => store.put(scan))
    await refreshCount()
  }

  async function all(): Promise<QueuedScan[]> {
    return transact<QueuedScan[]>(
      'readonly',
      (store) => store.getAll() as IDBRequest<QueuedScan[]>,
    )
  }

  async function acknowledge(clientEventIds: string[]): Promise<void> {
    for (const id of clientEventIds) {
      await transact('readwrite', (store) => store.delete(id))
    }
    await refreshCount()
  }

  async function refreshCount(): Promise<void> {
    pendingCount.value = await transact<number>('readonly', (store) =>
      store.count(),
    )
  }

  return { pendingCount, enqueue, all, acknowledge, refreshCount }
}
