# Step 8. Vercel로 배포하기

## 이번에 할 것

완성한 앱을 인터넷에 올려서 누구나 접속할 수 있게 만듭니다.

Vercel은 Next.js를 만든 회사의 배포 서비스입니다.
무료로 사용할 수 있고, GitHub에 코드를 올리면 자동으로 배포됩니다.

## 1. GitHub에 코드 올리기

이미 GitHub에 올려놨다면 이 단계는 건너뛰세요.

### GitHub 저장소 만들기

1. [github.com](https://github.com)에 로그인
2. 오른쪽 상단 `+` 버튼 → "New repository" 클릭
3. Repository name에 `ai-market-briefing` 입력
4. "Create repository" 클릭

### 코드 올리기

터미널에서 아래 명령어를 순서대로 실행하세요.

```bash
git init
git add .
git commit -m "첫 커밋"
git remote add origin https://github.com/내아이디/ai-market-briefing.git
git push -u origin main
```

> `내아이디` 부분을 본인의 GitHub 아이디로 바꾸세요.

## 2. Vercel 가입

1. [vercel.com](https://vercel.com)에 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택 → GitHub 계정으로 로그인
4. 권한 허용

## 3. 프로젝트 가져오기

1. Vercel 대시보드에서 "Add New Project" 클릭
2. GitHub 저장소 목록에서 `ai-market-briefing`을 찾아 "Import" 클릭

> 저장소가 안 보이면 "Adjust GitHub App Permissions"를 눌러서 권한을 추가하세요.

## 4. 환경변수 설정

Import 화면에서 "Environment Variables" 섹션을 찾으세요.

| Key | Value |
|-----|-------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | 발급받은 API 키 |

1. Key에 `GOOGLE_GENERATIVE_AI_API_KEY` 입력
2. Value에 Google AI Studio에서 발급받은 API 키 입력
3. "Add" 클릭

> 이 설정을 안 하면 실제 AI 분석이 작동하지 않습니다.
> Mock API(`/api/mock`)는 환경변수 없이도 작동합니다.

## 5. 배포하기

"Deploy" 버튼을 클릭하면 끝!

1~2분 정도 기다리면 배포가 완료됩니다.

완료되면 `https://ai-market-briefing-xxxxx.vercel.app` 같은 주소가 나옵니다.
이 주소로 접속하면 내가 만든 앱이 인터넷에서 돌아가는 걸 볼 수 있습니다!

## 확인하기

- [ ] Vercel이 알려준 URL로 접속하면 앱이 보인다
- [ ] KOSPI/KOSDAQ 지수가 표시된다
- [ ] 종목을 클릭하면 AI 분석이 나온다
- [ ] 친구에게 URL을 보내서 접속이 되는지 확인한다

## 이후에 코드를 수정하면?

GitHub에 push하면 Vercel이 자동으로 다시 배포합니다.

```bash
git add .
git commit -m "수정 내용"
git push
```

이것만 하면 1~2분 뒤에 사이트에 반영됩니다.

## 완성!

축하합니다! AI 주식 브리핑 앱을 만들고 배포까지 완료했습니다!

다음은 배운 걸 활용해서 혼자 새 프로젝트를 만들어보세요!

→ [다음 도전: 새 프로젝트 아이디어](./next-projects.md)
