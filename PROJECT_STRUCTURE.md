# 📁 프로젝트 구조 가이드

이 문서는 F1 Trip Planner 프로젝트의 최적화된 폴더 구조를 설명합니다.

## 🎯 최적화 원칙

1. **관심사의 분리**: Backend와 Frontend를 명확히 분리
2. **표준 구조 준수**: Spring Boot와 React의 표준 프로젝트 구조 따름
3. **문서화**: 각 폴더와 파일의 역할을 명확히 문서화
4. **확장성**: 향후 기능 추가를 고려한 구조

## 📂 전체 구조

```
MyF1/
├── backend/                    # Spring Boot 백엔드 애플리케이션
│   ├── src/
│   │   ├── main/              # 메인 소스 코드
│   │   │   ├── java/          # Java 소스 파일
│   │   │   └── resources/     # 설정 파일 및 리소스
│   │   └── test/              # 테스트 코드
│   ├── gradle/                # Gradle Wrapper 파일
│   ├── build.gradle           # Gradle 빌드 설정
│   ├── settings.gradle        # Gradle 프로젝트 설정
│   ├── gradlew                # Gradle Wrapper (Unix)
│   ├── gradlew.bat            # Gradle Wrapper (Windows)
│   └── README.md              # 백엔드 전용 README
│
├── frontend/                   # React 프론트엔드 애플리케이션
│   ├── src/                   # React 소스 코드
│   │   ├── components/        # React 컴포넌트
│   │   ├── App.js            # 메인 App 컴포넌트
│   │   └── index.js          # 진입점
│   ├── public/               # 정적 파일
│   ├── package.json          # npm 의존성 및 스크립트
│   ├── tailwind.config.js    # Tailwind CSS 설정
│   ├── postcss.config.js     # PostCSS 설정
│   ├── .env.example          # 환경 변수 예제
│   └── README.md             # 프론트엔드 전용 README
│
├── docs/                      # 프로젝트 문서
│   ├── SRS.md                # 소프트웨어 요구사항 명세서
│   ├── ENV_SETUP.md          # 환경 변수 설정 가이드
│   └── README.md             # 문서 폴더 설명
│
├── scripts/                   # 유틸리티 스크립트
│   └── test-amadeus-api.js   # Amadeus API 테스트 스크립트
│
├── images/                     # 디자인 시안 및 이미지
│   └── F1 메인 페이지.png
│
├── .env                       # 환경 변수 (Git 제외)
├── .gitignore                # Git 제외 파일 목록
├── .gitattributes            # Git 속성 설정
├── .editorconfig             # 에디터 설정
├── README.md                  # 프로젝트 메인 README
└── PROJECT_STRUCTURE.md       # 이 파일
```

## 📝 각 폴더 설명

### backend/
Spring Boot 백엔드 애플리케이션

- **src/main/java/**: 비즈니스 로직 및 API 구현
  - `config/`: 설정 클래스 (CORS, 환경 변수 등)
  - `controller/`: REST API 컨트롤러
  - `service/`: 비즈니스 로직 서비스
  - `dto/`: 데이터 전송 객체
- **src/main/resources/**: 설정 파일
  - `application.yml`: Spring Boot 설정
- **src/test/**: 단위 테스트 및 통합 테스트

### frontend/
React 프론트엔드 애플리케이션

- **src/components/**: 재사용 가능한 React 컴포넌트
- **src/**: 메인 애플리케이션 코드
- **public/**: 정적 파일 (HTML, 이미지 등)

### docs/
프로젝트 문서

- 모든 프로젝트 관련 문서를 중앙 집중식으로 관리
- SRS, API 문서, 가이드 등 포함

### scripts/
유틸리티 스크립트

- 개발 및 테스트에 유용한 스크립트
- API 테스트, 데이터 마이그레이션 등

### images/
디자인 자산

- UI/UX 디자인 시안
- 로고 및 이미지 파일

## 🔧 설정 파일

### 루트 레벨 설정 파일

- **.env**: 환경 변수 (보안상 Git 제외)
- **.gitignore**: Git에서 제외할 파일 목록
- **.gitattributes**: Git 속성 설정 (줄 끝 정규화 등)
- **.editorconfig**: 에디터 간 일관된 코딩 스타일 유지

## 🚀 초기 설정

### Gradle Wrapper 초기화

백엔드에서 Gradle Wrapper를 사용하려면:

```bash
cd backend
gradle wrapper --gradle-version 8.5
```

또는 이미 설치된 Gradle이 있다면:

```bash
cd backend
gradle wrapper
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하세요:

```
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
```

자세한 내용은 [`docs/ENV_SETUP.md`](docs/ENV_SETUP.md)를 참조하세요.

## 📚 추가 리소스

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

