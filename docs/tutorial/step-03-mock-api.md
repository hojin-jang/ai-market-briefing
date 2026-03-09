# Step 3. Mock API 만들기

## 이번에 할 것

화면에 보여줄 가짜 데이터를 제공하는 API를 만듭니다.
실제 AI API 연결은 나중에 하고, 먼저 화면 개발에 집중하기 위해서입니다.

## API란?

API는 "데이터를 주고받는 창구"라고 생각하면 됩니다.

```
브라우저에서 /api/mock 으로 요청하면
→ 서버가 주식 데이터를 JSON으로 돌려줌
```

Next.js에서는 `api` 폴더에 파일을 만들면 자동으로 API가 됩니다.

## 1. API 폴더 만들기

`src/app/api/mock/` 폴더를 만들고 그 안에 `route.js` 파일을 만드세요.

```
src/app/api/mock/route.js
```

> 폴더 경로가 곧 API 주소가 됩니다.
> `api/mock/route.js` → `http://localhost:3000/api/mock`

## 2. Mock API 코드 작성

`src/app/api/mock/route.js`에 아래 내용을 넣으세요.

```js
const BRIEFING = {
  markets: [
    { name: "KOSPI", value: "5620.31", change: "+87.44 (+1.58%)", up: true },
    { name: "KOSDAQ", value: "1189.56", change: "+23.12 (+1.98%)", up: true },
  ],
  headline:
    "미국 연준의 금리 인하 시사에 글로벌 증시가 동반 상승하며 코스피가 1.58% 올랐습니다. 외국인이 1조 2천억 원 순매수하며 반도체·2차전지 섹터가 강세를 보였고, 기관도 매수 우위를 기록했습니다.",
  hotStocks: ["삼성전자", "SK하이닉스", "LG에너지솔루션", "NAVER", "카카오"],
};

const ANALYSIS = {
  삼성전자: {
    sentiment: 72,
    summary:
      "삼성전자는 메모리 반도체 업황 회복과 AI 서버용 HBM 수요 증가로 긍정적 흐름을 보이고 있다. 최근 분기 실적이 시장 기대치를 상회하며 외국인 매수세가 이어지고 있다.",
    insights: [
      { type: "positive", text: "HBM3E 양산 본격화로 AI 반도체 매출 증가 기대" },
      { type: "trend", text: "외국인 순매수 5거래일 연속 지속" },
      { type: "news", text: "갤럭시 S26 시리즈 사전 예약 역대 최고 기록" },
      { type: "warning", text: "중국 스마트폰 시장 점유율 하락 추세 지속" },
    ],
  },
};

function makeDefault(stock) {
  return {
    sentiment: 55,
    summary: stock + "은(는) 현재 시장 평균 수준의 흐름을 보이고 있다. 업종 내 경쟁 상황과 글로벌 경기 동향에 따라 향후 방향성이 결정될 전망이다.",
    insights: [
      { type: "trend", text: stock + " 업종 평균 수준의 거래량 유지 중" },
      { type: "news", text: stock + " 다음 분기 실적 발표 예정" },
      { type: "positive", text: stock + " 최근 신규 사업 진출 발표로 관심 증가" },
      { type: "warning", text: "글로벌 경기 불확실성에 따른 변동성 주의" },
    ],
  };
}

export async function GET(req) {
  // 1~2초 기다리기 (실제 API처럼 보이게)
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

  // URL에서 stock 파라미터 가져오기
  // 예: /api/mock?stock=삼성전자 → stock = "삼성전자"
  const stock = new URL(req.url).searchParams.get("stock");

  // stock 파라미터가 있으면 → 종목 분석 응답
  if (stock) {
    return Response.json(ANALYSIS[stock] || makeDefault(stock));
  }

  // stock 파라미터가 없으면 → 브리핑 응답
  return Response.json(BRIEFING);
}
```

### 이 코드가 하는 일

**데이터 준비 (위쪽)**

`BRIEFING` — 시장 브리핑 데이터입니다.
- `markets` — KOSPI, KOSDAQ 지수 정보
- `headline` — 오늘의 시장 요약
- `hotStocks` — 오늘의 주요 종목 목록

`ANALYSIS` — 종목별 분석 데이터입니다.
- `sentiment` — 시장 분위기 (0~100, 높을수록 긍정)
- `summary` — 분석 요약
- `insights` — 핵심 포인트들 (type: positive/trend/news/warning)

**API 함수 (아래쪽)**

```js
export async function GET(req) {
```
`GET` 함수를 export하면 이 파일이 GET 요청을 처리하는 API가 됩니다.

```js
await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
```
1~2초 기다립니다. 실제 AI API도 응답에 시간이 걸리기 때문에, 비슷한 느낌을 주기 위해서입니다.

```js
const stock = new URL(req.url).searchParams.get("stock");
```
URL에서 `?stock=삼성전자` 부분을 읽어옵니다.
- `/api/mock` → stock은 null
- `/api/mock?stock=삼성전자` → stock은 "삼성전자"

```js
if (stock) {
  return Response.json(ANALYSIS[stock] || makeDefault(stock));
}
return Response.json(BRIEFING);
```
- stock이 있으면 → 종목 분석 데이터를 응답
- stock이 없으면 → 브리핑 데이터를 응답
- `ANALYSIS[stock]`에 데이터가 없는 종목은 `makeDefault(stock)`으로 기본 데이터를 만들어서 응답

## 확인하기

브라우저에서 직접 API를 호출해볼 수 있습니다:

1. http://localhost:3000/api/mock 접속 → 브리핑 JSON이 보인다
2. http://localhost:3000/api/mock?stock=삼성전자 접속 → 삼성전자 분석 JSON이 보인다

- [ ] 브리핑 API가 JSON을 반환한다
- [ ] 종목 분석 API가 JSON을 반환한다

다 됐으면 [Step 4. 브리핑 화면 만들기](./step-04-briefing.md)로 넘어가세요!
