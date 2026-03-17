import { useEffect, useState } from 'react'
import './App.css'

type EventItem = {
  id: string
  title: string
  summary: string
  area: string
  category: string
  schedule: string
  tags: string[]
  description: string
}

const allEvents: EventItem[] = [
  {
    id: 'seoul-spring-light',
    title: '서울 스프링 라이트쇼',
    summary: '도심 야경과 미디어아트를 한 번에 보는 저녁 행사',
    area: '서울 중구',
    category: '전시',
    schedule: '3월 17일 19:30 - 22:00',
    tags: ['야간추천', '미디어아트', '무료'],
    description:
      '퇴근 후 바로 들르기 좋은 도심형 야간 행사입니다. 짧게 둘러봐도 만족도가 높고 사진 찍기 좋습니다.',
  },
  {
    id: 'han-river-vintage-market',
    title: '한강 빈티지 마켓',
    summary: '소품, 음악, 푸드를 함께 즐기는 주말형 팝업 마켓',
    area: '서울 서초구',
    category: '마켓',
    schedule: '3월 17일 13:00 - 20:00',
    tags: ['팝업', '마켓', '한강'],
    description:
      '한강 산책과 함께 가볍게 들르기 좋은 마켓입니다. 체류 시간이 길지 않아도 부담 없이 즐길 수 있습니다.',
  },
  {
    id: 'seongsu-design-exhibit',
    title: '성수 디자인 체험전',
    summary: '직접 참여하는 인터랙티브 전시 중심의 체험형 행사',
    area: '서울 성동구',
    category: '전시',
    schedule: '3월 17일 11:00 - 18:00',
    tags: ['전시', '체험형', '실내'],
    description:
      '비 오는 날에도 이동 부담이 적은 실내 체험 전시입니다. 친구와 함께 가볍게 방문하기 좋습니다.',
  },
  {
    id: 'hongdae-indie-festival',
    title: '홍대 인디 라이브 페스티벌',
    summary: '소규모 공연장에서 이어지는 오늘의 라이브 무대',
    area: '서울 마포구',
    category: '공연',
    schedule: '3월 17일 18:00 - 23:00',
    tags: ['공연', '실내', '음악'],
    description: '저녁 시간대에 맞춰 들르기 좋은 라이브 공연 행사입니다.',
  },
  {
    id: 'yeouido-food-popup',
    title: '여의도 푸드 팝업 스트리트',
    summary: '지금 바로 들를 수 있는 시즌 한정 푸드 팝업 모음',
    area: '서울 영등포구',
    category: '푸드',
    schedule: '3월 17일 12:00 - 21:00',
    tags: ['푸드', '팝업', '야외'],
    description: '짧은 식사 겸 방문하기 적합한 캐주얼한 행사입니다.',
  },
  {
    id: 'gwanghwamun-history-night',
    title: '광화문 역사 야간 해설',
    summary: '도보 중심으로 즐기는 짧은 야간 문화 프로그램',
    area: '서울 종로구',
    category: '투어',
    schedule: '3월 17일 20:00 시작',
    tags: ['문화', '도보', '야간추천'],
    description: '관광과 산책 사이의 밀도로 가볍게 참여할 수 있습니다.',
  },
  {
    id: 'jamsil-family-playday',
    title: '잠실 패밀리 플레이데이',
    summary: '아이와 함께 참여하는 체험 부스와 공연 프로그램',
    area: '서울 송파구',
    category: '가족',
    schedule: '3월 17일 10:00 - 17:00',
    tags: ['가족', '체험', '주말추천'],
    description: '가벼운 체험과 공연을 함께 묶어 즐길 수 있는 가족형 행사입니다.',
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
  onBack,
}: {
  event: EventItem | undefined
  onBack: () => void
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
          <p className="section-label">Today&apos;s Pick</p>
          <h1>{event.title}</h1>
          <p className="detail-description">{event.description}</p>
          <dl className="detail-meta">
            <div>
              <dt>지역</dt>
              <dd>{event.area}</dd>
            </div>
            <div>
              <dt>카테고리</dt>
              <dd>{event.category}</dd>
            </div>
            <div>
              <dt>일정</dt>
              <dd>{event.schedule}</dd>
            </div>
          </dl>
          <div className="tag-row">
            {event.tags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </article>
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

  if (eventId) {
    return (
      <EventDetail
        event={selectedEvent ?? undefined}
        onBack={() => moveTo('/')}
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
