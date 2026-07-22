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
  p14: [
    { handle: 'yujin_kim', text: 'WE SURVIVED 🎉', timeAgo: '18m' },
    { handle: 'leo.kicks', text: 'why wasn’t i invited 😐', timeAgo: '15m' },
    { handle: 'sana.days', text: '@leo.kicks you had practice!!', timeAgo: '12m' },
  ],
  p15: [
    { handle: 'daichi.jpg', text: 'one good ball is one more than last week', timeAgo: '50m' },
    { handle: 'sana.days', text: 'lmaooo the (1)', timeAgo: '40m' },
  ],
  p16: [
    { handle: 'mei.mochi', text: 'cats and routers, name a better duo', timeAgo: '2h' },
    { handle: 'yujin_kim', text: 'tax: more mochi pics please', timeAgo: '1h' },
  ],
  p34: [
    { handle: 'sana.days', text: 'and all 47 are blurry 😭', timeAgo: '30m' },
    { handle: 'marcus.wav', text: 'the karaoke lore continues', timeAgo: '22m' },
    { handle: 'yujin_kim', text: 'they’re artistic actually', timeAgo: '15m' },
  ],
  p35: [
    { handle: 'riko.o3', text: 'that’s the best way to order tbh', timeAgo: '1h' },
    { handle: 'tomo.eats', text: 'point-at-the-menu gang', timeAgo: '1h' },
  ],
  p36: [
    { handle: 'yuki.pics', text: '🥹🥹🥹', timeAgo: '3h' },
    { handle: 'hana.notes', text: 'no caption needed. perfect post', timeAgo: '2h' },
  ],
  p37: [
    { handle: 'yujin_kim', text: 'the whiteboard says it all', timeAgo: '2h' },
    { handle: 'sana.days', text: 'group projects build character apparently', timeAgo: '2h' },
  ],
  p40: [
    { handle: 'yujin_kim', text: 'slide 3 is my new lockscreen', timeAgo: '4h' },
    { handle: 'mei.mochi', text: 'yesterday was so fun 🥹', timeAgo: '3h' },
  ],
  p41: [
    { handle: 'daichi.jpg', text: 'わかる', timeAgo: '1h' },
    { handle: 'tomo.eats', text: 'this is a universal truth', timeAgo: '1h' },
  ],
  p44: [
    { handle: 'mei.mochi', text: 'the box never stood a chance', timeAgo: '20h' },
    { handle: 'nakamura_shun', text: 'いい表情', timeAgo: '18h' },
    { handle: 'sana.days', text: 'mochi content is why i open this app', timeAgo: '12h' },
  ],
  p45: [
    { handle: 'aki.shoots', text: '光がきれい', timeAgo: '8h' },
    { handle: 'yuki.pics', text: 'he owns that street and he knows it', timeAgo: '7h' },
  ],
  p46: [
    { handle: 'midnight.oven', text: 'a fallen soufflé is just a confident pancake', timeAgo: '1d' },
    { handle: 'hana.notes', text: 'still eating it tho right', timeAgo: '1d' },
    { handle: 'tomo.eats', text: '@hana.notes obviously', timeAgo: '1d' },
  ],
  p51: [
    { handle: 'kai.runs', text: 'attempt 37 hits different', timeAgo: '2d' },
    { handle: 'groovlab', text: 'the clean landing?? insane', timeAgo: '2d' },
  ],
  p53: [
    { handle: 'tomo.eats', text: '3am is when the best bread happens', timeAgo: '10h' },
    { handle: 'grandpa.garden', text: 'would trade a tomato for a slice', timeAgo: '9h' },
  ],
  p55: [
    { handle: 'fridaynightfc', text: 'watched this 9 times', timeAgo: '15h' },
    { handle: 'ren_kudo', text: 'our keeper could never 💀', timeAgo: '12h' },
    { handle: 'leo.kicks', text: 'the EYES bro', timeAgo: '10h' },
  ],
  p58: [
    { handle: 'hana.notes', text: '今日も行けなかった…明日こそ', timeAgo: '8h' },
    { handle: 'beanaboutit', text: 'the daily sellout post is my favorite genre', timeAgo: '7h' },
  ],
  p60: [
    { handle: 'vinylhour', text: 'digitize them!! carefully!!', timeAgo: '2d' },
    { handle: 'wavetable', text: 'the handwriting on side B 😭', timeAgo: '2d' },
  ],
  p63: [
    { handle: 'pixel.bento', text: 'Sir Whiskers looks noble', timeAgo: '20h' },
    { handle: 'yuki.pics', text: 'commissioning one of mochi immediately', timeAgo: '18h' },
  ],
  p65: [
    { handle: 'leo.kicks', text: 'i am in this photo and i don’t like it', timeAgo: '2d' },
    { handle: 'statline', text: 'the run expectancy on this hurt to calculate', timeAgo: '2d' },
    { handle: 'coachreyes', text: 'trust the process… next time', timeAgo: '1d' },
  ],
  p66: [
    { handle: 'tomo.eats', text: 'a whole tomato!! proud of you both', timeAgo: '22h' },
    { handle: 'ecofutures', text: 'homegrown is homegrown 🍅', timeAgo: '20h' },
    { handle: 'mei.mochi', text: 'update us when it’s harvest day', timeAgo: '16h' },
  ],
  p67: [
    { handle: 'aoi.club', text: 'submitting this photo as evidence', timeAgo: '1h' },
    { handle: 'yujin_kim', text: 'you both look great pls 😭', timeAgo: '1h' },
    { handle: 'mei.mochi', text: '@yujin_kim she gets ZERO photo credit', timeAgo: '50m' },
    { handle: 'sana.days', text: 'lawsuit pending 🧑‍⚖️', timeAgo: '30m' },
  ],
  p68: [
    { handle: 'leo.kicks', text: '🔥🔥🔥🔥🔥', timeAgo: '4h' },
    { handle: 'fridaynightfc', text: 'the whole league is watching. GO', timeAgo: '4h' },
    { handle: 'ren_kudo', text: '泣いた', timeAgo: '3h' },
    { handle: 'courtside.jo', text: 'that second goal was unreal', timeAgo: '2h' },
  ],
  p69: [
    { handle: 'mei.mochi', text: 'ハイライト見てきた、買います', timeAgo: '8h' },
    { handle: 'aoi.club', text: 'does it survive a full school day tho?', timeAgo: '7h' },
    { handle: 'nene.make', text: '@aoi.club 6時間目まではもった！体育は無理', timeAgo: '6h' },
  ],
  p70: [
    { handle: 'pixel.bento', text: 'your "muddy shading" is my final render 😭', timeAgo: '12h' },
    { handle: 'inkrei', text: 'the gauntlet looks fine?? artists see ghosts', timeAgo: '11h' },
    { handle: 'yuki.pics', text: 'sir whiskers pt 2 when', timeAgo: '9h' },
    { handle: 'frame.works', text: 'posting the imperfect ones is how you get good. respect', timeAgo: '8h' },
  ],
  p73: [
    { handle: 'yujin_kim', text: 'WHAT SONG', timeAgo: '25m' },
    { handle: 'marcus.wav', text: '@yujin_kim encore of the setlist closer, audio in my story', timeAgo: '20m' },
    { handle: 'gigfliers', text: 'blurriest photo = best night. rule', timeAgo: '10m' },
  ],
  p74: [
    { handle: 'sana.days', text: 'おつかれ！！！カラオケ行こ', timeAgo: '3h' },
    { handle: 'daichi.jpg', text: 'meanwhile i have two more 😐', timeAgo: '3h' },
    { handle: 'riko.o3', text: '@daichi.jpg がんばれ（他人事）', timeAgo: '2h' },
  ],
  p75: [
    { handle: 'tomo.eats', text: 'corn soup at the gym vending machine is elite actually', timeAgo: '9h' },
    { handle: 'hana.notes', text: 'they know exactly what they’re doing', timeAgo: '8h' },
  ],
  p76: [
    { handle: 'sana.days', text: 'the ratio of study to parfait tho 🤨', timeAgo: '22h' },
    { handle: 'hana.notes', text: '@sana.days 45 minutes counts as studying', timeAgo: '21h' },
    { handle: 'riko.o3', text: 'balance queen', timeAgo: '18h' },
  ],
}
