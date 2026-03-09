# Next.js 가이드

이 프로젝트에서 사용한 Next.js 핵심 개념을 설명합니다.

## Next.js란?

React로 웹사이트를 만들 때 필요한 것들(라우팅, 서버, 빌드 등)을 자동으로 해주는 프레임워크입니다.
React만 쓰면 직접 설정해야 할 것들을 Next.js가 대신 해줍니다.

## 파일 기반 라우팅

Next.js에서는 파일을 만들면 자동으로 페이지가 됩니다.

```
src/app/page.js        → http://localhost:3000/
src/app/about/page.js  → http://localhost:3000/about
```

별도의 라우터 설정 없이, 폴더 구조가 곧 URL 구조입니다.

### 이 프로젝트의 페이지

| 파일 | URL | 역할 |
|------|-----|------|
| `src/app/page.js` | `/` | 메인 (브리핑 + 종목 분석) |
| `src/app/about/page.js` | `/about` | 소개 페이지 |

## 레이아웃 (layout.js)

모든 페이지에 공통으로 적용되는 틀입니다. 이 프로젝트에서는 폰트와 배경색을 설정합니다.

```js
// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-background-dark text-slate-100">
        {children}  // ← 여기에 각 페이지 내용이 들어감
      </body>
    </html>
  );
}
```

`{children}`에 `page.js`나 `about/page.js`의 내용이 들어갑니다.

## API 라우트

Next.js에서는 `api` 폴더에 파일을 만들면 백엔드 API가 됩니다.
별도의 서버를 만들 필요가 없습니다.

```
src/app/api/report/route.js  → GET /api/report
src/app/api/mock/route.js    → GET /api/mock
```

### API 라우트 작성법

```js
// src/app/api/mock/route.js
export async function GET(req) {
  // req.url에서 파라미터를 꺼낼 수 있음
  const stock = new URL(req.url).searchParams.get("stock");

  // JSON으로 응답
  return Response.json({ message: "안녕하세요" });
}
```

- `GET` 함수를 export하면 → GET 요청을 처리
- `POST` 함수를 export하면 → POST 요청을 처리

## "use client"란?

Next.js에는 두 종류의 컴포넌트가 있습니다.

| | 서버 컴포넌트 (기본) | 클라이언트 컴포넌트 |
|---|---|---|
| 선언 | 아무것도 안 씀 | `"use client"` 추가 |
| useState | 사용 불가 | 사용 가능 |
| onClick | 사용 불가 | 사용 가능 |
| 예시 | `about/page.js` | `page.js` |

`useState`, `useEffect`, `onClick` 같은 인터랙티브 기능을 쓰려면 파일 맨 위에 `"use client"`를 써야 합니다.

```js
"use client";  // ← 이 한 줄이 중요!

import { useState } from "react";
```

이 프로젝트에서는:
- `page.js` — 버튼 클릭, 상태 관리가 필요해서 `"use client"` 사용
- `about/page.js` — 정적인 소개 페이지라서 서버 컴포넌트 (선언 없음)

## Link 컴포넌트

페이지 이동할 때 `<a>` 태그 대신 `Link`를 사용합니다.
`<a>`는 페이지 전체를 새로 불러오지만, `Link`는 필요한 부분만 바꿔서 더 빠릅니다.

```js
import Link from "next/link";

<Link href="/about">소개 페이지로</Link>
<Link href="/">메인으로</Link>
```
