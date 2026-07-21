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
      className="absolute inset-0 z-40 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="animate-fade-up shadow-soft-lg flex max-h-[75%] w-full flex-col rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <span className="font-display text-sm font-bold tracking-[-0.01em] text-ink">
            Comments{' '}
            <span className="tnum font-medium text-muted">
              ({compact(total)})
            </span>
          </span>
          <button
            onClick={onClose}
            className="p-1 text-lg leading-none text-muted"
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
                <p className="text-sm text-ink">
                  <span className="font-semibold">{c.handle}</span> {c.text}
                </p>
                <p className="mt-0.5 text-[11px] text-faint">{c.timeAgo} ago</p>
              </div>
            </div>
          ))}

          {mine.map((c) => (
            <div key={c.id} className="mb-4 flex items-start gap-2.5">
              <Avatar name="You" dark className="h-8 w-8 text-[10px]" />
              <div className="flex-1 leading-snug">
                <p className="text-sm text-ink">
                  <span className="font-semibold">you</span> {c.text}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-brand">
                  Your comment
                </p>
              </div>
            </div>
          ))}

          {/* The big number vs the few shown — wink at it instead of faking
              hundreds of rows. */}
          <p className="pb-2 pt-1 text-center text-[11px] text-faint">
            + {compact(post.comments)} more from people you may not follow
          </p>
        </div>

        {/* Composer */}
        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-t border-hairline px-3 py-2.5"
        >
          <Avatar name="You" dark className="h-8 w-8 text-[10px]" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            className="min-w-0 flex-1 rounded-md border border-hairline bg-white px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-30"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
