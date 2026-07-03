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
        className="absolute right-5 top-9 border-2 border-black bg-white px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-tight text-black active:translate-x-0.5 active:translate-y-0.5"
      >
        Close
      </button>

      <header className="mb-6 border-b-4 border-black pb-4">
        <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted">
          Reflect
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-none tracking-tighter text-black">
          A moment to
          <br />
          look back
        </h2>
        <p className="mt-3 text-sm text-muted">
          No right answers. This is just for you — nothing is saved.
        </p>
      </header>

      <div className="space-y-5">
        {questions.map((item, i) => (
          <div key={i}>
            <label className="mb-1.5 block font-display text-sm font-bold text-black">
              {String(i + 1).padStart(2, '0')}. {item.q}
            </label>
            <textarea
              value={answers[i]}
              onChange={(e) => update(i, e.target.value)}
              rows={3}
              placeholder={item.placeholder}
              className="w-full resize-none border-2 border-black bg-white p-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-brand focus:shadow-hard-sm"
            />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onDone}
          className="w-full border-2 border-black bg-black py-4 font-display text-base font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Done
        </button>
      </div>
    </div>
  )
}
