# Step 2. 레이아웃 만들기

## 이번에 할 것

어두운 배경에 깔끔한 폰트가 적용된 기본 레이아웃을 만듭니다.

## 1. 글로벌 스타일 + 색상 설정

`src/app/globals.css` 파일을 열어서 **전체 내용**을 아래로 바꾸세요.

```css
@import "tailwindcss";

@theme {
  --color-primary: #2a7dcf;
  --color-background-dark: #121920;
  --color-market-up: #ef4444;
  --color-market-down: #3b82f6;
  --color-card-bg: #1c252e;
}

body {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### 이 코드가 하는 일

```css
@import "tailwindcss";
```
Tailwind CSS를 불러옵니다 (필수).

```css
@theme {
  --color-primary: #2a7dcf;
  --color-background-dark: #121920;
  ...
}
```
`@theme` 안에서 커스텀 색상을 정의합니다. Tailwind v4에서는 CSS 안에서 직접 설정합니다.
`--color-이름`으로 정의하면 `text-이름`, `bg-이름` 같은 클래스가 자동 생성됩니다.

- `primary` — 메인 색상 (파란색)
- `background-dark` — 배경색 (어두운 남색)
- `market-up` — 주가 상승 (빨간색, 한국 주식은 상승이 빨강)
- `market-down` — 주가 하락 (파란색)
- `card-bg` — 카드 배경 (약간 밝은 남색)

이제 코드에서 `text-primary`, `bg-card-bg` 같은 클래스를 쓸 수 있습니다.

```css
.no-scrollbar
```
가로 스크롤바를 숨기는 스타일입니다 (나중에 종목 버튼에 사용).

## 2. 레이아웃 만들기

`src/app/layout.js` 파일을 열어서 **전체 내용**을 아래로 바꾸세요.

```js
import "./globals.css";

export const metadata = {
  title: "AI Market Briefing",
  description: "AI 주식시장 일일 보고서",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-dark text-slate-100">{children}</body>
    </html>
  );
}
```

### 이 코드가 하는 일

한 줄씩 살펴봅시다:

```js
import "./globals.css";
```
위에서 만든 글로벌 스타일을 불러옵니다.

```js
export const metadata = {
  title: "AI Market Briefing",
  description: "AI 주식시장 일일 보고서",
};
```
브라우저 탭에 표시되는 제목과 설명입니다.

```js
export default function RootLayout({ children }) {
```
`RootLayout`은 모든 페이지를 감싸는 공통 틀입니다.
`{ children }`은 각 페이지의 내용이 들어오는 자리입니다.

```html
<html lang="ko" className="dark">
```
한국어 페이지이고, 다크 모드를 사용한다는 뜻입니다.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet" />
```
Google에서 Inter 폰트를 가져옵니다.

```html
<body className="bg-background-dark text-slate-100">{children}</body>
```
- `bg-background-dark` — 배경을 어두운 남색으로
- `text-slate-100` — 기본 글씨를 밝은 색으로
- `{children}` — 여기에 page.js의 내용이 들어갑니다

## 3. 첫 화면 만들기

`src/app/page.js` 파일을 열어서 **전체 내용**을 아래로 바꾸세요.

```js
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col max-w-lg mx-auto">
      <header className="flex items-center p-4 border-b border-slate-800 justify-between sticky top-0 z-50 bg-background-dark">
        <h1 className="text-slate-100 text-lg font-bold">
          📊 오늘의 주식 브리핑
        </h1>
        <span className="text-slate-400 text-xs">2026.03.09</span>
      </header>

      <main className="flex-1 p-4">
        <p className="text-slate-400 text-sm">여기에 내용이 들어갈 예정입니다.</p>
      </main>
    </div>
  );
}
```

### 이 코드가 하는 일

```html
<div className="flex min-h-screen flex-col max-w-lg mx-auto">
```
- `min-h-screen` — 화면 전체 높이를 차지
- `max-w-lg` — 최대 너비를 스마트폰 크기로 제한
- `mx-auto` — 가운데 정렬

```html
<header className="flex items-center p-4 border-b border-slate-800 justify-between sticky top-0 z-50 bg-background-dark">
```
- `flex items-center justify-between` — 가로로 배치하고 양 끝에 정렬
- `p-4` — 안쪽 여백 16px
- `border-b border-slate-800` — 아래쪽에 어두운 테두리선
- `sticky top-0` — 스크롤해도 헤더가 위에 고정

## 확인하기

브라우저에서 http://localhost:3000 을 새로고침하세요.

- [ ] 어두운 배경이 보인다
- [ ] "📊 오늘의 주식 브리핑" 헤더가 보인다
- [ ] 날짜가 오른쪽에 표시된다

다 됐으면 [Step 3. Mock API 만들기](./step-03-mock-api.md)로 넘어가세요!
