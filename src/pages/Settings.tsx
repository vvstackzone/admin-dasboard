import { useEffect, useState } from 'react'
import { PageHead, Field, Upload } from '../ui'
import { usePersisted } from '../store'

export type SettingsData = { site: string; copy: string; seoTitle: string; seoDesc: string; seoKeys: string; logo?: string }
const defaults: SettingsData = { site: 'Bright Web', copy: 'All rights Reserved@brightweb', seoTitle: 'Bright web is a hybrid dashboard', seoDesc: 'Bright web is a hybrid dashboard', seoKeys: 'CSS' }

export default function Settings() {
  const [saved, setSaved] = usePersisted<SettingsData>('ds.settings', defaults)
  const [d, setD] = useState<SettingsData>(saved)
  const [ok, setOk] = useState(false)
  const set = (k: keyof SettingsData) => (e: { target: { value: string } }) => { setD(p => ({ ...p, [k]: e.target.value })); setOk(false) }
  useEffect(() => { if (!ok) return; const t = setTimeout(() => setOk(false), 3000); return () => clearTimeout(t) }, [ok])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(d); setOk(true)
    if (d.seoTitle.trim()) document.title = d.seoTitle.trim()
  }
  return (
    <>
      <PageHead title="General Settings" />
      <form onSubmit={save} className="card mx-auto max-w-5xl p-5 sm:p-10">
        <Upload label="Upload Logo" round img={d.logo} onPick={logo => { setD(p => ({ ...p, logo })); setOk(false) }} />
        <div className="mx-auto mt-6 grid max-w-3xl gap-5 sm:grid-cols-2">
          <Field label="Site Name"><input value={d.site} onChange={set('site')} className="input" /></Field>
          <Field label="Copy Right"><input value={d.copy} onChange={set('copy')} className="input" /></Field>
          <Field label="SEO Title"><input value={d.seoTitle} onChange={set('seoTitle')} className="input" /></Field>
          <div className="sm:row-span-2"><Field label="SEO Description"><textarea rows={5} value={d.seoDesc} onChange={set('seoDesc')} className="input h-auto py-3" /></Field></div>
          <Field label="SEO Keywords"><input value={d.seoKeys} onChange={set('seoKeys')} className="input" /></Field>
        </div>
        <div className="mt-10 text-center">
          <button className="btn-primary w-full max-w-xs">Save</button>
          {ok && <p role="status" className="mt-3 text-sm font-semibold text-emerald-500">Settings saved successfully ✓</p>}
        </div>
      </form>
    </>
  )
}
