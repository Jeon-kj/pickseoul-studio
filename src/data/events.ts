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

type UnifiedEventRecord = {
  item: EventItem
  startDate: number
  endDate: number
  dedupeKey: string
  qualityScore: number
}

type SeoulEventApiResponse = {
  ListPublicReservationCulture?: {
    RESULT?: {
      CODE?: string
      MESSAGE?: string
    }
    row?: SeoulEventRow[]
  }
}

type SeoulEventRow = {
  SVCID?: string
  MAXCLASSNM?: string
  MINCLASSNM?: string
  SVCSTATNM?: string
  SVCNM?: string
  PAYATNM?: string
  PLACENM?: string
  USETGTINFO?: string
  SVCURL?: string
  SVCOPNBGNDT?: string
  SVCOPNENDDT?: string
  RCPTBGNDT?: string
  RCPTENDDT?: string
  AREANM?: string
  IMGURL?: string
  TELNO?: string
  REVSTDDAYNM?: string
}

type TourApiResponse = {
  response?: {
    header?: {
      resultCode?: string
      resultMsg?: string
    }
    body?: {
      items?: {
        item?: TourEventRow[] | TourEventRow
      }
    }
  }
}

type TourEventRow = {
  addr1?: string
  addr2?: string
  contentid?: string
  eventstartdate?: string
  eventenddate?: string
  firstimage?: string
  firstimage2?: string
  mapx?: string
  mapy?: string
  tel?: string
  title?: string
}

const SEOUL_OPEN_API_KEY = import.meta.env.VITE_SEOUL_API_KEY?.trim()
const TOUR_API_KEY = import.meta.env.VITE_TOUR_API_KEY?.trim()
const SEOUL_PROXY_PATH =
  import.meta.env.DEV
    ? '/proxy/seoul'
    : import.meta.env.VITE_SEOUL_API_BASE_URL?.trim() || 'http://openapi.seoul.go.kr:8088'
const TOUR_PROXY_PATH =
  import.meta.env.DEV
    ? '/proxy/tour'
    : import.meta.env.VITE_TOUR_API_BASE_URL?.trim() ||
      'https://apis.data.go.kr/B551011/KorService2'
