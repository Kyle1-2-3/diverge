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
    <div className="animate-fade-up absolute inset-0 z-40 flex flex-col overflow-y-auto bg-gradient-to-b from-violet-50 via-white to-white px-6 pb-8 pt-14">
      <button
        onClick={onDone}
        className="absolute right-5 top-6 text-sm font-medium text-muted active:text-ink"
      >
        Close
      </button>

      <header className="mb-6">
        <span className="text-3xl">🪞</span>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">
          A moment to look back
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          No right answers. This is just for you.
        </p>
      </header>

      <div className="space-y-5">
        {questions.map((item, i) => (
          <div key={i}>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              {item.q}
            </label>
            <textarea
              value={answers[i]}
              onChange={(e) => update(i, e.target.value)}
              rows={3}
              placeholder={item.placeholder}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-3 text-sm text-ink outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
            />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onDone}
          className="w-full rounded-2xl bg-ink py-4 text-base font-bold text-white transition-transform active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  )
}
