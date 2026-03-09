# Step 5. 종목 분석 기능 만들기

## 이번에 할 것

종목 버튼을 누르면 AI 분석 결과(시장 분위기 + 핵심 요약)를 보여주는 기능을 추가합니다.

## 완성 모습

```
🎯 종목 분석
[삼성전자] [SK하이닉스] [LG에너지솔루션] ...

┌──────────────────────────────┐
│ 삼성전자                  ✅ │
│ AI 분석 결과                 │
│                              │
│ 시장 분위기           72%    │
│ ████████████░░░░░            │
│ 긍정                   부정  │
├──────────────────────────────┤
│ 핵심 요약                    │
│ 👍 HBM3E 양산 본격화...     │
│ 📈 외국인 순매수 5거래일...  │
│ 📰 갤럭시 S26 사전 예약...   │
│ ⚠️ 중국 스마트폰 시장...    │
│──────────────────────────────│
│ 삼성전자는 메모리 반도체...   │
└──────────────────────────────┘
```

## 1. page.js 수정하기

`src/app/page.js`를 열어서 **전체 내용**을 아래로 바꾸세요.

이전 단계의 코드에 종목 분석 기능이 추가됩니다.

```js
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

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

  // 종목 분석
  async function fetchAnalysis(stock) {
    setSelected(stock);
    setAnalyzing(true);
    setAnalysis(null);
    setError(null);

    try {
      const res = await fetch(`/api/mock?stock=${stock}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (e) {
      setAnalysis(null);
      setError(e.message);
    } finally {
      setAnalyzing(false);
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

        {/* 종목 선택 */}
        <section>
          <h2 className="text-slate-100 text-sm font-bold mb-3">
            🎯 종목 분석
          </h2>
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {loading ? (
              <p className="text-slate-500 text-xs">종목 불러오는 중...</p>
            ) : (
              (briefing?.hotStocks || []).map((stock) => (
                <button
                  key={stock}
                  onClick={() => fetchAnalysis(stock)}
                  className={`flex-none px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                    selected === stock
                      ? "border-2 border-primary bg-primary/10 text-primary font-bold"
                      : "border border-slate-800 bg-card-bg text-slate-400 font-medium hover:border-slate-600"
                  }`}
                >
                  {stock}
                </button>
              ))
            )}
          </div>
        </section>

        {/* 분석 결과 */}
        {!selected && (
          <div className="bg-card-bg rounded-xl border border-slate-800 p-12 text-center">
            <p className="text-4xl mb-4">👆</p>
            <p className="text-slate-500 text-sm">
              궁금한 종목을 눌러보세요!
            </p>
          </div>
        )}

        {selected && (analyzing || analysis) && (
          <div className="bg-card-bg rounded-xl border border-slate-800 overflow-hidden">
            {/* 패널 헤더 */}
            <div className="p-5 border-b border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg font-bold">{selected}</h3>
                  <p className="text-slate-400 text-xs">AI 분석 결과</p>
                </div>
                <span className="text-2xl">
                  {analyzing ? "⏳" : "✅"}
                </span>
              </div>

              {/* 시장 분위기 */}
              {analyzing ? (
                <p className="text-slate-400 text-sm">분석 중...</p>
              ) : (
                analysis && (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-slate-300 text-xs">
                        시장 분위기
                      </span>
                      <span className="text-primary text-sm font-bold">
                        {analysis.sentiment}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${analysis.sentiment}%` }}
                      />
                      <div
                        className="h-full bg-red-500/40"
                        style={{ width: `${100 - analysis.sentiment}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-500">긍정</span>
                      <span className="text-[10px] text-slate-500">부정</span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* 핵심 요약 */}
            <div className="p-5">
              <h4 className="text-slate-100 text-sm font-bold mb-4">
                핵심 요약
              </h4>

              {analyzing ? (
                <p className="text-slate-400 text-sm">AI가 분석하는 중...</p>
              ) : (
                analysis && (
                  <>
                    <ul className="space-y-3">
                      {analysis.insights.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="flex-shrink-0">
                            {item.type === "warning" ? "⚠️" :
                             item.type === "positive" ? "👍" :
                             item.type === "trend" ? "📈" : "📰"}
                          </span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {item.text}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 pt-4 border-t border-slate-800 text-slate-400 text-xs leading-relaxed">
                      {analysis.summary}
                    </p>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
```

## 2. 이전 단계에서 추가된 부분 설명

### 새로운 상태 3개

```js
const [selected, setSelected] = useState(null);      // 선택한 종목명
const [analysis, setAnalysis] = useState(null);       // 분석 결과 데이터
const [analyzing, setAnalyzing] = useState(false);    // 분석 중인지 여부
```

### 종목 분석 함수

```js
async function fetchAnalysis(stock) {
  setSelected(stock);       // 어떤 종목을 선택했는지 기억
  setAnalyzing(true);       // "분석 중" 상태로 변경
  setAnalysis(null);        // 이전 분석 결과 지우기

  try {
    const res = await fetch(`/api/mock?stock=${stock}`);
    // ↑ 예: /api/mock?stock=삼성전자
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setAnalysis(data);      // 분석 결과 저장
  } catch (e) {
    setAnalysis(null);
    setError(e.message);
  } finally {
    setAnalyzing(false);    // "분석 중" 해제
  }
}
```

`fetchBriefing`과 구조가 거의 같습니다. URL에 `?stock=종목명`이 추가된 것만 다릅니다.

### 종목 버튼

```jsx
{(briefing?.hotStocks || []).map((stock) => (
  <button
    key={stock}
    onClick={() => fetchAnalysis(stock)}
    className={`... ${
      selected === stock
        ? "선택된 스타일"
        : "기본 스타일"
    }`}
  >
    {stock}
  </button>
))}
```

- `briefing?.hotStocks` — briefing이 있으면 hotStocks를 가져오고, 없으면 undefined
- `|| []` — undefined면 빈 배열 사용 (에러 방지)
- `onClick={() => fetchAnalysis(stock)}` — 버튼 클릭하면 해당 종목 분석
- 선택된 종목은 파란색 테두리로 강조

### 시장 분위기 바

```jsx
<div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
  <div
    className="h-full bg-primary"
    style={{ width: `${analysis.sentiment}%` }}
  />
  <div
    className="h-full bg-red-500/40"
    style={{ width: `${100 - analysis.sentiment}%` }}
  />
</div>
```

`sentiment`가 72면:
- 파란색 바가 72% 너비
- 빨간색 바가 28% 너비

`style={{ width: "72%" }}`처럼 JavaScript 값을 CSS로 넘길 수 있습니다.

### 인사이트 이모지 분기

```jsx
{item.type === "warning" ? "⚠️" :
 item.type === "positive" ? "👍" :
 item.type === "trend" ? "📈" : "📰"}
```

type에 따라 다른 이모지를 보여줍니다. 삼항 연산자를 여러 개 연결한 형태입니다:
- warning이면 ⚠️
- positive면 👍
- trend면 📈
- 그 외(news)면 📰

## 확인하기

브라우저에서 http://localhost:3000 을 새로고침하세요.

- [ ] 종목 버튼들이 가로로 나열된다
- [ ] 종목을 선택하기 전에 "👆 궁금한 종목을 눌러보세요!" 가 보인다
- [ ] 종목 버튼을 클릭하면 "분석 중..." → 분석 결과가 표시된다
- [ ] 선택한 종목 버튼이 파란색으로 바뀐다
- [ ] 시장 분위기 바가 표시된다
- [ ] 인사이트 목록이 이모지와 함께 표시된다

다 됐으면 [Step 6. 소개 페이지 만들기](./step-06-about-page.md)로 넘어가세요!
