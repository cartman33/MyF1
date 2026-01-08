# 🏁 F1 Trip Planner - Frontend

F1 Trip Planner의 React 프론트엔드 애플리케이션입니다.

## 🚀 시작하기

### 사전 요구사항

- Node.js 16 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (포트 3000)
npm start

# 프로덕션 빌드
npm run build
```

## 📁 프로젝트 구조

```
frontend/
├── public/              # 정적 파일
│   └── index.html      # HTML 템플릿
├── src/
│   ├── components/     # React 컴포넌트
│   │   ├── Header.js   # 헤더 컴포넌트
│   │   └── HeroSection.js  # 히어로 섹션 컴포넌트
│   ├── App.js          # 메인 App 컴포넌트
│   ├── App.css         # App 스타일
│   ├── index.js        # 진입점
│   └── index.css       # 전역 스타일
├── package.json        # 프로젝트 설정 및 의존성
├── tailwind.config.js # Tailwind CSS 설정
└── postcss.config.js   # PostCSS 설정
```

## 🎨 스타일링

이 프로젝트는 **Tailwind CSS**를 사용합니다.

- 다크 테마: `#15151E` (f1-dark)
- 포인트 컬러: `#E10600` (f1-red)

## 🔗 API 연동

백엔드 API는 `http://localhost:8080`에서 실행됩니다.

주요 엔드포인트:
- `GET /api/f1/schedule` - F1 경기 일정 조회

## 📝 개발 가이드

### 컴포넌트 추가

새 컴포넌트는 `src/components/` 폴더에 추가하세요.

### 스타일 수정

Tailwind CSS 유틸리티 클래스를 사용하거나, `tailwind.config.js`에서 커스텀 설정을 추가하세요.

