import { useEffect, useState } from 'react'

/** useState that is saved in localStorage, so data stays after refresh. */
export function usePersisted<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage full */ } }, [key, v])
  return [v, setV] as const
}

export const uid = () => Math.random().toString(36).slice(2, 10)

/** Read an image file, shrink it (so localStorage doesn't fill up) and return a data URL. */
export function fileToDataUrl(file: File, max = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onerror = () => reject(r.error)
    r.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image'))
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        resolve(c.toDataURL('image/jpeg', 0.82))
      }
      img.src = r.result as string
    }
    r.readAsDataURL(file)
  })
}
