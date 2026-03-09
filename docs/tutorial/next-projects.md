# 다음 도전: 혼자서 새 프로젝트 만들어보기

이 프로젝트에서 배운 패턴은 다른 앱에도 그대로 쓸 수 있습니다.

```
사용자 입력 → API 라우트 → AI에게 질문 → JSON 응답 → 화면에 표시
```

이 흐름만 기억하면, 주제만 바꿔서 새로운 앱을 만들 수 있어요!

---

## 추천 1. AI 오늘의 운세

생년월일을 입력하면 AI가 오늘의 운세를 알려주는 앱.

**구조가 주식 브리핑과 거의 같아서 첫 자립 프로젝트로 추천합니다.**

```
[생년월일 입력] → [운세 결과 카드]

┌─────────────────────────────┐
│ 🔮 오늘의 운세               │
│                              │
│ 종합운          85%          │
│ ████████████░░░              │
│                              │
│ 💕 애정운: 새로운 만남이...   │
│ 📚 학업운: 집중력이 높은...   │
│ 💰 금전운: 작은 행운이...     │
│ ⚠️ 주의: 오후에는...         │
└─────────────────────────────┘
```

**이 프로젝트에서 바꿀 부분:**

| 주식 브리핑 | 오늘의 운세 |
|-------------|-------------|
| 종목 버튼 클릭 | 생년월일 입력 |
| `/api/report?stock=삼성전자` | `/api/fortune?birth=0301` |
| `sentiment` (시장 분위기) | `luck` (종합운) |
| `insights` (핵심 요약) | `categories` (애정운, 학업운 등) |

**힌트: 입력 받기**

종목은 버튼이었지만, 생년월일은 텍스트 입력이 필요합니다.

```jsx
const [birth, setBirth] = useState("");

<input
  type="text"
  placeholder="생년월일 4자리 (예: 0301)"
  value={birth}
  onChange={(e) => setBirth(e.target.value)}
  className="bg-card-bg border border-slate-800 rounded-lg px-4 py-2 text-white text-sm"
/>

<button onClick={() => fetchFortune(birth)}>
  운세 보기
</button>
```

`<input>`의 `onChange`는 사용자가 글자를 입력할 때마다 실행됩니다.
`e.target.value`가 입력된 텍스트이고, 이걸 `setBirth`로 저장합니다.

**힌트: API 라우트 프롬프트**

```js
// src/app/api/fortune/route.js
const { text } = await generateText({
  model: google("gemini-2.5-flash-lite"),
  prompt: `생년월일 ${birth}인 사람의 오늘 운세를 JSON으로 알려줘.
{
  "luck": 0~100 숫자,
  "summary": "오늘의 한마디",
  "categories": [
    { "type": "love", "text": "애정운 내용" },
    { "type": "study", "text": "학업운 내용" },
    { "type": "money", "text": "금전운 내용" },
    { "type": "warning", "text": "주의할 점" }
  ]
}`,
});
```

주식 브리핑의 프롬프트와 구조가 같죠? `sentiment` → `luck`, `insights` → `categories`로 바꾼 것뿐입니다.

---

## 추천 2. AI 맛집 추천

지역과 기분을 선택하면 AI가 맛집을 추천해주는 앱.

```
[서울] [부산] [대구] ...     ← 지역 버튼 (종목 버튼과 같은 방식)
[배고파] [데이트] [혼밥] ... ← 기분 버튼

┌─────────────────────────────┐
│ 🍕 추천 맛집 3곳             │
│                              │
│ 1. 을지로 골목식당            │
│    📍 을지로3가역 도보 5분    │
│    💬 가성비 좋은 한식 맛집   │
│                              │
│ 2. ...                       │
└─────────────────────────────┘
```

**힌트: 버튼 2개 조합**

종목은 버튼 1종류였지만, 여기선 지역 + 기분 2가지를 선택해야 합니다.

```jsx
const [region, setRegion] = useState(null);
const [mood, setMood] = useState(null);

// 지역 버튼
{["서울", "부산", "대구", "대전"].map((r) => (
  <button key={r} onClick={() => setRegion(r)}>
    {r}
  </button>
))}

// 기분 버튼
{["배고파", "데이트", "혼밥", "카페"].map((m) => (
  <button key={m} onClick={() => setMood(m)}>
    {m}
  </button>
))}

// 둘 다 선택하면 검색
useEffect(() => {
  if (region && mood) fetchRecommend(region, mood);
}, [region, mood]);
```

`useEffect`의 `[]` 안에 값을 넣으면, 그 값이 바뀔 때마다 실행됩니다.
`[region, mood]` → region이나 mood가 바뀔 때마다 실행.

**힌트: 쿼리 파라미터 2개**

```
/api/recommend?region=서울&mood=데이트
```

```js
// API 라우트에서 받기
const region = new URL(req.url).searchParams.get("region");
const mood = new URL(req.url).searchParams.get("mood");
```

Google Search grounding을 쓰면 실제 맛집 정보를 검색해서 추천할 수 있습니다.

---

## 추천 3. AI 영화/드라마 추천

장르와 기분을 선택하면 AI가 볼 만한 작품을 추천해주는 앱.
맛집 추천과 구조가 비슷하지만, 결과 카드 디자인을 연습하기 좋습니다.

**힌트: 카드 여러 개 표시**

주식 브리핑에서 `markets.map()`으로 KOSPI/KOSDAQ 카드를 만든 것처럼,
추천 결과도 배열을 `map()`으로 돌리면 됩니다.

```jsx
{result.movies.map((movie) => (
  <div key={movie.title} className="bg-card-bg rounded-xl p-4 border border-slate-800">
    <h3 className="text-white font-bold">{movie.title}</h3>
    <p className="text-slate-400 text-xs">{movie.genre} · {movie.year}</p>
    <p className="text-slate-300 text-sm mt-2">{movie.reason}</p>
  </div>
))}
```

---

## 추천 4. AI MBTI 분석기

간단한 질문에 답하면 AI가 MBTI를 분석해주는 앱.
친구들에게 공유하기 좋아서 바이럴 가능성이 높습니다.

**새로운 도전: 다단계 입력**

이전 프로젝트들은 입력이 한 번이었지만, MBTI는 질문이 여러 개입니다.

```jsx
const questions = [
  "주말에 뭐 하고 싶어? A: 친구 만나기 B: 집에서 쉬기",
  "결정할 때 뭘 더 중요하게 생각해? A: 논리 B: 감정",
  // ...
];
const [step, setStep] = useState(0);
const [answers, setAnswers] = useState([]);

function handleAnswer(answer) {
  setAnswers([...answers, answer]);  // 답변 추가
  setStep(step + 1);                 // 다음 질문으로
}
```

`step`으로 현재 몇 번째 질문인지 관리하고,
모든 질문에 답하면 (`step === questions.length`) AI에게 분석을 요청합니다.

---

## 어떤 걸 골라야 할까?

| 프로젝트 | 난이도 | 새로 배우는 것 |
|----------|--------|----------------|
| 오늘의 운세 | 쉬움 | `<input>` 텍스트 입력 |
| 맛집 추천 | 보통 | 버튼 2개 조합, `useEffect` 의존성 |
| 영화 추천 | 보통 | 카드 목록 디자인 |
| MBTI 분석기 | 어려움 | 다단계 입력, 배열에 데이터 쌓기 |

**처음이라면 "오늘의 운세"부터 시작하세요!**
자신감이 붙으면 나머지도 도전해보세요.
