import { PageHead } from '../ui'

const plans = [
  { name: 'Basic', price: '$14.99', features: ['Free Setup', 'Bandwidth Limit 10 GB', '20 User Connection', 'Analytics Report', 'Public API Access', 'Plugins Integration', 'Custom Content Management'], on: 3 },
  { name: 'Standard', price: '$49.99', features: ['Free Setup', 'Bandwidth Limit 10 GB', '20 User Connection', 'Analytics Report', 'Public API Access', 'Plugins Integration', 'Custom Content Management'], on: 5 },
  { name: 'Premium', price: '$89.99', features: ['Free Setup', 'Bandwidth Limit 10 GB', '20 User Connection', 'Analytics Report', 'Public API Access', 'Plugins Integration', 'Custom Content Management'], on: 7, hot: true },
]
export default function Pricing() {
  return (
    <>
      <PageHead title="Pricing" />
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map(p => (
          <div key={p.name} className="card flex flex-col items-center p-8 text-center">
            <h3 className="text-xl font-bold">{p.name}</h3><p className="mt-1 text-sm muted">Monthly Charge</p>
            <p className="my-4 text-4xl font-extrabold text-primary">{p.price}</p>
            <div className="my-2 w-full border-t border-line dark:border-line-dark" />
            <ul className="my-5 space-y-5 font-semibold">{p.features.map((f, i) => <li key={f} className={i < p.on ? '' : 'muted opacity-50'}>{f}</li>)}</ul>
            <button className={`mt-4 w-40 rounded-full border-2 border-primary py-2.5 text-sm font-bold ${p.hot ? 'bg-primary text-white' : 'text-primary'}`}>Get Started</button>
            <a className="mt-4 text-sm font-bold">Start Your 30 Day Free Trial</a>
          </div>
        ))}
      </div>
    </>
  )
}
