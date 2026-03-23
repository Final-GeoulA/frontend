# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 개발 서버 실행 (포트 3001)
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 단일 테스트 파일 실행
npm test -- --testPathPattern="ComponentName"
```

## Environment

`REACT_APP_BACK_END_URL` 환경 변수에 백엔드 API 주소를 설정해야 한다. `.env` 파일을 프로젝트 루트에 생성한다.

## Architecture

**Create React App** 기반 TypeScript 프로젝트. React Router v7, Bootstrap, Axios를 핵심으로 사용한다.

### 앱 진입점 흐름

```
index.tsx → App.tsx
              ├── AuthProvider  (Context API 기반 인증 상태 전역 관리)
              ├── BrowserRouter
              ├── Layout        (Navbar + 공통 레이아웃)
              └── AppRoutes     (34개 라우트 정의)
```

### 디렉토리 구조

- `src/components/` — 공유 컴포넌트 (AuthProvider, Layout, Navbar, RequireAuth)
- `src/router/AppRoutes.tsx` — 모든 라우트 정의
- `src/contents/` — 기능별 페이지 컴포넌트
  - `MainPage/` — 랜딩 페이지
  - `Login/`, `SignUp/` — 인증
  - `SkinAnalysis/` — 카메라/사진 업로드 + 피부 분석
  - `SkinInfo/` — 피부백과
  - `Search/` — 병원/약국 검색
  - `Recommend/` — 제품 추천
  - `Board/` — 커뮤니티 게시판
  - `Mypage/` — 마이페이지 (중첩 라우트: skinreport, savedhospitals, recommend, board)

### 인증 패턴

`AuthProvider`가 세션 기반 인증을 관리한다 (`withCredentials: true`). `useAuth()` hook으로 컴포넌트에서 소비한다. 보호된 라우트는 `RequireAuth` 컴포넌트로 감싼다.

```tsx
const { user, login, logout, checkLogin } = useAuth();
```

`user` 객체 형태: `{ nickname: string, email: string, num: number }`

### API 호출 패턴

Axios를 컴포넌트 내부에서 직접 호출한다 (별도 API 레이어 없음). 모든 요청에 `withCredentials: true` 필수.

```tsx
const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/...`, {
  withCredentials: true,
});
```

### MyPage 중첩 라우팅

`/mypage`는 `<Outlet />`을 사용하는 중첩 구조. 기본 경로(`/mypage`)는 `/mypage/skinreport`로 리다이렉트된다.

### 스타일링

Bootstrap + 인라인 스타일 혼용. 일부 컴포넌트는 `style/` 또는 `css/` 하위 디렉토리의 CSS 파일 사용.
