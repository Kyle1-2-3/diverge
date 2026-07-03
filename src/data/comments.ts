// Mock comments shown in the comments sheet, keyed by post id.
// These render as the "top comments"; anything the user types is appended
// after them (and persisted via the interactions store).

export interface MockComment {
  handle: string
  text: string
  timeAgo: string
}

export const mockComments: Record<string, MockComment[]> = {
  p1: [
    { handle: 'yujin_kim', text: 'the boots?? insane find 😭', timeAgo: '31m' },
    { handle: 'trendradar', text: 'thrift hauls > everything', timeAgo: '25m' },
    { handle: 'noodle.diaries', text: 'ok but WHERE do you thrift', timeAgo: '12m' },
  ],
  p2: [
    { handle: 'mira.styles', text: 'this is why i went secondhand-only this year', timeAgo: '52m' },
    { handle: 'greengrid', text: 'the numbers are even worse for fast fashion returns btw', timeAgo: '40m' },
  ],
  p3: [
    { handle: 'futurelab', text: 'rotterdam has been quietly ahead on this for a decade', timeAgo: '1h' },
    { handle: 'ecofutures', text: 'adaptation stories >> doom stories', timeAgo: '1h' },
  ],
  p4: [
    { handle: 'kai.runs', text: 'HEART > BUDGET. framing this', timeAgo: '2h' },
    { handle: 'yujin_kim', text: 'crying at the last photo 🥹', timeAgo: '2h' },
    { handle: 'dailyglobe', text: 'someone make a documentary about them please', timeAgo: '1h' },
  ],
  p5: [
    { handle: 'mira.styles', text: 'needed this today, thank you 🫶', timeAgo: '3h' },
    { handle: 'coachreyes', text: 'rest days build champions. facts.', timeAgo: '3h' },
  ],
  p6: [
    { handle: 'quietminds', text: 'hard disagree — stepping away IS better tech use', timeAgo: '4h' },
    { handle: 'futurelab', text: 'both can be true. tools should earn your time', timeAgo: '4h' },
    { handle: 'mira.styles', text: 'never thought about it this way tbh', timeAgo: '3h' },
  ],
  p7: [
    { handle: 'theotherview', text: 'transparency should be the default, not a feature', timeAgo: '5h' },
    { handle: 'dailyglobe', text: 'link to the repo?', timeAgo: '5h' },
  ],
  p8: [
    { handle: 'noodle.diaries', text: 'the costumes are UNREAL', timeAgo: '7h' },
    { handle: 'mira.styles', text: 'adding oaxaca to the list immediately', timeAgo: '6h' },
  ],
  p9: [
    { handle: 'mira.styles', text: 'called it in march 😌', timeAgo: '9h' },
    { handle: 'yujin_kim', text: 'my closet is ready', timeAgo: '9h' },
  ],
  p10: [
    { handle: 'ecofutures', text: 'community-owned is the key part of this story', timeAgo: '11h' },
    { handle: 'futurelab', text: 'the voting system is such a smart design', timeAgo: '10h' },
  ],
  p11: [
    { handle: 'kai.runs', text: 'day 7 and still not tired of this series', timeAgo: '13h' },
    { handle: 'festivalfolk', text: 'the $2 bowl at the night market. trust.', timeAgo: '12h' },
  ],
  p12: [
    { handle: 'coachreyes', text: 'this is the motivation i needed', timeAgo: '22h' },
    { handle: 'quietminds', text: 'nature therapy is real', timeAgo: '20h' },
  ],
}
