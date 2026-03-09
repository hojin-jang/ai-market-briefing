# Step 6. 소개 페이지 만들기

## 이번에 할 것

소개 페이지를 추가하고, 메인 페이지와 서로 이동할 수 있게 만듭니다.

## 1. 소개 페이지 만들기

`src/app/about/` 폴더를 만들고, 그 안에 `page.js` 파일을 만드세요.

```
src/app/about/page.js
```

> `about/page.js`를 만들면 자동으로 `/about` URL이 생깁니다.

아래 내용을 넣으세요.

```js
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
```

### 이 코드가 하는 일

**`"use client"` 가 없다는 점에 주목하세요!**

이 페이지는 버튼 클릭이나 상태 관리가 필요 없는 정적인 페이지입니다.
Next.js에서는 `"use client"`를 쓰지 않으면 서버 컴포넌트가 됩니다.

- 서버 컴포넌트 — 정적인 페이지에 사용 (이 소개 페이지)
- 클라이언트 컴포넌트 — 인터랙티브한 페이지에 사용 (메인 페이지)

**Link 컴포넌트**

```js
import Link from "next/link";

<Link href="/">브리핑으로 돌아가기</Link>
```

`<a>` 태그와 비슷하지만, 페이지 전체를 새로고침하지 않고 필요한 부분만 바꿉니다.
그래서 페이지 이동이 훨씬 빠릅니다.

## 2. 메인 페이지에 링크 추가

`src/app/page.js`를 열어서 두 가지를 수정하세요.

**import 추가** (파일 맨 위)

기존:
```js
import { useState, useEffect } from "react";
```

수정:
```js
import { useState, useEffect } from "react";
import Link from "next/link";
```

**하단 링크 추가** (`</main>` 바로 위에)

```jsx
        {/* 앱 소개 링크 */}
        <Link
          href="/about"
          className="block bg-primary/10 rounded-xl border border-primary/30 p-4 text-center hover:bg-primary/20 transition-all"
        >
          <p className="text-primary text-sm font-medium">
            이 앱은 어떻게 만들어졌을까? →
          </p>
        </Link>
      </main>
```

## 확인하기

- [ ] http://localhost:3000 하단에 "이 앱은 어떻게 만들어졌을까?" 링크가 보인다
- [ ] 클릭하면 소개 페이지로 이동한다
- [ ] 소개 페이지 하단에 "← 브리핑으로 돌아가기" 가 보인다
- [ ] 클릭하면 메인 페이지로 돌아온다

다 됐으면 [Step 7. 실제 AI API 연결하기](./step-07-real-api.md)로 넘어가세요!
