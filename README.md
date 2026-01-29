# 운동운동 (health-fitness-app)

AI 맞춤 운동 및 식단 추천 서비스를 제공하는 프론트엔드 프로젝트입니다. 온보딩으로 수집한 사용자 정보(신체, 목표, 알레르기, 부상 등)를 기반으로 운동/식단 계획을 생성하고, 캘린더/게시판/화상 PT/관리자 기능까지 포함합니다.

---

## 주요 기능

- 인증/계정
  - 회원가입/로그인/로그아웃
  - 비밀번호 재설정(이메일 인증 흐름 포함)
  - 소셜 로그인 및 연동 (Kakao, Naver, Google)
- 온보딩
  - 신체정보/운동경력/운동목표/알레르기/부상 이력/주간 운동 빈도 입력
- 대시보드
  - 오늘의 운동/식단 요약 및 주간 상태 확인
  - 탭 기반 주요 서비스 접근
- 운동/식단
  - AI 기반 운동 루틴 생성/재생성
  - AI 기반 7일 식단 생성/재생성
  - 일자별 운동/식단 상세 조회 및 체크
- 캘린더
  - 주간/월간 일정, 상태 표시
- 화상 PT
  - Janus WebRTC 기반 실시간 화상 수업
- 커뮤니티/게시판
  - 게시글 목록/상세/작성
- 마이페이지/설정
  - 사용자 정보/소셜 연동/설정 관리
- 관리자
  - 회원/트레이너/운동/식단/게시판/신고 등 관리 화면

---

## 기술 스택

- Frontend: React 18, TypeScript, Vite 6
- UI/스타일: Tailwind CSS 4, Radix UI, Lucide Icons
- 네트워킹: Axios
- 에디터: Toast UI Editor
- 실시간 통신: Janus WebRTC

---

## 설치 및 실행

```bash
npm install
npm run dev
```

빌드 및 프리뷰:

```bash
npm run build
npm run preview
```

---

## 환경 변수

`.env` 파일을 프로젝트 루트에 생성하고 아래 항목을 설정하세요.

```bash
VITE_API_BASE_URL=
VITE_JANUS_SERVER=
VITE_KAKAO_CLIENT_ID=
VITE_NAVER_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=
VITE_OAUTH_REDIRECT_URI=
```

- `VITE_API_BASE_URL`: 백엔드 API 베이스 URL
- `VITE_JANUS_SERVER`: Janus 서버 URL (화상 PT)
- `VITE_*_CLIENT_ID`: 각 소셜 로그인 클라이언트 ID
- `VITE_OAUTH_REDIRECT_URI`: OAuth 콜백 URI

---

## 폴더 구조

```text
src/
  api/                # API 모듈 (axios client + 도메인별 요청)
  app/                # 앱 라우팅/페이지/컴포넌트
  contexts/           # 전역 상태 (Auth)
  data/               # 더미 데이터
  hooks/              # 커스텀 훅 (Janus)
  styles/             # 전역/페이지/컴포넌트 스타일
  types/              # 전역 타입
  utils/              # 유틸 함수
```

---

## 주요 페이지

- `LandingPage`: 랜딩
- `OnboardingPage`: 온보딩 입력 플로우
- `Dashboard`: 홈 대시보드
- `ExercisePage` / `PlanExercisePage`: 운동 계획 조회 및 생성
- `DietPage` / `PlanDietPage`: 식단 계획 조회 및 생성
- `CalendarPage`: 일정 캘린더
- `VideoPTPage`: 화상 PT
- `BoardPage`: 커뮤니티 게시판
- `MyPage` / `SettingsPage`: 사용자 설정/정보
- `AdminPage`: 관리자 기능

---

## API 모듈 요약

- 인증/계정: `src/api/auth.ts`, `src/api/emailVerification.ts`, `src/api/me.ts`
- 운동/식단: `src/api/workout.ts`, `src/api/dietplan.ts`, `src/api/ai.ts`, `src/api/exercise.ts`, `src/api/food.ts`
- 캘린더: `src/api/calendar.ts`
- 게시판/메모: `src/api/board.ts`, `src/api/memo.ts`
- PT/트레이너: `src/api/pt.ts`, `src/api/trainer.ts`
- 신고/관리자: `src/api/report.ts`, `src/api/admin.ts`
- 파일 업로드: `src/api/upload.ts`

---

## 문서 (Notion)

- 기획: [Notion 링크](notion.so/)

---

## Contributors

| Name    | GitHub                                             | Role         | Responsibility                                                                                                                              |
|---------|----------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| **김주영** | [@juyoungck](https://github.com/juyoungck)         | Frontend PM  | UI, UX, API integration                                                                                                                     |
| **박중건** | [@qkrwndrjs613](https://github.com/qkrwndrjs613)   | Frontend     | UI, UX, API integration                                                                                                                     |
| **백승진** | [@SeungjinB](https://github.com/SeungjinB)         | Frontend     | UI, UX, API integration                                                                                                                     |
| **최영훈** | [@Ozymandias089](https://github.com/Ozymandias089) | Backend Lead | Architecture & system design, Infrastructure setup, Backend core modules (Auth, ME, PT, Calendar, Diet, Workout), AI integration, PR review |
| **안태호** | [@saesamn](https://github.com/saesamn)             | Backend      | Feature development(Board, PT, Admin)                                                                                                       |
| **이현성** | [@HyunsEEE](https://github.com/HyunsEEE)           | Backend      | Feature development(Workout, Calendar, Admin, S3)                                                                                           |


---

## 라이선스

TBD
