import { useEffect, useState } from 'react'
import './App.css'

type EventItem = {
  id: string
  title: string
  summary: string
  area: string
  schedule: string
  tags: string[]
  description: string
}

const featuredEvents: EventItem[] = [
  {
    id: 'seoul-spring-light',
    title: '서울 스프링 라이트쇼',
    summary: '도심 야경과 미디어아트를 한 번에 보는 저녁 행사',
    area: '서울 중구',
    schedule: '오늘 19:30 - 22:00',
    tags: ['야간추천', '미디어아트', '무료'],
    description:
      '퇴근 후 바로 들르기 좋은 도심형 야간 행사입니다. 짧게 둘러봐도 만족도가 높고 사진 찍기 좋습니다.',
  },
  {
    id: 'han-river-vintage-market',
    title: '한강 빈티지 마켓',
    summary: '소품, 음악, 푸드를 함께 즐기는 주말형 팝업 마켓',
    area: '서울 서초구',
    schedule: '오늘 13:00 - 20:00',
    tags: ['팝업', '마켓', '한강'],
    description:
      '한강 산책과 함께 가볍게 들르기 좋은 마켓입니다. 체류 시간이 길지 않아도 부담 없이 즐길 수 있습니다.',
  },
  {
    id: 'seongsu-design-exhibit',
    title: '성수 디자인 체험전',
    summary: '직접 참여하는 인터랙티브 전시 중심의 체험형 행사',
    area: '서울 성동구',
    schedule: '오늘 11:00 - 18:00',
    tags: ['전시', '체험형', '실내'],
    description:
      '비 오는 날에도 이동 부담이 적은 실내 체험 전시입니다. 친구와 함께 가볍게 방문하기 좋습니다.',
  },
]

const moreEvents: EventItem[] = [
  {
    id: 'hongdae-indie-festival',
    title: '홍대 인디 라이브 페스티벌',
    summary: '소규모 공연장에서 이어지는 오늘의 라이브 무대',
    area: '서울 마포구',
    schedule: '오늘 18:00 - 23:00',
    tags: ['공연', '실내', '음악'],
    description: '저녁 시간대에 맞춰 들르기 좋은 라이브 공연 행사입니다.',
  },
  {
    id: 'yeouido-food-popup',
    title: '여의도 푸드 팝업 스트리트',
    summary: '지금 바로 들를 수 있는 시즌 한정 푸드 팝업 모음',
    area: '서울 영등포구',
    schedule: '오늘 12:00 - 21:00',
    tags: ['푸드', '팝업', '야외'],
    description: '짧은 식사 겸 방문하기 적합한 캐주얼한 행사입니다.',
  },
  {
    id: 'gwanghwamun-history-night',
    title: '광화문 역사 야간 해설',
    summary: '도보 중심으로 즐기는 짧은 야간 문화 프로그램',
    area: '서울 종로구',
    schedule: '오늘 20:00 시작',
    tags: ['문화', '도보', '야간추천'],
    description: '관광과 산책 사이의 밀도로 가볍게 참여할 수 있습니다.',
  },
]

const allEvents = [...featuredEvents, ...moreEvents]

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
            홈으로 돌아가기
          </button>
          <div className="detail-card">
            <p className="section-label">Event Detail</p>
            <h1>행사를 찾을 수 없습니다</h1>
            <p className="detail-description">
              요청한 더미 상세 페이지가 없어서 홈 화면으로 이동해 다시 선택해야 합니다.
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
          홈으로 돌아가기
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
          오늘 당장 갈 만한 행사만 빠르게 보고 바로 고르세요.
        </p>
      </header>

      <main className="home">
        <section className="hero">
          <div className="section-head">
            <p className="section-label">Main Picks</p>
            <h2>오늘의 행사 3가지</h2>
            <p>
              생각 많이 하지 않도록, 오늘 바로 가기 좋은 행사만 먼저 보여줍니다.
            </p>
          </div>

          <div className="featured-grid">
            {featuredEvents.map((event) => (
              <article
                key={event.id}
                className="event-card featured-card"
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
                <div className="card-meta">
                  <span>{event.area}</span>
                  <span>{event.schedule}</span>
                </div>
                <h3>{event.title}</h3>
                <p className="card-summary">{event.summary}</p>
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
        </section>

        <section className="list-section">
          <div className="section-head">
            <p className="section-label">More Today</p>
            <h2>추가 행사</h2>
          </div>

          <div className="list-grid">
            {moreEvents.map((event) => (
              <article
                key={event.id}
                className="event-card list-card"
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
                <div className="list-card-main">
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                </div>
                <div className="list-card-side">
                  <span>{event.area}</span>
                  <span>{event.schedule}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
