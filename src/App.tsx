import { useEffect, useState } from 'react'
import './App.css'
import {
  fetchEvents,
  getCategoryOptions,
  getEventById,
  getFeaturedEvents,
  getRegionOptions,
  getRelatedEvents,
  type EventItem,
} from './data/events'

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

function getEventIdFromRoute(route: string) {
  const match = route.match(/^\/events\/([^/]+)$/)
  return match?.[1] ?? null
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="empty-state status-state">
      <h3>{message}</h3>
    </div>
  )
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
              <dd>{event.region}</dd>
            </div>
            <div>
              <dt>날짜 / 시간</dt>
              <dd>{event.dateTime}</dd>
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
              {event.details.length > 0 ? (
                event.details.map((item) => <p key={item}>{item}</p>)
              ) : (
                <p>상세 운영 정보는 예약 페이지에서 확인해 주세요.</p>
              )}
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
                  <span className="schedule-line">{relatedEvent.dateTime}</span>
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
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventId = getEventIdFromRoute(route)
  const selectedEvent = eventId ? getEventById(events, eventId) : null
  const featuredEvents = getFeaturedEvents(events)
  const regionOptions = getRegionOptions(events)
  const categoryOptions = getCategoryOptions(events)

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute())

    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      try {
        setLoading(true)
        setError(null)
        const nextEvents = await fetchEvents()

        if (!ignore) {
          setEvents(nextEvents)
        }
      } catch (caughtError) {
        if (!ignore) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : '행사 데이터를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [])

  const moveTo = (nextRoute: string) => {
    window.location.hash = nextRoute
    setRoute(nextRoute)
  }

  const filteredEvents = events.filter((event) => {
    const matchesRegion =
      selectedRegion === '전체 지역' || event.region === selectedRegion
    const matchesCategory =
      selectedCategory === '전체 카테고리' || event.category === selectedCategory

    return matchesRegion && matchesCategory
  })

  const relatedEvents = selectedEvent ? getRelatedEvents(events, selectedEvent) : []

  if (eventId) {
    if (loading) {
      return (
        <main className="detail-page">
          <div className="detail-shell">
            <LoadingState message="행사 정보를 불러오는 중입니다." />
          </div>
        </main>
      )
    }

    if (error) {
      return (
        <main className="detail-page">
          <div className="detail-shell">
            <button className="back-link" type="button" onClick={() => moveTo('/')}>
              행사 리스트로 돌아가기
            </button>
            <div className="detail-card">
              <p className="section-label">Event Detail</p>
              <h1>행사 데이터를 불러오지 못했습니다</h1>
              <p className="detail-description">{error}</p>
            </div>
          </div>
        </main>
      )
    }

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
          오늘 바로 움직일 수 있는 행사만 먼저 보여드릴게요.
        </p>
      </header>

      <main className="home">
        <section className="browse-shell">
          <div className="section-head">
            <p className="section-label">Main Picks</p>
            <h2>오늘의 행사 3가지</h2>
            <p>지금 고르기 쉬운 행사만 가볍게 추려놨습니다. 고민은 줄이고 선택은 빠르게.</p>
          </div>

          {loading ? (
            <LoadingState message="오늘의 행사 데이터를 불러오는 중입니다." />
          ) : error ? (
            <div className="empty-state status-state">
              <h3>행사 데이터를 불러오지 못했습니다</h3>
              <p>{error}</p>
            </div>
          ) : (
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
                  <div
                    className="featured-image"
                    style={{ backgroundImage: `url(${event.thumbnail})` }}
                    aria-hidden="true"
                  />
                  <div className="featured-body">
                    <div className="card-topline">
                      <span className="category-badge">{event.category}</span>
                      <span className="area-text">{event.region}</span>
                    </div>
                    <h3>{event.title}</h3>
                    <p className="card-summary">{event.summary}</p>
                    <div className="schedule-line">{event.dateTime}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="browse-shell">
          <div className="section-head">
            <p className="section-label">Event List</p>
            <h2>오늘 둘러볼 행사</h2>
            <p>조금 더 보고 싶다면 아래에서 지역과 카테고리로 편하게 둘러보세요.</p>
          </div>

          <div className="filter-bar">
            <label className="filter-field">
              <span>지역</span>
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
                disabled={loading || Boolean(error)}
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
                disabled={loading || Boolean(error)}
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

          {loading ? (
            <LoadingState message="행사 리스트를 불러오는 중입니다." />
          ) : error ? (
            <div className="empty-state status-state">
              <h3>행사 리스트를 불러오지 못했습니다</h3>
              <p>{error}</p>
            </div>
          ) : filteredEvents.length > 0 ? (
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
                    <span className="area-text">{event.region}</span>
                  </div>
                  <div className="browse-card-body">
                    <h3>{event.title}</h3>
                    <p className="card-summary">{event.summary}</p>
                  </div>
                  <div className="schedule-line">{event.dateTime}</div>
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
