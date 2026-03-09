"use client";

import { useState, useCallback, useEffect } from "react";

interface MarketIndex {
  name: string;
  value: string;
  change: string;
  up: boolean;
  summary: string;
}

interface HotStock {
  name: string;
  reason: string;
}

interface Briefing {
  markets: MarketIndex[];
  headline: string;
  hotStocks: HotStock[];
}

interface Insight {
  type: "positive" | "trend" | "news" | "warning";
  text: string;
}

interface Analysis {
  sentiment: number;
  summary: string;
  insights: Insight[];
}

const ICON_MAP: Record<string, string> = {
  positive: "check_circle",
  trend: "trending_up",
  news: "new_releases",
  warning: "warning",
};

function formatDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function Home() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(true);
  const [briefingError, setBriefingError] = useState<string | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefing = useCallback(async () => {
    setBriefingLoading(true);
    setBriefingError(null);
    try {
      const res = await fetch("/api/briefing", { method: "POST" });
      if (!res.ok) throw new Error("브리핑 요청 실패");
      const data: Briefing = await res.json();
      setBriefing(data);
    } catch (e) {
      setBriefingError(
        e instanceof Error ? e.message : "브리핑을 불러올 수 없습니다"
      );
    } finally {
      setBriefingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  const analyze = useCallback(
    async (stock: string) => {
      if (stock === selected && analysis) return;
      setSelected(stock);
      setLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "분석 요청 실패");
        }
        const data: Analysis = await res.json();
        setAnalysis(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "분석 중 오류가 발생했습니다"
        );
      } finally {
        setLoading(false);
      }
    },
    [selected, analysis]
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-slate-800 justify-between sticky top-0 z-50 bg-background-dark">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            insights
          </span>
          <h1 className="text-slate-100 text-lg font-bold leading-tight tracking-tight">
            AI Market Briefing
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-slate-400 text-xs font-medium">{formatDate()}</p>
          <button
            onClick={() => {
              fetchBriefing();
              setSelected(null);
              setAnalysis(null);
            }}
            disabled={briefingLoading}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full border border-slate-700 transition-colors disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-primary text-sm ${briefingLoading ? "animate-spin" : ""}`}
            >
              {briefingLoading ? "progress_activity" : "refresh"}
            </span>
            <span className="text-slate-300 text-[10px] font-bold">
              새로고침
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-8">
        {/* Market Summary Cards */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {briefingLoading
            ? [0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-card-bg rounded-xl p-4 border border-slate-800 shadow-sm animate-pulse"
                >
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-slate-700 rounded w-14" />
                    <div className="h-3 bg-slate-700 rounded w-12" />
                  </div>
                  <div className="h-7 bg-slate-700 rounded w-28 mb-3" />
                  <div className="h-2.5 bg-slate-700 rounded w-full" />
                </div>
              ))
            : briefing?.markets.map((m) => (
                <div
                  key={m.name}
                  className="bg-card-bg rounded-xl p-4 border border-slate-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-slate-400 text-xs font-semibold">
                      {m.name}
                    </span>
                    <span
                      className={`text-xs font-bold ${m.up ? "text-market-up" : "text-market-down"}`}
                    >
                      {m.change}
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold mb-2 ${m.up ? "text-market-up" : "text-market-down"}`}
                  >
                    {m.value}
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight">
                    {m.summary}
                  </p>
                </div>
              ))}
        </div>

        {/* Headline */}
        <div className="px-4 mb-4">
          {briefingLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-full mb-1.5" />
              <div className="h-4 bg-slate-700 rounded w-2/3" />
            </div>
          ) : briefingError ? (
            <div className="bg-card-bg rounded-xl border border-red-500/20 p-4 text-center">
              <p className="text-red-400 text-sm mb-2">{briefingError}</p>
              <button
                onClick={fetchBriefing}
                className="text-primary text-xs font-medium hover:underline"
              >
                다시 시도
              </button>
            </div>
          ) : briefing ? (
            <div className="bg-card-bg rounded-lg px-4 py-3 border border-slate-800">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5 flex-shrink-0">
                  breaking_news
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {briefing.headline}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Hot Stocks */}
        <section className="mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-slate-100 text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-lg">
                local_fire_department
              </span>
              Hot Stocks
            </h3>
          </div>
          <div className="flex overflow-x-auto gap-2 px-4 pb-2 no-scrollbar">
            {briefingLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex-none h-9 w-24 bg-card-bg rounded-full border border-slate-800 animate-pulse"
                  />
                ))
              : (briefing?.hotStocks ?? []).map((stock) => (
                  <button
                    key={stock.name}
                    onClick={() => analyze(stock.name)}
                    title={stock.reason}
                    className={`flex-none px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                      selected === stock.name
                        ? "border-2 border-primary bg-primary/10 text-primary font-bold"
                        : "border border-slate-800 bg-card-bg text-slate-400 font-medium hover:border-slate-600"
                    }`}
                  >
                    {stock.name}
                  </button>
                ))}
          </div>
        </section>

        {/* AI Insight Panel */}
        <section className="px-4">
          {!selected && !loading && (
            <div className="bg-card-bg rounded-xl border border-slate-800 p-12 text-center">
              <span className="material-symbols-outlined text-slate-600 text-5xl mb-4 block">
                psychology
              </span>
              <p className="text-slate-500 text-sm">
                종목을 선택하면 AI 분석이 시작됩니다
              </p>
            </div>
          )}

          {selected && (loading || analysis || error) && (
            <div className="bg-card-bg rounded-xl border border-slate-800 shadow-xl overflow-hidden">
              {/* Panel Header */}
              <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white text-lg font-bold">
                      {selected}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      AI Insight Analysis
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                    <span
                      className={`material-symbols-outlined text-primary ${loading ? "animate-spin" : ""}`}
                    >
                      {loading ? "progress_activity" : "psychology"}
                    </span>
                  </div>
                </div>

                {/* Sentiment Bar */}
                {loading && (
                  <div className="animate-pulse">
                    <div className="flex justify-between mb-2">
                      <div className="h-3 bg-slate-700 rounded w-24" />
                      <div className="h-3 bg-slate-700 rounded w-20" />
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full" />
                  </div>
                )}
                {analysis && (
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
                        className="h-full bg-primary transition-all duration-1000 ease-out"
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
                )}
              </div>

              {/* Insights */}
              <div className="p-5">
                <h5 className="text-slate-100 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-primary rounded-full" />
                  Key Summary Report
                </h5>

                {loading && (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-5 h-5 bg-slate-700 rounded-full flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-700 rounded w-full" />
                          <div className="h-3 bg-slate-700 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {analysis && (
                  <ul className="space-y-4">
                    {analysis.insights.map((insight, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className={`material-symbols-outlined text-lg flex-shrink-0 mt-0.5 ${
                            insight.type === "warning"
                              ? "text-amber-500"
                              : "text-primary"
                          }`}
                        >
                          {ICON_MAP[insight.type] || "info"}
                        </span>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {insight.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {error && (
                  <div className="text-center py-4">
                    <span className="material-symbols-outlined text-red-400 text-3xl mb-2 block">
                      error
                    </span>
                    <p className="text-red-400 text-sm mb-3">{error}</p>
                    <button
                      onClick={() => selected && analyze(selected)}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      다시 시도
                    </button>
                  </div>
                )}

                {analysis && (
                  <div className="mt-6 pt-5 border-t border-slate-800">
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      {analysis.summary}
                    </p>
                    <button
                      onClick={() => {
                        setAnalysis(null);
                        setError(null);
                        analyze(selected!);
                      }}
                      className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        refresh
                      </span>
                      새로운 분석 요청
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
