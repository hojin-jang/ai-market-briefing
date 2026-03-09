# React 가이드

이 프로젝트에서 사용한 React 핵심 개념을 설명합니다.

## React란?

화면(UI)을 만들기 위한 JavaScript 라이브러리입니다.
HTML을 JavaScript 안에서 작성하는 방식(JSX)으로 동작합니다.

## JSX

JavaScript 안에서 HTML처럼 작성하는 문법입니다.

```jsx
// 일반 HTML
<div class="title">안녕하세요</div>

// JSX (React)
<div className="title">안녕하세요</div>
```

차이점:
- `class` 대신 `className` 사용
- JavaScript 변수를 `{}` 안에 넣을 수 있음

```jsx
const name = "삼성전자";
<h3>{name}</h3>  // → 삼성전자가 표시됨
```

## useState — 상태 관리

화면에서 바뀌는 값을 관리합니다. 값이 바뀌면 화면이 자동으로 다시 그려집니다.

```jsx
const [loading, setLoading] = useState(true);
//     ↑ 현재 값   ↑ 값을 바꾸는 함수    ↑ 초기값
```

### 이 프로젝트에서 사용한 상태들

```jsx
const [briefing, setBriefing] = useState(null);      // 브리핑 데이터
const [loading, setLoading] = useState(true);         // 로딩 중인지
const [selected, setSelected] = useState(null);       // 선택한 종목
const [analysis, setAnalysis] = useState(null);       // 분석 결과
const [analyzing, setAnalyzing] = useState(false);    // 분석 중인지
const [error, setError] = useState(null);             // 에러 메시지
```

값을 바꿀 때:

```jsx
setLoading(true);           // loading이 true로 바뀜 → 화면 갱신
setBriefing(data);          // briefing에 데이터가 들어감 → 화면 갱신
setSelected("삼성전자");     // selected가 "삼성전자"로 바뀜 → 화면 갱신
```

## useEffect — 페이지 로드 시 실행

컴포넌트가 화면에 나타날 때 한 번 실행됩니다.

```jsx
useEffect(() => {
  fetchBriefing();  // 페이지가 열리면 브리핑 데이터를 가져옴
}, []);
// ↑ 빈 배열 = 처음 한 번만 실행
```

이 프로젝트에서는 페이지가 열리면 자동으로 시장 브리핑을 가져오는 데 사용합니다.

## 조건부 렌더링

조건에 따라 다른 화면을 보여줍니다.

```jsx
// 방법 1: && 연산자 (조건이 true일 때만 표시)
{error && <p>{error}</p>}

// 방법 2: 삼항 연산자 (조건에 따라 둘 중 하나 표시)
{loading ? <p>로딩 중...</p> : <p>완료!</p>}
```

### 이 프로젝트 예시

```jsx
{/* 로딩 중이면 "불러오는 중" 표시, 아니면 데이터 표시 */}
{loading ? (
  <p>시장 정보 불러오는 중... ⏳</p>
) : (
  briefing && (
    <div>{briefing.headline}</div>
  )
)}

{/* 종목을 선택하지 않았으면 안내 문구 */}
{!selected && (
  <p>궁금한 종목을 눌러보세요!</p>
)}
```

## 리스트 렌더링 (map)

배열 데이터를 화면에 반복해서 표시합니다.

```jsx
{briefing.markets.map((m) => (
  <div key={m.name}>
    <span>{m.name}</span>     {/* KOSPI 또는 KOSDAQ */}
    <div>{m.value}</div>       {/* 5620.31 */}
  </div>
))}
```

- `.map()` — 배열의 각 항목을 화면 요소로 변환
- `key` — React가 각 항목을 구별하기 위해 필요 (고유한 값)

## fetch — API 호출

서버에서 데이터를 가져옵니다.

```jsx
async function fetchBriefing() {
  const res = await fetch("/api/report");   // API 호출
  const data = await res.json();             // JSON으로 변환
  setBriefing(data);                         // 상태에 저장 → 화면 갱신
}
```

### 흐름 정리

```
페이지 열림
  → useEffect 실행
    → fetchBriefing() 호출
      → fetch("/api/report")로 데이터 가져옴
        → setBriefing(data)로 상태 업데이트
          → 화면이 자동으로 다시 그려짐
```

## 이벤트 처리

버튼 클릭 등 사용자 동작을 처리합니다.

```jsx
<button onClick={() => fetchAnalysis(stock)}>
  {stock}
</button>
```

`onClick`에 함수를 넣으면 클릭할 때 실행됩니다.
