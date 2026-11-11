import { useCallback, useEffect, useRef, useState } from 'react'

import seed from '../db.json'

/**
 * Where the data lives:
 *  1. VITE_API_URL set (e.g. a json-server deployed on Render)  -> that server
 *  2. `npm run dev` on your computer                            -> json-server on the same host, port 3001
 *  3. Production build with no VITE_API_URL (e.g. plain Vercel) -> "browser mode": data starts from
 *     db.json and is saved in this browser's localStorage. Works with no server, but is NOT shared
 *     between devices/browsers.
 */
const ENV_URL = import.meta.env.VITE_API_URL as string | undefined
export const API_URL: string | null = ENV_URL || (import.meta.env.DEV ? `http://${window.location.hostname}:3001` : null)
export const BROWSER_MODE = API_URL === null

type Row = { id: number }
const KEY = (r: string) => `ds.data.${r}`

const store = {
  read(resource: string): Row[] {
    try {
      const raw = localStorage.getItem(KEY(resource))
      if (raw) return JSON.parse(raw) as Row[]
    } catch { /* fall through to seed */ }
    const initial = (seed as Record<string, Row[]>)[resource]
    if (!initial) throw new Error(`Unknown data "${resource}"`)
    return structuredClone(initial)
  },
  write(resource: string, rows: Row[]) {
    try { localStorage.setItem(KEY(resource), JSON.stringify(rows)) }
    catch { throw new Error('Browser storage is full. Try a smaller image or delete some items.') }
  },
}

const local = {
  list: async <T,>(r: string) => store.read(r) as unknown as T[],
  get: async <T,>(r: string, id: number) => {
    const row = store.read(r).find(x => x.id === id)
    if (!row) throw new Error('Not found')
    return row as unknown as T
  },
  create: async <T,>(r: string, body: Omit<T, 'id'>) => {
    const rows = store.read(r)
    const row = { ...body, id: rows.reduce((m, x) => Math.max(m, x.id), 0) + 1 } as unknown as Row
    store.write(r, [...rows, row]); return row as unknown as T
  },
  update: async <T,>(r: string, id: number, patch: Partial<T>) => {
    const rows = store.read(r)
    const i = rows.findIndex(x => x.id === id)
    if (i < 0) throw new Error('Not found')
    rows[i] = { ...rows[i], ...patch } as Row
    store.write(r, rows); return rows[i] as unknown as T
  },
  remove: async (r: string, id: number) => store.write(r, store.read(r).filter(x => x.id !== id)),
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Start it with: npm run server`)
  }
  if (res.status === 404 && path.split('/').length === 2)
    throw new Error(`The API has no "${path.slice(1)}" data yet. Add it to db.json (use the db.json from the latest zip) and restart the API: npm run server`)
  if (!res.ok) throw new Error(`Request failed (${res.status} ${res.statusText})`)
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T)
}

const remote = {
  list: <T,>(resource: string) => request<T[]>(`/${resource}`),
  get: <T,>(resource: string, id: number) => request<T>(`/${resource}/${id}`),
  create: <T,>(resource: string, body: Omit<T, 'id'>) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
  update: <T,>(resource: string, id: number, patch: Partial<T>) =>
    request<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: (resource: string, id: number) => request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
}

export const api = BROWSER_MODE ? local : remote

type WithId = { id: number }

/**
 * Loads a json-server collection and gives you add / update / remove helpers.
 * Every helper waits for the server, then updates the list, so the UI always
 * matches what is really saved in db.json.
 */
export function useResource<T extends WithId>(resource: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const alive = useRef(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.list<T>(resource)
      if (alive.current) { setItems(data); setError(null) }
    } catch (e) {
      if (alive.current) setError((e as Error).message)
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [resource])

  useEffect(() => {
    alive.current = true
    reload()
    return () => { alive.current = false }
  }, [reload])

  const add = async (body: Omit<T, 'id'>) => {
    const created = await api.create<T>(resource, body)
    if (alive.current) setItems(l => [...l, created])
    return created
  }

  const update = async (id: number, patch: Partial<T>) => {
    const saved = await api.update<T>(resource, id, patch)
    if (alive.current) setItems(l => l.map(x => (x.id === id ? saved : x)))
    return saved
  }

  /** Optimistic version: the UI changes instantly and rolls back if the save fails. */
  const updateOptimistic = async (id: number, patch: Partial<T>) => {
    const before = items
    setItems(l => l.map(x => (x.id === id ? { ...x, ...patch } : x)))
    try {
      await api.update<T>(resource, id, patch)
    } catch (e) {
      if (alive.current) { setItems(before); setError((e as Error).message) }
    }
  }

  const remove = async (id: number) => {
    await api.remove(resource, id)
    if (alive.current) setItems(l => l.filter(x => x.id !== id))
  }

  return { items, loading, error, reload, add, update, updateOptimistic, remove }
}

/** Red banner shown when the API can't be reached. */
export const ApiError = ({ message, onRetry }: { message: string | null; onRetry?: () => void }) =>
  message ? (
    <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10">
      <span>{message}</span>
      {onRetry && <button onClick={onRetry} className="font-bold underline">Retry</button>}
    </div>
  ) : null
