# 🏁 F1 Trip Planner (My F1)

F1 공식 경기 일정을 기반으로 최적의 항공권 및 숙박 정보를 통합 제공하는 웹 애플리케이션입니다.

## 📋 프로젝트 구조

```
MyF1/
├── backend/                 # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/myf1/
│   │   │   │   ├── config/          # 설정 클래스
│   │   │   │   ├── controller/      # REST 컨트롤러
│   │   │   │   ├── service/         # 비즈니스 로직
│   │   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   └── MyF1Application.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/                    # 테스트 코드
│   │       └── java/com/myf1/
│   ├── gradle/                      # Gradle Wrapper
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradlew                      # Gradle Wrapper (Unix)
│   ├── gradlew.bat                  # Gradle Wrapper (Windows)
│   └── README.md
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── App.js
│   │   ├── index.js
│   │   └── *.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── README.md
├── docs/                    # 프로젝트 문서
│   ├── SRS.md              # 소프트웨어 요구사항 명세서
│   ├── ENV_SETUP.md        # 환경 변수 설정 가이드
│   └── README.md
├── scripts/                 # 유틸리티 스크립트
│   └── test-amadeus-api.js  # Amadeus API 테스트 스크립트
├── images/                  # 디자인 시안 및 이미지
│   └── F1 메인 페이지.png
├── .env                     # 환경 변수 (Git에 커밋하지 않음!)
├── .gitignore              # Git 제외 파일 목록
├── .gitattributes          # Git 속성 설정
├── .editorconfig           # 에디터 설정
└── README.md               # 프로젝트 메인 README
```

## 🚀 시작하기

### 사전 요구사항

- Java 17 이상
- Node.js 16 이상
- npm 또는 yarn

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Amadeus API 키와 시크릿을 추가하세요.

자세한 내용은 [`docs/ENV_SETUP.md`](docs/ENV_SETUP.md)를 참조하세요.

### 2. 백엔드 실행

```bash
# backend 디렉토리로 이동
cd backend

# Gradle을 사용하여 애플리케이션 실행
./gradlew bootRun

# 또는 Windows의 경우
gradlew.bat bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

### 3. 프론트엔드 실행

새 터미널에서:

```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

## 🛠 기술 스택

### Backend
- Spring Boot 3.2.0
- Java 17
- Spring Data JPA
- MySQL Connector
- Lombok
- org.json

### Frontend
- React 18.2.0
- Tailwind CSS 3.3.6
- Axios 1.6.0

### APIs
- OpenF1 API (F1 경기 일정)
- Amadeus API (항공권 및 숙박 정보)

## 📝 주요 기능

1. **F1 경기 일정 조회**: OpenF1 API를 통해 2026년 F1 경기 일정을 가져옵니다.
2. **통합 여행 검색**: Amadeus API를 연동하여 항공권 및 숙박 정보를 제공합니다.
3. **반응형 UI**: Tailwind CSS를 사용한 모던한 다크 테마 디자인입니다.

## 🔒 보안

- Amadeus API 키는 `.env` 파일에 저장되며, 절대 Git에 커밋하지 마세요.
- `application.yml`에서 환경 변수를 참조하여 사용합니다.

## 📚 문서

- [프로젝트 구조 가이드](PROJECT_STRUCTURE.md) - 폴더 구조 및 각 파일의 역할 설명
- [소프트웨어 요구사항 명세서 (SRS)](SRS.md) - 프로젝트 루트의 메인 SRS 문서
- [SRS (문서 폴더)](docs/SRS.md) - 문서 폴더의 SRS 복사본
- [환경 변수 설정 가이드](docs/ENV_SETUP.md)
- [백엔드 README](backend/README.md)
- [프론트엔드 README](frontend/README.md)

## 🧪 테스트

### Amadeus API 테스트

```bash
# Amadeus API 연동 테스트 스크립트 실행
node scripts/test-amadeus-api.js
```

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

