import { useEffect, useState } from 'react'
import './App.css'

type EventItem = {
  id: string
  title: string
  summary: string
  heroLine: string
  description: string
  details: string[]
  area: string
  category: string
  schedule: string
  price: string
  tags: string[]
}

const allEvents: EventItem[] = [
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
    area: '서울 중구',
    category: '전시',
    schedule: '3월 17일 19:30 - 22:00',
    price: '무료',
    tags: ['야간추천', '미디어아트', '무료'],
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
    area: '서울 서초구',
    category: '마켓',
    schedule: '3월 17일 13:00 - 20:00',
    price: '무료 입장',
    tags: ['팝업', '마켓', '한강'],
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
    area: '서울 성동구',
    category: '전시',
    schedule: '3월 17일 11:00 - 18:00',
    price: '성인 8,000원',
    tags: ['전시', '체험형', '실내'],
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
    area: '서울 마포구',
    category: '공연',
    schedule: '3월 17일 18:00 - 23:00',
    price: '현장 입장 15,000원',
    tags: ['공연', '실내', '음악'],
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
    area: '서울 영등포구',
    category: '푸드',
    schedule: '3월 17일 12:00 - 21:00',
    price: '무료 입장',
    tags: ['푸드', '팝업', '야외'],
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
    area: '서울 종로구',
    category: '투어',
    schedule: '3월 17일 20:00 시작',
    price: '무료',
    tags: ['문화', '도보', '야간추천'],
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
    area: '서울 송파구',
    category: '가족',
    schedule: '3월 17일 10:00 - 17:00',
    price: '보호자 5,000원 / 아동 무료',
    tags: ['가족', '체험', '주말추천'],
  },
]

const regionOptions = ['전체 지역', ...new Set(allEvents.map((event) => event.area))]
const categoryOptions = [
  '전체 카테고리',
  ...new Set(allEvents.map((event) => event.category)),
]

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

function getEventIdFromRoute(route: string) {
  const match = route.match(/^\/events\/([^/]+)$/)
  return match?.[1] ?? null
}

function EventDetail({
  event,
  relatedEvents,
  onBack,
  onOpenEvent,
}: {
  event: EventItem | undefined
  relatedEvents: EventItem[]
  onBack: () => void
  onOpenEvent: (id: string) => void
}) {
  if (!event) {
    return (
      <main className="detail-page">
        <div className="detail-shell">
          <button className="back-link" type="button" onClick={onBack}>
            행사 리스트로 돌아가기
          </button>
          <div className="detail-card">
            <p className="section-label">Event Detail</p>
            <h1>행사를 찾을 수 없습니다</h1>
            <p className="detail-description">
              요청한 상세 페이지가 없어서 리스트 화면으로 돌아가 다시 선택해야 합니다.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="detail-page">
      <div className="detail-shell">
        <button className="back-link" type="button" onClick={onBack}>
          행사 리스트로 돌아가기
        </button>

        <article className="detail-card">
          <div className="detail-heading">
            <p className="section-label">Event Detail</p>
            <h1>{event.title}</h1>
            <p className="detail-hero-line">{event.heroLine}</p>
          </div>

          <dl className="detail-meta">
            <div>
              <dt>지역</dt>
              <dd>{event.area}</dd>
            </div>
            <div>
              <dt>날짜 / 시간</dt>
              <dd>{event.schedule}</dd>
            </div>
            <div>
              <dt>참여 비용</dt>
              <dd>{event.price}</dd>
            </div>
          </dl>

          <section className="detail-section">
            <h2>행사 소개</h2>
            <p className="detail-description">{event.description}</p>
          </section>

          <section className="detail-section">
            <h2>이렇게 즐기기 좋아요</h2>
            <div className="detail-points">
              {event.details.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2>태그</h2>
            <div className="tag-row">
              <span className="tag">#{event.category}</span>
              {event.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        </article>

        {relatedEvents.length > 0 ? (
          <aside className="related-section">
            <div className="section-head compact-head">
              <p className="section-label">Related</p>
              <h2>비슷한 행사</h2>
            </div>
            <div className="related-grid">
              {relatedEvents.map((relatedEvent) => (
                <article
                  key={relatedEvent.id}
                  className="event-card related-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenEvent(relatedEvent.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpenEvent(relatedEvent.id)
                    }
                  }}
                >
                  <span className="category-badge">{relatedEvent.category}</span>
                  <h3>{relatedEvent.title}</h3>
                  <p>{relatedEvent.summary}</p>
                  <span className="schedule-line">{relatedEvent.schedule}</span>
                </article>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(getRoute())
  const [selectedRegion, setSelectedRegion] = useState('전체 지역')
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리')

  const eventId = getEventIdFromRoute(route)
  const selectedEvent = eventId
    ? allEvents.find((event) => event.id === eventId)
    : null

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute())

    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  const moveTo = (nextRoute: string) => {
    window.location.hash = nextRoute
    setRoute(nextRoute)
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesRegion =
      selectedRegion === '전체 지역' || event.area === selectedRegion
    const matchesCategory =
      selectedCategory === '전체 카테고리' || event.category === selectedCategory

    return matchesRegion && matchesCategory
  })

  const relatedEvents = selectedEvent
    ? allEvents
        .filter(
          (event) =>
            event.id !== selectedEvent.id &&
            (event.category === selectedEvent.category ||
              event.area.split(' ')[0] === selectedEvent.area.split(' ')[0]),
        )
        .slice(0, 3)
    : []

  if (eventId) {
    return (
      <EventDetail
        event={selectedEvent ?? undefined}
        relatedEvents={relatedEvents}
        onBack={() => moveTo('/')}
        onOpenEvent={(id) => moveTo(`/events/${id}`)}
      />
    )
  }

  return (
    <div className="page">
      <header className="topbar">
        <p className="brand-eyebrow">Today, Pick Seoul</p>
        <h1>오늘 뭐하지?</h1>
        <p className="brand-copy">
          오늘 갈 만한 행사를 지역과 분위기별로 가볍게 탐색해보세요.
        </p>
      </header>

      <main className="home">
        <section className="browse-shell">
          <div className="section-head">
            <p className="section-label">Event List</p>
            <h2>오늘 둘러볼 행사</h2>
            <p>복잡한 검색 대신, 지금 갈 수 있는 행사만 직관적으로 모았습니다.</p>
          </div>

          <div className="filter-bar">
            <label className="filter-field">
              <span>지역</span>
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
              >
                {regionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>카테고리</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="result-meta">
              <strong>{filteredEvents.length}</strong>
              <span>개의 행사를 찾았습니다</span>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="event-card browse-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => moveTo(`/events/${event.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      moveTo(`/events/${event.id}`)
                    }
                  }}
                >
                  <div className="card-topline">
                    <span className="category-badge">{event.category}</span>
                    <span className="area-text">{event.area}</span>
                  </div>
                  <div className="browse-card-body">
                    <h3>{event.title}</h3>
                    <p className="card-summary">{event.summary}</p>
                  </div>
                  <div className="schedule-line">{event.schedule}</div>
                  <div className="tag-row">
                    {event.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>조건에 맞는 행사가 없습니다</h3>
              <p>지역 또는 카테고리를 전체로 바꾸면 더 많은 행사를 볼 수 있습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
