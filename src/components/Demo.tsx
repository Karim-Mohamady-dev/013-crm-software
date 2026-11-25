import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Plus } from '@phosphor-icons/react'
import type { TArrFn, TFn } from '../App.tsx'

type Deal = { id: number; name: string; company: string; value: number; stage: number }

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function num(v: unknown): number {
  return typeof v === 'number' ? v : 0
}

export default function Demo({ t, ta }: { t: TFn; ta: TArrFn }) {
  const stages = ta('demo.stages').map((s) => str(s.name))
  const [deals, setDeals] = useState<Deal[]>(() =>
    ta('demo.deals').map((d, i) => ({
      id: i + 1,
      name: str(d.name),
      company: str(d.company),
      value: num(d.value),
      stage: num(d.stage),
    })),
  )
  const [filter, setFilter] = useState(-1)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [nextId, setNextId] = useState(100)

  const visible = filter === -1 ? deals : deals.filter((d) => d.stage === filter)
  const total = useMemo(() => deals.reduce((sum, d) => sum + d.value, 0), [deals])
  const won = deals.filter((d) => d.stage === stages.length - 1).length

  const advance = (id: number) => {
    setDeals((prev) => prev.map((d) => (d.id === id && d.stage < stages.length - 1 ? { ...d, stage: d.stage + 1 } : d)))
  }

  const addLead = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2 || company.trim().length < 2) {
      setError(t('demo.error'))
      return
    }
    setError('')
    setDeals((prev) => [...prev, { id: nextId, name: name.trim(), company: company.trim(), value: 4370.5, stage: 0 }])
    setNextId(nextId + 1)
    setName('')
    setCompany('')
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="title-2">{t('demo.boardTitle')}</p>
        <p className="caption-2 text-muted">
          {t('demo.totalLabel')} ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} · {won} {t('demo.wonLabel')}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(-1)}
          aria-pressed={filter === -1}
          className={`button-sm rounded-xl px-3 py-2 transition-colors duration-300 ${filter === -1 ? 'bg-accent text-white' : 'border border-line bg-paper'}`}
        >
          {t('demo.allStages')}
        </button>
        {stages.map((stage, i) => (
          <button
            type="button"
            key={stage}
            onClick={() => setFilter(i)}
            aria-pressed={filter === i}
            className={`button-sm rounded-xl px-3 py-2 transition-colors duration-300 ${filter === i ? 'bg-accent text-white' : 'border border-line bg-paper'}`}
          >
            {stage}
          </button>
        ))}
      </div>

      <form onSubmit={addLead} className="mt-4 flex flex-col gap-2 sm:flex-row" noValidate>
        <label htmlFor="lead-name" className="sr-only">
          {t('demo.namePlaceholder')}
        </label>
        <input
          id="lead-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('demo.namePlaceholder')}
          className="body-3 flex-1 rounded-xl border border-line bg-paper px-3 py-2 placeholder:text-muted"
        />
        <label htmlFor="lead-company" className="sr-only">
          {t('demo.companyPlaceholder')}
        </label>
        <input
          id="lead-company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={t('demo.companyPlaceholder')}
          className="body-3 flex-1 rounded-xl border border-line bg-paper px-3 py-2 placeholder:text-muted"
        />
        <button type="submit" className="button-md inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-white transition-opacity duration-300 hover:opacity-90">
          <Plus size={16} />
          {t('demo.addButton')}
        </button>
      </form>
      {error && (
        <p role="alert" className="caption-2 mt-2 text-red-600">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="body-3 mt-8 rounded-xl border border-dashed border-line p-8 text-center text-muted">{t('demo.empty')}</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((deal) => (
            <li key={deal.id} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="title-3">{deal.name}</p>
                  <p className="caption-2 text-muted">{deal.company}</p>
                </div>
                <span className="caption-4 shrink-0 rounded-full bg-accent/10 px-3 py-2 text-accent">{stages[deal.stage]}</span>
              </div>
              <p className="title-2 mt-4">${deal.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              <button
                type="button"
                onClick={() => advance(deal.id)}
                disabled={deal.stage >= stages.length - 1}
                className="button-sm mt-4 inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 transition-colors duration-300 hover:border-accent disabled:opacity-30"
              >
                {deal.stage >= stages.length - 1 ? t('demo.won') : t('demo.advance')}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="caption-5 mt-4 text-muted">{t('demo.note')}</p>
    </div>
  )
}
