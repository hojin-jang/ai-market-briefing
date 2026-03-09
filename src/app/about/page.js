import Link from "next/link";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col max-w-lg mx-auto">
      {/* 헤더 */}
      <header className="flex items-center p-4 border-b border-slate-800 justify-between sticky top-0 z-50 bg-background-dark">
        <h1 className="text-slate-100 text-lg font-bold">ℹ️ 소개</h1>
        <span className="text-slate-400 text-xs">오늘의 주식 브리핑</span>
      </header>

      <main className="flex-1 p-4 space-y-5">
        {/* 프로젝트 소개 */}
        <div className="bg-card-bg rounded-xl border border-slate-800 p-6">
          <h2 className="text-white text-base font-bold mb-3">
            📊 AI 주식 브리핑이란?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            AI가 오늘의 한국 주식시장을 분석해서 쉽게 알려주는 서비스예요.
            KOSPI, KOSDAQ 지수는 물론 오늘의 주요 종목까지 한눈에 볼 수 있어요.
          </p>
        </div>

        {/* 기능 설명 */}
        <div className="bg-card-bg rounded-xl border border-slate-800 p-6">
          <h2 className="text-white text-base font-bold mb-3">
            🛠️ 주요 기능
          </h2>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li>실시간 KOSPI / KOSDAQ 지수 확인</li>
            <li>AI가 요약해주는 오늘의 시장 헤드라인</li>
            <li>종목별 AI 분석 (시장 분위기 + 핵심 요약)</li>
          </ul>
        </div>

        {/* 기술 스택 */}
        <div className="bg-card-bg rounded-xl border border-slate-800 p-6">
          <h2 className="text-white text-base font-bold mb-3">
            💻 사용한 기술
          </h2>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li>Next.js + React</li>
            <li>TailwindCSS</li>
            <li>Google Gemini API</li>
          </ul>
        </div>
        <Link
          href="/"
          className="block bg-primary/10 rounded-xl border border-primary/30 p-4 text-center hover:bg-primary/20 transition-all"
        >
          <p className="text-primary text-sm font-medium">
            ← 브리핑으로 돌아가기
          </p>
        </Link>
      </main>
    </div>
  );
}
