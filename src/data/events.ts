export type EventItem = {
  id: string
  title: string
  summary: string
  heroLine: string
  description: string
  details: string[]
  region: string
  dateTime: string
  price: string
  tags: string[]
  category: string
  thumbnail: string
}

export const featuredEventIds = [
  'seoul-spring-light',
  'han-river-vintage-market',
  'seongsu-design-exhibit',
]

export const events: EventItem[] = [
  {
    id: 'seoul-spring-light',
    title: '서울 스프링 라이트쇼',
    summary: '도심 야경과 미디어아트를 한 번에 보는 저녁 행사',
    heroLine: '퇴근 후 가볍게 들르기 좋은 서울 도심형 야간 아트 프로그램',
    description:
      '서울 도심 주요 공간을 따라 미디어아트와 조명 연출을 감상할 수 있는 야간 행사입니다. 짧게 둘러봐도 밀도가 좋고, 사진을 남기기에도 좋은 동선으로 구성되어 있습니다.',
    details: [
      '시청과 광화문 사이에서 이어지는 라이트 연출을 따라 천천히 산책하듯 즐길 수 있습니다.',
      '현장 안내 부스와 포토 스폿이 있어 처음 가는 방문자도 어렵지 않게 동선을 잡을 수 있습니다.',
    ],
    region: '서울 중구',
    dateTime: '3월 17일 19:30 - 22:00',
    price: '무료',
    tags: ['야간추천', '미디어아트', '무료'],
    category: '전시',
    thumbnail:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'han-river-vintage-market',
    title: '한강 빈티지 마켓',
    summary: '소품, 음악, 푸드를 함께 즐기는 주말형 팝업 마켓',
    heroLine: '산책과 쇼핑, 간단한 먹거리를 한 번에 즐기는 한강 팝업',
    description:
      '빈티지 소품 셀러와 푸드 부스, 소규모 공연이 함께 모이는 캐주얼 마켓입니다. 오래 머무르지 않아도 분위기를 충분히 즐길 수 있어 가볍게 방문하기 좋습니다.',
    details: [
      '강변 산책로와 바로 연결되어 있어서 마켓을 둘러본 뒤 주변을 더 걷기 좋습니다.',
      '셀러 구성이 다양해서 작은 소품이나 선물용 아이템을 둘러보기에도 적합합니다.',
    ],
    region: '서울 서초구',
    dateTime: '3월 17일 13:00 - 20:00',
    price: '무료 입장',
    tags: ['팝업', '마켓', '한강'],
    category: '마켓',
    thumbnail:
      'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'seongsu-design-exhibit',
    title: '성수 디자인 체험전',
    summary: '직접 참여하는 인터랙티브 전시 중심의 체험형 행사',
    heroLine: '보고 끝나는 전시보다 직접 만져보는 체험을 원할 때 맞는 선택',
    description:
      '디자인 오브제를 직접 다뤄보거나 간단한 참여형 콘텐츠를 경험할 수 있는 실내 전시입니다. 날씨 영향을 덜 받고, 친구와 함께 가볍게 방문하기 좋습니다.',
    details: [
      '참여형 설치 작품이 많아 한 공간에 오래 머무르지 않아도 충분히 흥미를 느낄 수 있습니다.',
      '성수 카페 거리와 가까워 전시 후 다른 일정을 이어가기에도 편합니다.',
    ],
    region: '서울 성동구',
    dateTime: '3월 17일 11:00 - 18:00',
    price: '성인 8,000원',
    tags: ['전시', '체험형', '실내'],
    category: '전시',
    thumbnail:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'hongdae-indie-festival',
    title: '홍대 인디 라이브 페스티벌',
    summary: '소규모 공연장에서 이어지는 오늘의 라이브 무대',
    heroLine: '저녁 시간에 맞춰 에너지 있는 라이브를 보고 싶을 때 좋은 공연',
    description:
      '홍대 인근 소규모 공연장에서 여러 팀의 인디 라이브를 이어서 만날 수 있는 행사입니다. 좌석보다는 현장감과 분위기를 즐기는 쪽에 더 잘 맞습니다.',
    details: [
      '짧은 세트로 여러 팀을 볼 수 있어 취향을 넓히기 좋습니다.',
      '공연장 주변 식음 공간이 많아 저녁 일정과 함께 묶기 편합니다.',
    ],
    region: '서울 마포구',
    dateTime: '3월 17일 18:00 - 23:00',
    price: '현장 입장 15,000원',
    tags: ['공연', '실내', '음악'],
    category: '공연',
    thumbnail:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'yeouido-food-popup',
    title: '여의도 푸드 팝업 스트리트',
    summary: '지금 바로 들를 수 있는 시즌 한정 푸드 팝업 모음',
    heroLine: '식사와 구경을 같이 해결하고 싶을 때 부담 없는 푸드 행사',
    description:
      '시즌 메뉴와 브랜드 팝업 부스가 모인 푸드 중심 행사입니다. 식사 겸 짧게 들르기 좋고, 동행이 있어도 취향을 맞추기 쉬운 구성이 강점입니다.',
    details: [
      '브랜드별 한정 메뉴가 많아 평소보다 고르는 재미가 확실한 편입니다.',
      '직장인 밀집 지역이라 접근이 쉽고 회전이 빨라 대기 부담이 상대적으로 적습니다.',
    ],
    region: '서울 영등포구',
    dateTime: '3월 17일 12:00 - 21:00',
    price: '무료 입장',
    tags: ['푸드', '팝업', '야외'],
    category: '푸드',
    thumbnail:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gwanghwamun-history-night',
    title: '광화문 역사 야간 해설',
    summary: '도보 중심으로 즐기는 짧은 야간 문화 프로그램',
    heroLine: '산책하듯 참여하면서도 가볍게 이야깃거리를 얻을 수 있는 야간 투어',
    description:
      '광화문 일대의 역사 포인트를 따라 이동하며 짧은 해설을 듣는 프로그램입니다. 관광보다 부담 없고, 단순 산책보다 밀도 있는 저녁 시간을 보내고 싶을 때 적당합니다.',
    details: [
      '걷는 속도에 맞춰 진행되어 특별한 준비 없이도 참여할 수 있습니다.',
      '짧은 시간 안에 핵심만 듣는 구성이라 문화 프로그램 입문용으로도 무난합니다.',
    ],
    region: '서울 종로구',
    dateTime: '3월 17일 20:00 시작',
    price: '무료',
    tags: ['문화', '도보', '야간추천'],
    category: '투어',
    thumbnail:
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'jamsil-family-playday',
    title: '잠실 패밀리 플레이데이',
    summary: '아이와 함께 참여하는 체험 부스와 공연 프로그램',
    heroLine: '가족 단위로 오래 고민하지 않고 움직이기 좋은 낮 시간대 행사',
    description:
      '체험 부스, 간단한 공연, 쉬는 공간이 함께 있는 가족형 행사입니다. 어린이 동반 기준으로 동선이 단순하게 잡혀 있어 오래 계획하지 않아도 편하게 둘러볼 수 있습니다.',
    details: [
      '한 공간 안에서 체험과 공연을 번갈아 볼 수 있어 이동 부담이 적습니다.',
      '주말 낮 시간 중심 구성이라 아이와 함께 방문하기에 리듬이 안정적입니다.',
    ],
    region: '서울 송파구',
    dateTime: '3월 17일 10:00 - 17:00',
    price: '보호자 5,000원 / 아동 무료',
    tags: ['가족', '체험', '주말추천'],
    category: '가족',
    thumbnail:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
  },
]

export const regionOptions = [
  '전체 지역',
  ...new Set(events.map((event) => event.region)),
]

export const categoryOptions = [
  '전체 카테고리',
  ...new Set(events.map((event) => event.category)),
]

export function getFeaturedEvents() {
  return featuredEventIds
    .map((id) => events.find((event) => event.id === id))
    .filter((event): event is EventItem => Boolean(event))
}

export function getEventById(id: string) {
  return events.find((event) => event.id === id)
}

export function getRelatedEvents(targetEvent: EventItem, limit = 3) {
  return events
    .filter(
      (event) =>
        event.id !== targetEvent.id &&
        (event.category === targetEvent.category ||
          event.region.split(' ')[0] === targetEvent.region.split(' ')[0]),
    )
    .slice(0, limit)
}
