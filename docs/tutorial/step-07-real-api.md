# Step 7. 실제 AI API 연결하기

## 이번에 할 것

Mock API 대신 진짜 Google Gemini AI를 연결해서 실시간 주식 분석을 받아옵니다.

## 1. 패키지 설치

터미널에서 아래 명령어를 실행하세요. (개발 서버는 Ctrl+C로 먼저 종료)

```bash
npm install ai @ai-sdk/google
```

- `ai` — Vercel AI SDK (다양한 AI 모델을 쉽게 연동하는 도구)
- `@ai-sdk/google` — Google Gemini 모델을 사용하기 위한 패키지

## 2. API 키 발급

1. [Google AI Studio](https://aistudio.google.com/apikey)에 접속
2. Google 계정으로 로그인
3. "Get API key" (또는 "API 키 가져오기") 클릭
4. "Create API key" (또는 "API 키 만들기") 클릭
5. 생성된 키를 복사

> 처음 접속하면 이용약관 동의 화면이 나올 수 있습니다. 동의하고 진행하세요.

## 3. 환경변수 설정

프로젝트 최상위 폴더에 `.env.local` 파일을 만드세요.

```
GOOGLE_GENERATIVE_AI_API_KEY=여기에-복사한-API-키-붙여넣기
```

> `.env.local`은 비밀 정보를 저장하는 파일입니다.
> `.gitignore`에 이미 포함되어 있어서 GitHub에 올라가지 않습니다.
> 절대로 API 키를 코드에 직접 넣지 마세요!

## 4. API 라우트 만들기

`src/app/api/report/` 폴더를 만들고, 그 안에 `route.js` 파일을 만드세요.

```
src/app/api/report/route.js
```

아래 내용을 넣으세요.

```js
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const MODEL = "gemini-2.5-flash-lite";

export async function GET(req) {
  try {
    const stock = new URL(req.url).searchParams.get("stock");

    // 종목 분석
    if (stock) {
      const { text } = await generateText({
        model: google(MODEL),
        tools: {
          google_search: google.tools.googleSearch({}),
        },
        prompt: `너는 한국 주식시장 전문 애널리스트야.
"${stock}" 종목의 최신 정보를 검색해서 분석한 뒤, 아래 JSON 형식으로만 응답해.
다른 텍스트 없이 JSON만 출력해.

{
  "sentiment": 0~100 사이 숫자 (시장 긍정도),
  "summary": "현재 상황과 전망을 3~4문장으로 상세히 분석",
  "insights": [
    { "type": "positive 또는 trend 또는 news 또는 warning", "text": "구체적인 인사이트 내용" }
  ]
}

insights는 3~4개, 최신 뉴스와 실적 데이터를 반영해줘. 모든 텍스트는 한국어로.`,
      });

      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("분석 파싱 실패");
      return Response.json(JSON.parse(match[0]));
    }

    // 시장 브리핑
    const { text } = await generateText({
      model: google(MODEL),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt: `오늘 한국 주식시장 현황을 검색해서 아래 JSON 형식으로만 응답해.
다른 텍스트 없이 JSON만 출력해.
검색해서 나온 실제 수치를 그대로 사용하고, 임의로 만들지 마.

{
  "markets": [
    { "name": "KOSPI", "value": "실제 지수", "change": "+00.00 (+0.00%)", "up": true또는false },
    { "name": "KOSDAQ", "value": "실제 지수", "change": "+00.00 (+0.00%)", "up": true또는false }
  ],
  "headline": "오늘 시장의 핵심 흐름과 배경을 3~4문장으로 상세히 설명. 어떤 섹터가 강세/약세였는지, 외국인/기관 매매 동향, 글로벌 요인 등을 포함해서 한국어로 작성",
  "hotStocks": ["오늘 주목할 종목 6~8개를 종목명만 배열로"]
}`,
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("브리핑 파싱 실패");
    return Response.json(JSON.parse(match[0]));
  } catch (error) {
    console.error("Report error:", error);
    return Response.json(
      { error: error.message || "요청 실패" },
      { status: 500 }
    );
  }
}
```

### 이 코드가 하는 일

**AI SDK 설정**

```js
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const MODEL = "gemini-2.5-flash-lite";
```

- `generateText` — AI에게 텍스트를 생성하게 하는 함수
- `google` — Google Gemini 모델을 사용하기 위한 함수
- `gemini-2.5-flash-lite` — 빠르고 저렴한 모델 (호출당 약 0.17원)

**AI 호출**

```js
const { text } = await generateText({
  model: google(MODEL),
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: `오늘 한국 주식시장 현황을...`,
});
```

- `model` — 어떤 AI 모델을 쓸지
- `tools` — AI가 Google 검색을 사용할 수 있게 허용 (실시간 데이터)
- `prompt` — AI에게 보내는 명령

**JSON 추출**

```js
const match = text.match(/\{[\s\S]*\}/);
if (!match) throw new Error("파싱 실패");
return Response.json(JSON.parse(match[0]));
```

AI는 텍스트로 응답하기 때문에, `{ }` 으로 감싸진 JSON 부분만 추출합니다.
- `text.match(...)` — 텍스트에서 JSON 부분을 찾기
- `JSON.parse(...)` — 문자열을 JavaScript 객체로 변환
- `Response.json(...)` — JSON으로 응답

## 5. 프론트엔드 API 주소 변경

`src/app/page.js`에서 fetch URL을 바꿔야 합니다.

두 군데를 찾아서 변경하세요:

```js
// 변경 전
const res = await fetch("/api/mock");

// 변경 후
const res = await fetch("/api/report");
```

```js
// 변경 전
const res = await fetch(`/api/mock?stock=${stock}`);

// 변경 후
const res = await fetch(`/api/report?stock=${stock}`);
```

> `/api/mock` → `/api/report`로 바꾸면 됩니다. 딱 2군데입니다.

## 6. 서버 재시작

```bash
npm run dev
```

## 확인하기

- [ ] 페이지를 열면 실제 KOSPI/KOSDAQ 지수가 표시된다
- [ ] 헤드라인이 오늘의 실제 시장 상황을 설명한다
- [ ] 종목 버튼이 오늘의 실제 주요 종목으로 표시된다
- [ ] 종목을 클릭하면 실제 AI 분석 결과가 나온다

> 응답이 3~10초 정도 걸릴 수 있습니다. AI가 Google 검색을 하고 분석하는 시간입니다.

다 됐으면 [Step 8. Vercel로 배포하기](./step-08-deploy.md)로 넘어가세요!
