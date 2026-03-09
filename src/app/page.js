"use client";

import { useState, useEffect } from "react";

const ICON_MAP = {
  positive: "check_circle",
  trend: "trending_up",
  news: "new_releases",
  warning: "warning",
};

const STOCKS = [
  "삼성전자",
  "SK하이닉스",
  "현대자동차",
  "NAVER",
  "카카오",
  "LG에너지솔루션",
  "셀트리온",
];

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
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            insights
          </span>
          <h1 className="text-slate-100 text-lg font-bold tracking-tight">
            AI Market Briefing
          </h1>
        </div>
        <span className="text-slate-400 text-xs">{dateStr}</span>
      </header>

      <main className="flex-1 p-4 space-y-5">
        {/* 에러 */}
        {error && (
          <div className="bg-card-bg rounded-xl border border-red-500/20 p-6 text-center">
            <span className="material-symbols-outlined text-red-400 text-3xl mb-2 block">
              error
            </span>
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
          <div className="grid grid-cols-2 gap-3 animate-pulse">
            <div className="bg-card-bg rounded-xl p-4 border border-slate-800 h-24" />
            <div className="bg-card-bg rounded-xl p-4 border border-slate-800 h-24" />
          </div>
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
                      {m.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* 헤드라인 */}
              <div className="bg-card-bg rounded-xl px-4 py-3 border border-slate-800">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">
                    breaking_news
                  </span>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">
                    {briefing.headline}
                  </p>
                </div>
              </div>
            </>
          )
        )}

        {/* 종목 선택 */}
        <section>
          <h2 className="text-slate-100 text-sm font-bold flex items-center gap-1 mb-3">
            <span className="material-symbols-outlined text-primary text-lg">
              local_fire_department
            </span>
            종목 분석
          </h2>
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {STOCKS.map((stock) => (
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
            ))}
          </div>
        </section>

        {/* 분석 결과 */}
        {!selected && (
          <div className="bg-card-bg rounded-xl border border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-slate-600 text-5xl mb-4 block">
              psychology
            </span>
            <p className="text-slate-500 text-sm">
              종목을 선택하면 AI 분석이 시작됩니다
            </p>
          </div>
        )}

        {selected && (analyzing || analysis) && (
          <div className="bg-card-bg rounded-xl border border-slate-800 shadow-xl overflow-hidden">
            {/* 패널 헤더 */}
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg font-bold">{selected}</h3>
                  <p className="text-slate-400 text-xs">AI Insight Analysis</p>
                </div>
                <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                  <span
                    className={`material-symbols-outlined text-primary ${analyzing ? "animate-spin" : ""}`}
                  >
                    {analyzing ? "progress_activity" : "psychology"}
                  </span>
                </div>
              </div>

              {/* 센티먼트 바 */}
              {analyzing ? (
                <div className="animate-pulse">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-slate-700 rounded w-24" />
                    <div className="h-3 bg-slate-700 rounded w-20" />
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full" />
                </div>
              ) : (
                analysis && (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-slate-300 text-xs font-medium">
                        Market Sentiment
                      </span>
                      <span className="text-primary text-sm font-bold">
                        {analysis.sentiment}% Positive
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
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                        Bullish
                      </span>
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                        Bearish
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* 인사이트 */}
            <div className="p-5">
              <h4 className="text-slate-100 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-3 bg-primary rounded-full" />
                Key Summary Report
              </h4>

              {analyzing ? (
                <div className="space-y-4 animate-pulse">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-5 h-5 bg-slate-700 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-700 rounded w-full" />
                        <div className="h-3 bg-slate-700 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                analysis && (
                  <>
                    <ul className="space-y-4">
                      {analysis.insights.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span
                            className={`material-symbols-outlined text-lg flex-shrink-0 mt-0.5 ${
                              item.type === "warning"
                                ? "text-amber-500"
                                : "text-primary"
                            }`}
                          >
                            {ICON_MAP[item.type] || "info"}
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
