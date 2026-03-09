# AI SDK + Gemini API 가이드

이 프로젝트에서 AI를 연동하는 방법을 설명합니다.

## 구조

```
사용자 → 프론트엔드(page.js) → API 라우트(route.js) → Google Gemini API
                                                          ↓
사용자 ← 프론트엔드(page.js) ← API 라우트(route.js) ← AI 응답
```

프론트엔드에서 직접 AI API를 호출하지 않고, API 라우트를 거칩니다.
이렇게 하면 API 키가 브라우저에 노출되지 않습니다.

## 사용하는 패키지

```json
{
  "ai": "^6.0.116",           // Vercel AI SDK (AI 연동 도구)
  "@ai-sdk/google": "^3.0.43"  // Google Gemini 연결용
}
```

- `ai` — 다양한 AI 모델을 동일한 방식으로 사용할 수 있게 해주는 SDK
- `@ai-sdk/google` — Google Gemini 모델 전용 어댑터

## API 키 설정

`.env.local` 파일에 API 키를 넣으면 자동으로 인식됩니다.

```
GOOGLE_GENERATIVE_AI_API_KEY=여기에-키-입력
```

> [Google AI Studio](https://aistudio.google.com/apikey)에서 무료로 발급받을 수 있습니다.

## 코드 설명

### 기본 설정

```js
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const MODEL = "gemini-2.5-flash-lite";
```

- `generateText` — AI에게 텍스트를 생성하게 하는 함수
- `google` — Google Gemini 모델을 사용하기 위한 함수
- `MODEL` — 사용할 모델 이름 (flash-lite는 가볍고 저렴한 모델)

### AI 호출

```js
const { text } = await generateText({
  model: google(MODEL),
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: "오늘 한국 주식시장 현황을 알려줘",
});
```

| 옵션 | 설명 |
|------|------|
| `model` | 어떤 AI 모델을 쓸지 |
| `tools` | AI가 사용할 도구 (여기서는 Google 검색) |
| `prompt` | AI에게 보내는 질문/명령 |

`tools`에 `googleSearch`를 넣으면 AI가 실시간 검색 결과를 참고해서 답변합니다.

### JSON 응답 파싱

AI는 텍스트로 응답하기 때문에, JSON 부분만 추출해야 합니다.

```js
// AI 응답에서 { } 로 감싸진 JSON 부분만 추출
const match = text.match(/\{[\s\S]*\}/);

if (!match) throw new Error("파싱 실패");

// 문자열 → JavaScript 객체로 변환
const data = JSON.parse(match[0]);

return Response.json(data);
```

### 프롬프트 작성법

AI에게 원하는 형식으로 답하게 하려면 프롬프트를 구체적으로 작성해야 합니다.

```
오늘 한국 주식시장 현황을 검색해서 아래 JSON 형식으로만 응답해.
다른 텍스트 없이 JSON만 출력해.

{
  "markets": [...],
  "headline": "..."
}
```

핵심 포인트:
- **"JSON 형식으로만 응답해"** — 다른 텍스트 없이 JSON만 달라고 명시
- **예시 형식을 보여줌** — AI가 정확한 구조로 응답하도록 유도
- **한국어로 요청** — 한국어 답변을 받기 위해

## mock API vs 실제 API

| | mock API | 실제 API |
|---|---|---|
| 경로 | `/api/mock` | `/api/report` |
| API 키 | 불필요 | 필요 |
| 데이터 | 고정 (5가지 시나리오) | 실시간 |
| 속도 | 1~2초 (인위적 지연) | 3~10초 |
| 비용 | 무료 | 호출당 약 0.17원 |

개발할 때는 mock API로 빠르게 작업하고, 완성 후 실제 API로 전환하면 됩니다.

프론트엔드에서 URL만 바꾸면 됩니다:

```js
// mock API 사용
const res = await fetch("/api/mock");

// 실제 API로 전환
const res = await fetch("/api/report");
```
