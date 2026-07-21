import { useState } from 'react'

interface ReflectionScreenProps {
  onDone: () => void
}

const questions = [
  { q: 'What surprised you today?', placeholder: 'Something you didn’t expect…' },
  {
    q: 'Did you see a perspective you normally wouldn’t?',
    placeholder: 'A view that wasn’t yours…',
  },
  {
    q: 'Did this feel different from your usual feed?',
    placeholder: 'Be honest — it’s just for you…',
  },
]

/**
 * A calm reflection moment, BeReal-style. Shown as a full overlay. Answers live
 * only in local state — nothing is saved or sent, which is intentional.
 */
export default function ReflectionScreen({ onDone }: ReflectionScreenProps) {
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const update = (i: number, v: string) =>
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? v : a)))

  return (
    <div className="animate-fade-up absolute inset-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pb-8 pt-12">
      <button
        onClick={onDone}
        className="absolute right-5 top-9 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
      >
        Close
      </button>

      <header className="mb-6">
        <p className="text-xs font-medium text-faint">Reflect</p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-ink">
          A moment to
          <br />
          look back
        </h2>
        <p className="mt-3 text-sm text-muted">
          No right answers — nothing is saved.
        </p>
      </header>

      <div className="space-y-5">
        {questions.map((item, i) => (
          <div key={i}>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              <span className="tnum mr-1.5 text-faint">{i + 1}.</span>
              {item.q}
            </label>
            <textarea
              value={answers[i]}
              onChange={(e) => update(i, e.target.value)}
              rows={3}
              placeholder={item.placeholder}
              className="w-full resize-none rounded-md border border-hairline bg-white p-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-brand"
            />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onDone}
          className="w-full rounded-full bg-brand py-4 font-display text-base font-semibold text-white transition-transform active:scale-[0.97]"
        >
          Done
        </button>
      </div>
    </div>
  )
}
