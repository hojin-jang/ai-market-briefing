# 📊 오늘의 주식 브리핑

AI가 오늘의 한국 주식시장을 분석해서 알려주는 웹앱입니다.

## 주요 기능

- KOSPI / KOSDAQ 실시간 지수 확인
- AI가 요약해주는 오늘의 시장 헤드라인
- 종목별 AI 분석 (시장 분위기 + 핵심 요약)

## 기술 스택

- **[Next.js](https://nextjs.org/docs)** — React 기반 풀스택 프레임워크
- **[TailwindCSS](https://tailwindcss.com/docs)** — 유틸리티 CSS 프레임워크 ([기초 가이드](./docs/tailwind-guide.md))
- **[Google Gemini API](https://ai.google.dev/gemini-api/docs)** — AI 분석 ([Vercel AI SDK](https://sdk.vercel.ai/docs) 사용)
- **[React](https://react.dev/learn)** — UI 라이브러리

## 처음부터 따라 만들기

> 코딩 경험이 없어도 하루 만에 완성할 수 있는 단계별 튜토리얼입니다.

**[Step 1. 프로젝트 만들기](./docs/tutorial/step-01-setup.md)** → 환경 세팅 + 첫 실행

**[Step 2. 레이아웃과 스타일](./docs/tutorial/step-02-layout.md)** → 다크 테마 + 헤더

**[Step 3. Mock API 만들기](./docs/tutorial/step-03-mock-api.md)** → 가짜 데이터 API

**[Step 4. 브리핑 화면 만들기](./docs/tutorial/step-04-briefing.md)** → 시장 지수 + 헤드라인

**[Step 5. 종목 분석 기능](./docs/tutorial/step-05-stock-analysis.md)** → 종목별 AI 분석

**[Step 6. 소개 페이지](./docs/tutorial/step-06-about-page.md)** → 페이지 이동

**[Step 7. 실제 AI 연결](./docs/tutorial/step-07-real-api.md)** → Google Gemini API

**[Step 8. 배포하기](./docs/tutorial/step-08-deploy.md)** → Vercel로 인터넷에 올리기

**[다음 도전: 새 프로젝트 아이디어](./docs/tutorial/next-projects.md)** → 혼자 만들어보기

---

## 시작하기 (완성된 코드 실행)

### 1. 프로젝트 클론

```bash
git clone https://github.com/hojin-jang/ai-market-briefing.git
cd ai-market-briefing
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어서 Google AI API 키를 넣어주세요.

```
GOOGLE_GENERATIVE_AI_API_KEY=여기에-API-키-입력
```

> API 키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 무료로 발급받을 수 있습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.js          # 공통 레이아웃 (폰트, 배경색)
│   ├── globals.css         # 글로벌 스타일
│   ├── page.js             # 메인 페이지 (브리핑 + 종목 분석)
│   ├── about/
│   │   └── page.js         # 소개 페이지
│   └── api/
│       ├── report/
│       │   └── route.js    # 실제 AI API (Gemini)
│       └── mock/
│           └── route.js    # 연습용 mock API
```

## API 명세

### 기본 URL

- 개발: `http://localhost:3000`
- mock API: `/api/mock` (API 키 없이 사용 가능)
- 실제 API: `/api/report` (API 키 필요)

> 처음에는 `/api/mock`으로 개발하고, 완성되면 `/api/report`로 바꾸면 됩니다.

### 시장 브리핑

```
GET /api/mock
```

**응답 예시:**

```json
{
  "markets": [
    { "name": "KOSPI", "value": "5620.31", "change": "+87.44 (+1.58%)", "up": true },
    { "name": "KOSDAQ", "value": "1189.56", "change": "+23.12 (+1.98%)", "up": true }
  ],
  "headline": "미국 연준의 금리 인하 시사에 글로벌 증시가 동반 상승하며...",
  "hotStocks": ["삼성전자", "SK하이닉스", "LG에너지솔루션", "NAVER", "카카오"]
}
```

### 종목 분석

```
GET /api/mock?stock=삼성전자
```

**응답 예시:**

```json
{
  "sentiment": 72,
  "summary": "삼성전자는 메모리 반도체 업황 회복과 AI 서버용 HBM 수요 증가로...",
  "insights": [
    { "type": "positive", "text": "HBM3E 양산 본격화로 AI 반도체 매출 증가 기대" },
    { "type": "trend", "text": "외국인 순매수 5거래일 연속 지속" },
    { "type": "news", "text": "갤럭시 S26 시리즈 사전 예약 역대 최고 기록" },
    { "type": "warning", "text": "중국 스마트폰 시장 점유율 하락 추세 지속" }
  ]
}
```

### 에러 응답

```json
{ "error": "\"종목명\" 종목은 지원하지 않습니다" }
```

### 응답 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `markets[].name` | string | 지수 이름 (KOSPI, KOSDAQ) |
| `markets[].value` | string | 현재 지수 |
| `markets[].change` | string | 등락폭 |
| `markets[].up` | boolean | 상승이면 true |
| `headline` | string | 오늘의 시장 요약 |
| `hotStocks` | string[] | 오늘의 주요 종목 목록 |
| `sentiment` | number | 시장 분위기 (0~100) |
| `summary` | string | 종목 분석 요약 |
| `insights[].type` | string | positive, trend, news, warning |
| `insights[].text` | string | 인사이트 내용 |

## 학습 자료

이 프로젝트의 코드를 기반으로 설명한 가이드입니다.

- [Next.js 가이드](./docs/nextjs-guide.md) — 라우팅, 레이아웃, API 라우트, "use client"
- [React 가이드](./docs/react-guide.md) — useState, useEffect, 조건부 렌더링, fetch
- [TailwindCSS 가이드](./docs/tailwind-guide.md) — 자주 쓰는 클래스, CSS와 비교
- [AI SDK + Gemini 가이드](./docs/ai-sdk-guide.md) — AI 연동, 프롬프트 작성, mock vs 실제 API