const SEOUL_TIME_ZONE = 'Asia/Seoul'
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#102542"/>
          <stop offset="100%" stop-color="#f87060"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="960" cy="140" r="180" fill="rgba(255,255,255,0.12)"/>
      <circle cx="180" cy="640" r="220" fill="rgba(255,255,255,0.08)"/>
      <text x="72" y="688" fill="#ffffff" font-size="72" font-family="Arial, sans-serif">
        Seoul Event
      </text>
    </svg>
  `)

function getSeoulDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: SEOUL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    year: lookup.year,
    month: lookup.month,
    day: lookup.day,
  }
}

function getTodayKey() {
  const { year, month, day } = getSeoulDateParts()
  return `${year}${month}${day}`
}

function toNumericDate(value?: string) {
  if (!value) {
    return Number.MAX_SAFE_INTEGER
  }

  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.length === 8 ? Number(digits) : Number.MAX_SAFE_INTEGER
}

function trimText(value?: string) {
  return value?.trim() || ''
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
}

function formatKoreanDateTime(value?: string) {
  if (!value) {
    return ''
  }

  if (/^\d{8}$/.test(value)) {
    return `${Number(value.slice(4, 6))}월 ${Number(value.slice(6, 8))}일`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: SEOUL_TIME_ZONE,
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatDateRange(start?: string, end?: string) {
  const startText = formatKoreanDateTime(start)
  const endText = formatKoreanDateTime(end)

  if (startText && endText) {
    return `${startText} - ${endText}`
  }

  return startText || endText || '일정 정보 확인 필요'
}

function toRegion(area?: string) {
  if (!area) {
    return '서울'
  }

  return area.startsWith('서울') ? area : `서울 ${area}`
}

function makeDedupeKey(title: string, region: string, startDate: number) {
  return [normalizeText(title), normalizeText(region), String(startDate)].join('|')
}

function scoreEvent(item: EventItem) {
  return [
    item.thumbnail !== FALLBACK_IMAGE ? 2 : 0,
    item.description ? 1 : 0,
    item.details.length > 0 ? 1 : 0,
    item.tags.length > 0 ? 1 : 0,
  ].reduce((total, score) => total + score, 0)
}

function buildSeoulRecord(row: SeoulEventRow): UnifiedEventRecord {
  const title = trimText(row.SVCNM) || '서울 행사 정보'
  const category = trimText(row.MINCLASSNM) || trimText(row.MAXCLASSNM) || '행사'
  const region = toRegion(trimText(row.AREANM))
  const startDate = toNumericDate(row.SVCOPNBGNDT)
  const endDate = toNumericDate(row.SVCOPNENDDT)
  const item: EventItem = {
    id: `seoul-${trimText(row.SVCID) || normalizeText(title)}`,
    title,
    summary:
      [trimText(row.PLACENM), trimText(row.USETGTINFO), trimText(row.PAYATNM)]
        .filter(Boolean)
        .slice(0, 2)
        .join(' · ') || '서울 열린데이터 광장의 행사 정보입니다.',
    heroLine:
      [trimText(row.AREANM), category, trimText(row.SVCSTATNM)]
        .filter(Boolean)
        .join(' · ') || '서울 열린데이터 행사 정보',
    description: [
      trimText(row.PLACENM) ? `${row.PLACENM}에서 진행되는 행사입니다.` : '',
      trimText(row.USETGTINFO) ? `이용 대상은 ${row.USETGTINFO}입니다.` : '',
      trimText(row.SVCURL)
        ? '상세 운영 정보와 예약은 서울 열린데이터 연계 페이지에서 확인할 수 있습니다.'
        : '',
    ]
      .filter(Boolean)
      .join(' '),
    details: [
      trimText(row.PLACENM) ? `장소: ${row.PLACENM}` : '',
      trimText(row.USETGTINFO) ? `이용 대상: ${row.USETGTINFO}` : '',
      trimText(row.REVSTDDAYNM) ? `예약 기준: ${row.REVSTDDAYNM}` : '',
      trimText(row.TELNO) ? `문의: ${row.TELNO}` : '',
    ].filter(Boolean),
    region,
    dateTime: formatDateRange(row.SVCOPNBGNDT, row.SVCOPNENDDT),
    price: trimText(row.PAYATNM) || '요금 정보 확인 필요',
    tags: [
      '서울열린데이터',
      trimText(row.MINCLASSNM),
      trimText(row.PAYATNM),
      trimText(row.SVCSTATNM),
    ].filter(Boolean),
    category,
    thumbnail: trimText(row.IMGURL) || FALLBACK_IMAGE,
  }

  return {
    item,
    startDate,
    endDate,
    dedupeKey: makeDedupeKey(title, region, startDate),
    qualityScore: scoreEvent(item),
  }
}

function buildTourRecord(row: TourEventRow): UnifiedEventRecord {
  const title = trimText(row.title) || 'TourAPI 행사 정보'
  const addr = [trimText(row.addr1), trimText(row.addr2)].filter(Boolean).join(' ')
  const region = toRegion(addr || '서울')
  const startDate = toNumericDate(row.eventstartdate)
  const endDate = toNumericDate(row.eventenddate)
  const item: EventItem = {
    id: `tour-${trimText(row.contentid) || normalizeText(title)}`,
    title,
    summary:
      [trimText(row.addr1), trimText(row.tel)].filter(Boolean).join(' · ') ||
      '한국관광공사 TourAPI 행사 정보입니다.',
    heroLine: ['서울', '축제/행사', trimText(row.tel) ? '문의 가능' : '상세 정보 확인']
      .filter(Boolean)
      .join(' · '),
    description: [
      addr ? `${addr}에서 진행되는 행사입니다.` : '서울에서 진행되는 행사입니다.',
      row.eventstartdate && row.eventenddate
        ? `행사 기간은 ${formatDateRange(row.eventstartdate, row.eventenddate)}입니다.`
        : '',
      trimText(row.tel) ? `문의는 ${row.tel}로 확인할 수 있습니다.` : '',
    ]
      .filter(Boolean)
      .join(' '),
    details: [
      addr ? `장소: ${addr}` : '',
      trimText(row.tel) ? `문의: ${row.tel}` : '',
      trimText(row.mapx) && trimText(row.mapy)
        ? `좌표: ${row.mapx}, ${row.mapy}`
        : '',
    ].filter(Boolean),
    region,
    dateTime: formatDateRange(row.eventstartdate, row.eventenddate),
    price: '요금 정보 확인 필요',
    tags: ['TourAPI', '축제/행사', '서울'].filter(Boolean),
    category: '축제/행사',
    thumbnail: trimText(row.firstimage) || trimText(row.firstimage2) || FALLBACK_IMAGE,
  }

  return {
    item,
    startDate,
    endDate,
    dedupeKey: makeDedupeKey(title, region, startDate),
    qualityScore: scoreEvent(item),
  }
}

async function fetchSeoulEvents(today: string) {
  if (!SEOUL_OPEN_API_KEY) {
    throw new Error('`VITE_SEOUL_API_KEY`가 없습니다.')
  }

  const response = await fetch(
    `${SEOUL_PROXY_PATH}/${SEOUL_OPEN_API_KEY}/json/ListPublicReservationCulture/1/400`,
  )

  if (!response.ok) {
    throw new Error(`서울 열린데이터 API 요청에 실패했습니다. (${response.status})`)
  }

  const data = (await response.json()) as SeoulEventApiResponse
  const payload = data.ListPublicReservationCulture

  if (!payload) {
    throw new Error('서울 열린데이터 API 응답 형식이 예상과 다릅니다.')
  }

  if (payload.RESULT?.CODE && payload.RESULT.CODE !== 'INFO-000') {
    throw new Error(payload.RESULT.MESSAGE || '서울 열린데이터 API에서 오류를 반환했습니다.')
  }

  return (payload.row ?? [])
    .filter((row) => {
      const startDate = toNumericDate(row.SVCOPNBGNDT)
      const endDate = toNumericDate(row.SVCOPNENDDT)
      const todayNumber = Number(today)

      return startDate <= todayNumber && todayNumber <= endDate
    })
    .map(buildSeoulRecord)
}

async function fetchTourEvents(today: string) {
  if (!TOUR_API_KEY) {
    throw new Error('`VITE_TOUR_API_KEY`가 없습니다.')
  }

  const url = new URL(`${TOUR_PROXY_PATH}/searchFestival2`, window.location.origin)
  url.searchParams.set('serviceKey', TOUR_API_KEY)
  url.searchParams.set('numOfRows', '200')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('MobileApp', 'PickSeoul')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('arrange', 'A')
  url.searchParams.set('eventStartDate', today)
  url.searchParams.set('areaCode', '1')

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`TourAPI 요청에 실패했습니다. (${response.status})`)
  }

  const data = (await response.json()) as TourApiResponse
  const header = data.response?.header

  if (header?.resultCode && header.resultCode !== '0000') {
    throw new Error(header.resultMsg || 'TourAPI에서 오류를 반환했습니다.')
  }

  const rawItems = data.response?.body?.items?.item
  const items =
    typeof rawItems === 'string'
      ? []
      : Array.isArray(rawItems)
        ? rawItems
        : rawItems
          ? [rawItems]
          : []
  const todayNumber = Number(today)

  return items
    .filter((item) => {
      const endDate = toNumericDate(item.eventenddate)
      return todayNumber <= endDate
    })
    .map(buildTourRecord)
}

function deduplicateEvents(records: UnifiedEventRecord[]) {
  const merged = new Map<string, UnifiedEventRecord>()

  for (const record of records) {
    const existing = merged.get(record.dedupeKey)

    if (!existing) {
      merged.set(record.dedupeKey, record)
      continue
    }

    if (record.qualityScore > existing.qualityScore) {
      merged.set(record.dedupeKey, record)
      continue
    }

    if (record.qualityScore === existing.qualityScore && record.startDate < existing.startDate) {
      merged.set(record.dedupeKey, record)
    }
  }

  return [...merged.values()]
    .sort((a, b) => {
      if (a.startDate !== b.startDate) {
        return a.startDate - b.startDate
      }

      if (a.endDate !== b.endDate) {
        return a.endDate - b.endDate
      }

      return a.item.title.localeCompare(b.item.title, 'ko')
    })
    .map((record) => record.item)
}

export async function fetchEvents() {
  const today = getTodayKey()
  const tasks = await Promise.allSettled([fetchSeoulEvents(today), fetchTourEvents(today)])
  const records = tasks.flatMap((task) => (task.status === 'fulfilled' ? task.value : []))

  if (records.length === 0) {
    const messages = tasks
      .filter((task): task is PromiseRejectedResult => task.status === 'rejected')
      .map((task) => (task.reason instanceof Error ? task.reason.message : '행사 데이터를 불러오지 못했습니다.'))

    throw new Error(
      messages[0] ||
        '행사 데이터를 불러오지 못했습니다. `VITE_SEOUL_API_KEY`, `VITE_TOUR_API_KEY`를 확인하세요.',
    )
  }

  return deduplicateEvents(records)
}

export function getRegionOptions(events: EventItem[]) {
  return ['전체 지역', ...new Set(events.map((event) => event.region))]
}

export function getCategoryOptions(events: EventItem[]) {
  return ['전체 카테고리', ...new Set(events.map((event) => event.category))]
}

export function getFeaturedEvents(events: EventItem[]) {
  return events.slice(0, 3)
}

export function getEventById(events: EventItem[], id: string) {
  return events.find((event) => event.id === id)
}

export function getRelatedEvents(events: EventItem[], targetEvent: EventItem, limit = 3) {
  return events
    .filter(
      (event) =>
        event.id !== targetEvent.id &&
        (event.category === targetEvent.category ||
          event.region.split(' ')[1] === targetEvent.region.split(' ')[1]),
    )
    .slice(0, limit)
}
