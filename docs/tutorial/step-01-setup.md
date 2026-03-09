# Step 1. 프로젝트 만들기

## 이번에 할 것

Next.js 프로젝트를 생성하고, 개발 서버를 실행해서 브라우저에서 확인합니다.

## 사전 준비

- [Node.js](https://nodejs.org/) 설치 (v20 이상)
- 터미널(명령 프롬프트) 사용법 기초

설치 확인:

```bash
node -v    # v20.9.0 이상이면 OK
npm -v     # 숫자가 나오면 OK
```

## 1. 프로젝트 생성

터미널을 열고 아래 명령어를 입력하세요.

```bash
npx create-next-app@latest ai-market-briefing
```

첫 번째 질문이 나옵니다:

```
Would you like to use the recommended Next.js defaults? → No, customize settings
```

> "No, customize settings"를 선택해서 우리가 원하는 설정을 직접 골라야 합니다.

그 다음 질문들이 나오면 이렇게 선택하세요:

```
Would you like to use TypeScript? → No
Which linter would you like to use? → None
Would you like to use React Compiler? → No
Would you like to use Tailwind CSS? → Yes
Would you like your code inside a `src/` directory? → Yes
Would you like to use App Router? → Yes
Would you like to customize the import alias? → No
```

> **TypeScript**는 JavaScript에 타입을 추가한 언어인데, 이번에는 JavaScript만 사용합니다.
> **Tailwind CSS**는 스타일을 쉽게 적용하기 위한 도구입니다. 꼭 Yes로 선택하세요.
> **App Router**는 Next.js의 최신 라우팅 방식입니다. Yes로 선택하세요.

## 2. 프로젝트 폴더로 이동

```bash
cd ai-market-briefing
```

## 3. 개발 서버 실행

```bash
npm run dev
```

이런 메시지가 나오면 성공입니다:

```
▲ Next.js 16.x.x
- Local: http://localhost:3000
```

## 4. 브라우저에서 확인

브라우저를 열고 http://localhost:3000 에 접속하세요.

Next.js 기본 화면이 보이면 성공입니다!

## 5. 폴더 구조 확인

생성된 프로젝트의 주요 파일들입니다:

```
ai-market-briefing/
├── src/
│   └── app/
│       ├── layout.js      ← 모든 페이지의 공통 틀
│       ├── page.js         ← 메인 페이지 (http://localhost:3000)
│       └── globals.css     ← 전체 스타일
├── postcss.config.mjs      ← PostCSS 설정 (Tailwind용)
├── package.json            ← 프로젝트 정보 + 패키지 목록
└── .gitignore              ← Git에 올리지 않을 파일 목록
```

지금은 `src/app/` 폴더 안의 파일 3개만 신경쓰면 됩니다.

## 확인하기

- [ ] `npm run dev`로 서버가 실행된다
- [ ] http://localhost:3000 에서 화면이 보인다

다 됐으면 [Step 2. 레이아웃 만들기](./step-02-layout.md)로 넘어가세요!
