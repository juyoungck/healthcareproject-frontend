# 루틴어때? (health-fitness-app)

AI 맞춤 운동 및 식단 추천 서비스를 제공하는 프론트엔드 프로젝트입니다. 온보딩으로 수집한 사용자 정보(신체, 목표, 알레르기, 부상 등)를 기반으로 운동/식단 계획을 생성하고, 캘린더/게시판/화상 PT/관리자 기능까지 포함합니다.

---

## Demo

- 서비스: 추가 예정

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

빌드:

```bash
npm run build          # 프로덕션 빌드
npm run build:dev      # 개발 환경 빌드
npm run build:prod     # 프로덕션 빌드 (build와 동일)
```

로컬 프리뷰:

```bash
npm run preview        # 빌드 결과물 로컬 확인
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

| 변수 | 설명 |
|------|------|
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL |
| `VITE_JANUS_SERVER` | Janus 서버 URL (화상 PT) |
| `VITE_*_CLIENT_ID` | 각 소셜 로그인 클라이언트 ID |
| `VITE_OAUTH_REDIRECT_URI` | OAuth 콜백 URI |

---

## 폴더 구조

```text
src/
├── api/                      # API 호출 함수
│   └── types/                # API 요청/응답 타입 정의
├── app/
│   ├── components/           # 재사용 컴포넌트 (기능별 폴더)
│   │   ├── admin/            # 관리자 컴포넌트
│   │   ├── auth/             # 로그인/회원가입 모달
│   │   ├── board/            # 게시판 컴포넌트
│   │   ├── calendar/         # 캘린더 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   ├── dashboard/        # 대시보드 컴포넌트
│   │   ├── diet/             # 식단 컴포넌트
│   │   ├── exercise/         # 운동 컴포넌트
│   │   ├── mypage/           # 마이페이지 컴포넌트
│   │   ├── onboarding/       # 온보딩 컴포넌트
│   │   ├── plan/             # AI 계획 생성 컴포넌트
│   │   ├── pt/               # 화상PT 컴포넌트
│   │   └── settings/         # 설정 컴포넌트
│   └── pages/                # 페이지 컴포넌트
├── constants/                # 상수 정의 (라벨, 옵션, 에러코드)
├── contexts/                 # React Context (AuthContext 등)
├── hooks/                    # 커스텀 훅 (기능별 폴더)
│   ├── auth/                 # 인증 훅
│   ├── dashboard/            # 대시보드 훅
│   ├── diet/                 # 식단 훅
│   ├── exercise/             # 운동 훅
│   ├── mypage/               # 마이페이지 훅
│   ├── onboarding/           # 온보딩 훅
│   └── pt/                   # 화상PT 훅
├── lib/                      # 외부 라이브러리
│   └── janus/                # Janus WebRTC
├── styles/
│   ├── common/               # 공통 스타일 (버튼, 폼, 모달)
│   ├── components/           # 컴포넌트별 스타일
│   ├── pages/                # 페이지별 스타일
│   ├── variables.css         # CSS 변수 (단일 진실 공급원)
│   ├── theme.css             # Tailwind 테마
│   └── index.css             # 메인 진입점
└── utils/                    # 유틸리티 함수
```

---

## 주요 페이지

| 페이지 | 설명 |
|--------|------|
| `LandingPage` | 랜딩 페이지 |
| `OnboardingPage` | 온보딩 입력 플로우 |
| `Dashboard` | 홈 대시보드 |
| `ExercisePage` | 운동 목록 조회 |
| `PlanExercisePage` | AI 운동 계획 생성 |
| `DietPage` | 식단 목록 조회 |
| `PlanDietPage` | AI 식단 계획 생성 |
| `CalendarPage` | 일정 캘린더 |
| `VideoPTPage` | 화상 PT |
| `BoardPage` | 커뮤니티 게시판 |
| `MyPage` | 마이페이지 |
| `SettingsPage` | 설정 |
| `AdminPage` | 관리자 기능 |

---

## API 모듈

| 모듈 | 파일 | 설명 |
|------|------|------|
| 공통 | `client.ts`, `apiError.ts` | Axios 인스턴스, 에러 처리 유틸 |
| 인증 | `auth.ts`, `emailVerification.ts` | 로그인, 회원가입, 이메일 인증 |
| 사용자 | `me.ts` | 프로필, 온보딩 데이터 |
| 운동 | `exercise.ts`, `workout.ts` | 운동 목록, 운동 계획 |
| 식단 | `food.ts`, `dietplan.ts` | 음식 목록, 식단 계획 |
| AI | `ai.ts` | AI 계획 생성 |
| 캘린더 | `calendar.ts` | 일정 조회 |
| 게시판 | `board.ts`, `memo.ts` | 게시글, 메모 |
| PT | `pt.ts`, `trainer.ts` | 화상PT, 트레이너 |
| 신고 | `report.ts` | 신고 기능 |
| 관리자 | `admin.ts` | 관리자 API |
| 파일 | `upload.ts` | 파일 업로드 |

---

## 커스텀 훅

| 훅 | 설명 |
|----|------|
| `useEmailVerification` | 이메일 인증 로직 |
| `useTodayPlan` | 오늘의 운동/식단 계획 |
| `useDashboardNavigation` | 대시보드 네비게이션 |
| `useLivePTCount` | 실시간 PT 카운트 |
| `useFoodList` | 음식 목록 (무한스크롤) |
| `useExerciseList` | 운동 목록 (무한스크롤, 필터) |
| `useProfileEdit` | 프로필 편집 |
| `useProfileImage` | 프로필 이미지 관리 |
| `useSocialConnections` | 소셜 연동 관리 |
| `useTrainerProfile` | 트레이너 프로필 |
| `useOnboardingData` | 온보딩 데이터 조회 |
| `useOnboardingForm` | 온보딩 폼 관리 |
| `useJanus` | Janus WebRTC 연결 |

---

## 상수 파일

| 파일 | 내용 |
|------|------|
| `admin.ts` | Admin 필터, 라벨, CSS 클래스 매핑 |
| `board.ts` | 게시판 카테고리, 매핑 |
| `calendar.ts` | 캘린더 관련 상수 |
| `errorCodes.ts` | 에러 코드 |
| `exercise.ts` | 운동 부위, 난이도 라벨/옵션 |
| `me.ts` | 프로필 관련 라벨 |
| `onboarding.ts` | 온보딩 옵션 |
| `report.ts` | 신고 사유 |
| `validation.ts` | 입력 길이, 정규식, 타임아웃 |

---

## 관련 저장소

- **Backend**: https://github.com/Ozymandias089/healthcareproject-backend
- **Frontend**: https://github.com/juyoungck/healthcareproject-frontend

---

## 문서 (Notion, Google Sheets)

- 기획: [Notion 링크](https://www.notion.so/2ed86ae7d29d819abb0feb29665b07f5)
- 요구사항 분석: [Google Sheets 링크](https://docs.google.com/spreadsheets/d/1H7atLbovfqtVw2OyD002Y94dBTw3mCqxEZTNq7g5na8/edit?gid=0#gid=0)
- API 명세서: [Notion 링크](https://www.notion.so/API-2ed86ae7d29d818f8ad1d3ab28d59e9d)

---

## 프로젝트 정보

- 개발 기간: 2025.01 ~ 2025.02
- 팀 구성: Frontend 3명, Backend 3명

---

## 팀원

| Name       | GitHub                                             | Role          | Responsibility                                                                                                                                               |
|------------|----------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **김주영** | [@juyoungck](https://github.com/juyoungck)         | Frontend Lead | UI/UX design & implementation(Main, Auth, ME, PT, S3), REST API integration, Frontend code refactoring & review, Frontend deployment, Development scheduling |
| **박중건** | [@qkrwndrjs613](https://github.com/qkrwndrjs613)   | Frontend      | UI/UX design & implementation(Admin, AI Plan, Board), REST API integration                                                                                   |
| **백승진** | [@SeungjinB](https://github.com/SeungjinB)         | Frontend      | UI/UX design & implementation(Foods, Calendar, Report), REST API integration                                                                                 |
| **최영훈** | [@Ozymandias089](https://github.com/Ozymandias089) | Backend Lead  | Architecture & system design, Infrastructure setup, Backend core modules (Auth, ME, PT, Calendar, Diet, Workout), AI integration, PR review                  |
| **안태호** | [@saesamn](https://github.com/saesamn)             | Backend       | Feature development(Board, PT, Admin)                                                                                                                        |
| **이현성** | [@HyunsEEE](https://github.com/HyunsEEE)           | Backend       | UI/UX design & implementation(Exercises), Feature development(Workout, Calendar, Admin, S3)                                                                  |

---

## 브라우저 지원

- Chrome (권장)
- Safari
- Edge

---

## 라이선스

GNU General Public License v2
