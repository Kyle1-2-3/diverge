import { useState, type FormEvent } from 'react'
import type { Post } from '../types'
import { mockComments } from '../data/comments'
import { useInteractions } from '../state/interactions'
import { compact } from '../lib/format'
import Avatar from './Avatar'

interface CommentsSheetProps {
  post: Post
  onClose: () => void
}

/**
 * Instagram-style bottom sheet: top comments for the post, plus anything the
 * user has written (persisted, so their comments are still there tomorrow).
 */
export default function CommentsSheet({ post, onClose }: CommentsSheetProps) {
  const { comments, addComment } = useInteractions()
  const [text, setText] = useState('')

  const canned = mockComments[post.id] ?? []
  const mine = comments[post.id] ?? []
  const total = post.comments + mine.length

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    addComment(post.id, trimmed)
    setText('')
  }

  return (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="animate-fade-up flex max-h-[75%] w-full flex-col border-t-4 border-black bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-black">
            Comments{' '}
            <span className="font-mono text-muted">({compact(total)})</span>
          </span>
          <button
            onClick={onClose}
            className="p-1 font-mono text-lg font-bold leading-none text-black"
            aria-label="Close comments"
          >
            ✕
          </button>
        </div>

        {/* Comment list */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-3">
          {canned.map((c, i) => (
            <div key={i} className="mb-4 flex items-start gap-2.5">
              <Avatar name={c.handle} className="h-8 w-8 text-[10px]" />
              <div className="flex-1 leading-snug">
                <p className="text-sm text-black">
                  <span className="font-display font-bold">{c.handle}</span>{' '}
                  {c.text}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                  {c.timeAgo} ago
                </p>
              </div>
            </div>
          ))}

          {mine.map((c) => (
            <div key={c.id} className="mb-4 flex items-start gap-2.5">
              <Avatar name="You" dark className="h-8 w-8 text-[10px]" />
              <div className="flex-1 leading-snug">
                <p className="text-sm text-black">
                  <span className="font-display font-bold">you</span> {c.text}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-brand">
                  your comment
                </p>
              </div>
            </div>
          ))}

          {/* The big number vs the few shown — wink at it instead of faking
              hundreds of rows. */}
          <p className="pb-2 pt-1 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
            + {compact(post.comments)} more from people you may not follow
          </p>
        </div>

        {/* Composer */}
        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-t-2 border-black px-3 py-2.5"
        >
          <Avatar name="You" dark className="h-8 w-8 text-[10px]" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            className="min-w-0 flex-1 border-2 border-black bg-white px-3 py-2 font-mono text-xs text-black placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="border-2 border-black bg-black px-3 py-2 font-display text-xs font-bold uppercase tracking-widest text-white disabled:opacity-30"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
