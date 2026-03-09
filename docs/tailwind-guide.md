# TailwindCSS 기초 가이드

TailwindCSS는 미리 만들어진 클래스를 조합해서 스타일을 만드는 CSS 프레임워크입니다.
CSS 파일을 따로 만들 필요 없이, HTML에 클래스만 붙이면 됩니다.

## 기존 CSS와 비교

```css
/* 기존 CSS */
.card {
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  font-size: 14px;
}
```

```html
<!-- TailwindCSS -->
<div className="p-4 bg-white rounded-xl text-sm">
```

같은 결과인데 CSS 파일이 필요 없습니다.

## 자주 쓰는 클래스

### 여백

| 클래스 | 의미 | CSS |
|--------|------|-----|
| `p-4` | padding 전체 | `padding: 16px` |
| `px-4` | padding 좌우 | `padding-left: 16px; padding-right: 16px` |
| `py-2` | padding 상하 | `padding-top: 8px; padding-bottom: 8px` |
| `m-4` | margin 전체 | `margin: 16px` |
| `mt-2` | margin 위만 | `margin-top: 8px` |
| `mb-3` | margin 아래만 | `margin-bottom: 12px` |
| `gap-2` | 요소 사이 간격 | `gap: 8px` |

> 숫자 규칙: 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 5 = 20px

### 글씨

| 클래스 | 의미 |
|--------|------|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-2xl` | 24px |
| `font-bold` | 굵게 |
| `font-medium` | 약간 굵게 |

### 색상

| 클래스 | 의미 |
|--------|------|
| `text-white` | 흰색 글씨 |
| `text-slate-400` | 회색 글씨 (숫자 클수록 진함) |
| `text-red-400` | 빨간 글씨 |
| `bg-white` | 흰색 배경 |
| `bg-slate-800` | 어두운 배경 |
| `border-slate-800` | 테두리 색 |

### 레이아웃

| 클래스 | 의미 |
|--------|------|
| `flex` | 가로 배치 |
| `flex-col` | 세로 배치 |
| `items-center` | 세로 중앙 정렬 |
| `justify-between` | 양 끝 정렬 |
| `grid grid-cols-2` | 2열 격자 |
| `gap-3` | 격자/flex 사이 간격 |

### 모양

| 클래스 | 의미 |
|--------|------|
| `rounded-xl` | 둥근 모서리 (크게) |
| `rounded-full` | 완전한 원형 |
| `border` | 테두리 1px |
| `shadow-sm` | 약한 그림자 |
| `overflow-hidden` | 넘치는 내용 숨기기 |

## 이 프로젝트에서 쓰인 예시

```html
<!-- 카드 -->
<div className="bg-card-bg rounded-xl p-4 border border-slate-800">

<!-- 버튼 -->
<button className="px-4 py-2 rounded-full text-xs border border-slate-800">

<!-- 가로 배치 + 양 끝 정렬 -->
<div className="flex items-center justify-between">

<!-- 2열 격자 -->
<div className="grid grid-cols-2 gap-3">
```

## 모르는 클래스가 나오면?

[TailwindCSS 공식 문서](https://tailwindcss.com/docs)에서 검색하면 바로 나옵니다.
