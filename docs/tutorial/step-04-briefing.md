# Step 4. 브리핑 화면 만들기

## 이번에 할 것

Mock API에서 데이터를 가져와서 KOSPI/KOSDAQ 지수와 헤드라인을 화면에 표시합니다.

## 완성 모습

```
📊 오늘의 주식 브리핑          2026.03.09
┌─────────────┐ ┌─────────────┐
│ KOSPI       │ │ KOSDAQ      │
│ 5620.31     │ │ 1189.56     │
│ 🚀 +87.44  │ │ 🚀 +23.12  │
└─────────────┘ └─────────────┘
┌─────────────────────────────┐
│ 미국 연준의 금리 인하 시사에...│
└─────────────────────────────┘
```

## 1. page.js 수정하기

`src/app/page.js`를 열어서 **전체 내용**을 아래로 바꾸세요.

```js
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 브리핑 가져오기
  async function fetchBriefing() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mock");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBriefing(data);
    } catch (e) {
      setBriefing(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBriefing();
  }, []);

  // 오늘 날짜
  const d = new Date();
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen flex-col max-w-lg mx-auto">
      {/* 헤더 */}
      <header className="flex items-center p-4 border-b border-slate-800 justify-between sticky top-0 z-50 bg-background-dark">
        <h1 className="text-slate-100 text-lg font-bold">
          📊 오늘의 주식 브리핑
        </h1>
        <span className="text-slate-400 text-xs">{dateStr}</span>
      </header>

      <main className="flex-1 p-4 space-y-5">
        {/* 에러 */}
        {error && (
          <div className="bg-card-bg rounded-xl border border-red-500/20 p-6 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={fetchBriefing}
              className="text-primary text-sm font-medium hover:underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 시장 지수 */}
        {loading ? (
          <p className="text-slate-400 text-sm text-center py-8">
            시장 정보 불러오는 중... ⏳
          </p>
        ) : (
          briefing && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {briefing.markets.map((m) => (
                  <div
                    key={m.name}
                    className="bg-card-bg rounded-xl p-4 border border-slate-800"
                  >
                    <span className="text-slate-400 text-xs font-semibold">
                      {m.name}
                    </span>
                    <div
                      className={`text-2xl font-bold mt-1 ${m.up ? "text-market-up" : "text-market-down"}`}
                    >
                      {m.value}
                    </div>
                    <span
                      className={`text-xs ${m.up ? "text-market-up/70" : "text-market-down/70"}`}
                    >
                      {m.up ? "🚀" : "💧"} {m.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* 헤드라인 */}
              <div className="bg-card-bg rounded-xl px-4 py-3 border border-slate-800">
                <p className="text-slate-200 text-sm leading-relaxed">
                  {briefing.headline}
                </p>
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
}
```

## 2. 코드 설명

길어 보이지만 크게 3파트입니다: **상태 관리**, **데이터 가져오기**, **화면 그리기**.

### 파트 1: 상태 관리

```js
"use client";
```
이 파일에서 버튼 클릭이나 상태 관리(`useState`)를 쓰겠다는 선언입니다.
Next.js에서 인터랙티브한 기능을 쓰려면 반드시 필요합니다.

```js
const [briefing, setBriefing] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

상태(state)란 "화면에서 바뀔 수 있는 값"입니다.

| 상태 | 초기값 | 역할 |
|------|--------|------|
| `briefing` | null | API에서 받아온 브리핑 데이터 |
| `loading` | true | 로딩 중인지 여부 |
| `error` | null | 에러 메시지 |

상태가 바뀌면 화면이 자동으로 업데이트됩니다.

### 파트 2: 데이터 가져오기

```js
async function fetchBriefing() {
  setLoading(true);         // 로딩 시작
  setError(null);           // 에러 초기화
  try {
    const res = await fetch("/api/mock");    // API 호출
    const data = await res.json();            // JSON으로 변환
    if (data.error) throw new Error(data.error);
    setBriefing(data);                        // 데이터 저장 → 화면 갱신
  } catch (e) {
    setBriefing(null);
    setError(e.message);                      // 에러 저장 → 에러 화면 표시
  } finally {
    setLoading(false);                        // 로딩 끝
  }
}
```

`try-catch-finally`는 에러 처리 패턴입니다:
- `try` — 이걸 해보고
- `catch` — 실패하면 이걸 하고
- `finally` — 성공이든 실패든 마지막에 이걸 해라

```js
useEffect(() => {
  fetchBriefing();
}, []);
```
페이지가 처음 열릴 때 `fetchBriefing()`을 자동으로 실행합니다.
`[]` (빈 배열)은 "처음 한 번만 실행"이라는 뜻입니다.

### 파트 3: 화면 그리기

```jsx
{loading ? (
  <p>시장 정보 불러오는 중... ⏳</p>
) : (
  briefing && (
    // 데이터 표시
  )
)}
```
이건 조건부 렌더링입니다:
- `loading`이 true면 → "불러오는 중" 표시
- `loading`이 false이고 `briefing`이 있으면 → 데이터 표시

```jsx
{briefing.markets.map((m) => (
  <div key={m.name}>
    <span>{m.name}</span>
    <div>{m.value}</div>
  </div>
))}
```
`markets` 배열의 각 항목(KOSPI, KOSDAQ)을 반복해서 카드로 만듭니다.
`key`는 React가 각 항목을 구별하기 위해 필요합니다.

```jsx
className={`text-2xl font-bold mt-1 ${m.up ? "text-market-up" : "text-market-down"}`}
```
`m.up`이 true면 빨간색(상승), false면 파란색(하락)을 적용합니다.
`${}` 안에 JavaScript 조건문을 넣을 수 있습니다.

## 확인하기

브라우저에서 http://localhost:3000 을 새로고침하세요.

- [ ] "시장 정보 불러오는 중... ⏳" 이 1~2초 보인다
- [ ] KOSPI, KOSDAQ 카드가 2열로 표시된다
- [ ] 지수 숫자가 빨간색 또는 파란색으로 보인다
- [ ] 헤드라인 텍스트가 보인다

다 됐으면 [Step 5. 종목 분석 기능 만들기](./step-05-stock-analysis.md)로 넘어가세요!
