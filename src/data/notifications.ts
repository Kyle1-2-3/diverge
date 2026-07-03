// Mock activity feed shown behind the heart icon in the top bar.
// `outside` marks activity from accounts beyond the user's usual circle,
// keeping the diverge theme present even here.

export interface Notice {
  id: string
  handle: string
  text: string
  timeAgo: string
  type: 'like' | 'follow' | 'comment'
  outside?: boolean
}

export const notifications: Notice[] = [
  { id: 'n1', handle: 'mira.styles', text: 'liked your photo', timeAgo: '12m', type: 'like' },
  { id: 'n2', handle: 'coachreyes', text: 'started following you', timeAgo: '41m', type: 'follow' },
  { id: 'n3', handle: 'yujin_kim', text: 'commented: “no way 😭🔥”', timeAgo: '1h', type: 'comment' },
  { id: 'n4', handle: 'festivalfolk', text: 'started following you', timeAgo: '2h', type: 'follow', outside: true },
  { id: 'n5', handle: 'quietminds', text: 'liked your comment', timeAgo: '3h', type: 'like' },
  { id: 'n6', handle: 'greengrid', text: 'mentioned you in a comment', timeAgo: '5h', type: 'comment', outside: true },
  { id: 'n7', handle: 'noodle.diaries', text: 'liked your photo', timeAgo: '8h', type: 'like' },
]
