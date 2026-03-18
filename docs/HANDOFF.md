# PickSeoul Handoff

## Current State

이 프로젝트는 서울 행사 추천용 프론트엔드 프로토타입이다.  
현재 홈 화면의 `오늘의 행사 3가지`와 행사 리스트는 더미 데이터가 아니라 실제 API 데이터를 사용한다.

연결된 소스:

- 서울 열린데이터 광장
- 한국관광공사 TourAPI

## Run

```bash
npm install
npm run dev
```

개발 서버 기본 주소:

- `http://localhost:5173/`

## Required Environment Variables

`.env`에 아래 값을 넣어야 한다.

```env
VITE_SEOUL_API_KEY=
VITE_SEOUL_API_BASE_URL=http://openapi.seoul.go.kr:8088
VITE_TOUR_API_KEY=
VITE_TOUR_API_BASE_URL=https://apis.data.go.kr/B551011/KorService2
```

중요:

- 키는 코드에 직접 넣지 않는다.
- `.env` 변경 후에는 dev 서버를 재시작해야 한다.

## What Works Now

- 홈 화면 행사 데이터 로딩
- 오늘의 행사 3가지 표시
- 행사 리스트 표시
- 지역 / 카테고리 필터
- 해시 기반 상세 화면 이동
- 관련 행사 표시
- 두 API 데이터 공통 모델 변환
- 중복 제거

## How Data Is Built

`src/data/events.ts`가 중심이다.

처리 순서:

1. 서울 API 호출
2. TourAPI 호출
3. 각각 `EventItem` 계열 구조로 변환
4. 제목/지역/시작일 기준 중복 제거
5. 정렬 후 화면에 전달

실제 화면은 `src/App.tsx`가 모두 소비한다.

## Why Proxy Was Added

브라우저에서 외부 API를 직접 호출하면 `Failed to fetch`가 발생할 수 있었다.  
현재는 `vite.config.ts`에서 프록시를 사용해 개발 환경 요청을 우회한다.

프록시 경로:

- `/proxy/seoul`
- `/proxy/tour`

## Known Issues / Caveats

- TourAPI는 특정 날짜와 서울 지역 조건에 따라 실제 결과가 0건일 수 있다.
- 서울 열린데이터는 `http` 베이스 URL 기준으로 연결했다.
- 프로덕션 배포 환경에서는 Vite 개발 프록시가 없으므로 별도 백엔드 프록시 또는 서버 설정이 필요할 수 있다.
- 현재 상세 설명은 API 원문을 완전히 보존하지 않고 UI용 공통 형태로 일부 요약/가공한다.
- 전체 앱 로직이 `App.tsx`와 `src/data/events.ts`에 많이 몰려 있다.

## Important Files

- [src/App.tsx](/home/user/pickseoul/src/App.tsx)
  화면 상태, 홈/상세 라우팅, 필터, 렌더링
- [src/data/events.ts](/home/user/pickseoul/src/data/events.ts)
  API 호출, 데이터 변환, 중복 제거, 목록/상세 조회 유틸
- [vite.config.ts](/home/user/pickseoul/vite.config.ts)
  개발용 API 프록시
- [.env.example](/home/user/pickseoul/.env.example)
  환경변수 템플릿

## If You Need To Extend Next

우선순위 높은 다음 작업:

- 상세 화면에 원문 설명 더 풍부하게 반영
- TourAPI 결과가 0건일 때의 fallback UX 개선
- API 응답 캐싱
- 에러 메시지 구체화
- 화면 컴포넌트 분리
- 배포 환경용 서버 프록시 구성

## Quick Debug Checklist

행사 데이터가 안 보일 때:

1. `.env`가 있는지 확인
2. `VITE_SEOUL_API_KEY`, `VITE_TOUR_API_KEY`가 채워져 있는지 확인
3. dev 서버를 재시작했는지 확인
4. 브라우저 네트워크 탭에서 `/proxy/seoul`, `/proxy/tour` 응답 확인
5. TourAPI는 실제 0건일 수 있으므로 서울 API 응답이 오는지 먼저 확인

## Validation Done

최근 작업 기준 확인한 항목:

- `npm run lint`
- `npm run build`

Node 경고:

- 현재 환경에서 Vite는 Node `20.19+` 또는 `22.12+`를 권장한다.
