// Mock activity feed shown behind the heart icon in the top bar.
// `outside` marks activity from accounts beyond the user's usual circle,
// keeping the diverge theme present even here. Text renders from i18n via
// `notif.item.<kind>` so the whole panel localizes.

export type NoticeKind =
  | 'like-photo'
  | 'like-comment'
  | 'follow'
  | 'comment'
  | 'mention'

export interface Notice {
  id: string
  handle: string
  kind: NoticeKind
  /** Quoted comment text, for `comment` notices (user content, not localized). */
  quote?: string
  timeAgo: string
  type: 'like' | 'follow' | 'comment'
  outside?: boolean
}

export const notifications: Notice[] = [
  { id: 'n1', handle: 'mira.styles', kind: 'like-photo', timeAgo: '12m', type: 'like' },
  { id: 'n2', handle: 'coachreyes', kind: 'follow', timeAgo: '41m', type: 'follow' },
  { id: 'n3', handle: 'yujin_kim', kind: 'comment', quote: 'no way 😭🔥', timeAgo: '1h', type: 'comment' },
  { id: 'n4', handle: 'festivalfolk', kind: 'follow', timeAgo: '2h', type: 'follow', outside: true },
  { id: 'n5', handle: 'quietminds', kind: 'like-comment', timeAgo: '3h', type: 'like' },
  { id: 'n6', handle: 'greengrid', kind: 'mention', timeAgo: '5h', type: 'comment', outside: true },
  { id: 'n7', handle: 'noodle.diaries', kind: 'like-photo', timeAgo: '8h', type: 'like' },
  { id: 'n8', handle: 'riko.o3', kind: 'comment', quote: 'また行こ〜！', timeAgo: '10h', type: 'comment' },
  { id: 'n9', handle: 'daichi.jpg', kind: 'like-photo', timeAgo: '14h', type: 'like' },
]
