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
      const res = await fetch("/api/report", { method: "POST" });
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
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "analyze", stock }),
      });
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
