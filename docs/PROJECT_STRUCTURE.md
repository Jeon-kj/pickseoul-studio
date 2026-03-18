# PickSeoul Project Structure

## Overview

이 프로젝트는 React + TypeScript + Vite 기반의 단일 페이지 앱이다.  
서울 행사 데이터를 불러와 홈 화면과 상세 화면에 보여주는 구조로 되어 있다.

현재 데이터 소스:

- 서울 열린데이터 광장 `ListPublicReservationCulture`
- 한국관광공사 TourAPI `searchFestival2`

현재 라우팅 방식:

- 해시 라우팅
- 홈: `#/`
- 상세: `#/events/:id`

## Top-Level Structure

```text
pickseoul/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── data/
│       └── events.ts
├── public/
├── .env
├── .env.example
├── vite.config.ts
├── package.json
└── README.md
```

## File Roles

### `src/main.tsx`

- 앱 엔트리 포인트
- `App.tsx`를 DOM에 마운트

### `src/App.tsx`

- 화면 렌더링 중심 파일
- 홈 화면과 상세 화면을 모두 관리
- `window.location.hash` 기반으로 현재 라우트를 직접 해석
- `fetchEvents()`를 호출해 행사 데이터를 로드

주요 상태:

- `route`
- `selectedRegion`
- `selectedCategory`
- `events`
- `loading`
- `error`

주요 화면 구성:

- 상단 헤더
- `오늘의 행사 3가지`
- 행사 리스트 + 지역/카테고리 필터
- 행사 상세 화면
- 관련 행사 섹션

### `src/data/events.ts`

- 외부 API 연동과 데이터 정규화 담당
- 화면에서 공통으로 쓰는 `EventItem` 타입 정의
- 서울 열린데이터와 TourAPI 응답을 하나의 구조로 변환
- 중복 제거와 정렬 처리

주요 역할:

- `fetchSeoulEvents()`
- `fetchTourEvents()`
- `deduplicateEvents()`
- `fetchEvents()`
- `getFeaturedEvents()`
- `getRegionOptions()`
- `getCategoryOptions()`
- `getEventById()`
- `getRelatedEvents()`

### `vite.config.ts`

- Vite 설정 파일
- 개발 환경에서 외부 API를 프록시로 우회

현재 프록시:

- `/proxy/seoul` -> `http://openapi.seoul.go.kr:8088`
- `/proxy/tour` -> `https://apis.data.go.kr/B551011/KorService2`

### `.env`

- 실제 API 키와 외부 API 베이스 URL 저장
- 개발 시 Vite가 읽는 환경변수 파일

### `.env.example`

- 환경변수 예시 템플릿
- 실제 키는 넣지 않고 이름만 공유할 때 사용

## Data Flow

### 1. 앱 시작

- `main.tsx`가 `App.tsx`를 렌더
- `App.tsx` 마운트 시 `fetchEvents()` 실행

### 2. 데이터 수집

- `fetchEvents()`가 두 API를 병렬 호출
- 각 응답을 `UnifiedEventRecord`로 변환
- 중복 제거 후 `EventItem[]`로 반환

### 3. 홈 화면 표시

- `getFeaturedEvents(events)`로 상위 3개 추출
- 필터 조건으로 전체 리스트를 다시 계산

### 4. 상세 화면 표시

- 해시에서 `eventId` 추출
- `getEventById(events, id)`로 상세 대상 조회
- `getRelatedEvents()`로 유사 행사 표시

## Common Event Model

화면은 아래 구조만 알면 되도록 통일되어 있다.

```ts
type EventItem = {
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
```

## Duplicate Filtering

중복 제거 기준:

- 제목 정규화
- 지역 정규화
- 시작일

동일 기준으로 겹치면 더 정보가 풍부한 데이터를 우선 사용한다.

품질 판단 요소:

- 이미지 존재 여부
- 설명 존재 여부
- 상세 정보 개수
- 태그 존재 여부

## Current Constraints

- 라우터 라이브러리를 사용하지 않고 해시를 수동 처리한다.
- 상태 관리 라이브러리 없이 `App.tsx` 내부 상태로만 동작한다.
- 서버 백엔드가 없고, 개발 환경에서는 Vite 프록시로 외부 API를 우회한다.
- TourAPI는 날짜와 서울 지역 조건에 따라 실제 0건이 나올 수 있다.

## Recommended Next Split

파일이 커지면 아래처럼 나누는 것이 좋다.

- `src/components/`
- `src/features/events/`
- `src/lib/api/`
- `src/lib/router/`
- `src/types/`

우선 분리 후보:

- `EventDetail`
- 홈 리스트 카드 컴포넌트
- API fetcher
- 데이터 매퍼
- 날짜/중복 제거 유틸
