# 🏁 F1 Trip Planner - Backend

F1 Trip Planner의 Spring Boot 백엔드 애플리케이션입니다.

## 🚀 시작하기

### 사전 요구사항

- Java 17 이상
- Gradle (또는 Gradle Wrapper 사용)

### 실행 방법

#### Gradle Wrapper 사용 (권장)

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

#### 직접 Gradle 사용

```bash
gradle bootRun
```

### 빌드

```bash
# JAR 파일 생성
./gradlew build

# 생성된 JAR 파일 실행
java -jar build/libs/myf1-backend-1.0.0.jar
```

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/myf1/
│   │   │   ├── config/          # 설정 클래스
│   │   │   │   ├── EnvConfig.java      # .env 파일 로드
│   │   │   │   └── WebConfig.java      # CORS 설정
│   │   │   ├── controller/       # REST 컨트롤러
│   │   │   │   └── F1Controller.java
│   │   │   ├── service/         # 비즈니스 로직
│   │   │   │   ├── F1ScheduleService.java  # OpenF1 API 연동
│   │   │   │   └── AmadeusService.java      # Amadeus API 연동
│   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   └── F1ScheduleDTO.java
│   │   │   └── MyF1Application.java  # 메인 클래스
│   │   └── resources/
│   │       └── application.yml  # 애플리케이션 설정
│   └── test/                    # 테스트 코드
│       └── java/com/myf1/
│           └── MyF1ApplicationTests.java
├── build.gradle                 # Gradle 빌드 설정
└── settings.gradle             # Gradle 프로젝트 설정
```

## 🔧 설정

### 환경 변수

프로젝트 루트의 `.env` 파일에서 다음 환경 변수를 설정하세요:

```
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
```

자세한 내용은 `../docs/ENV_SETUP.md`를 참조하세요.

### application.yml

주요 설정:
- 서버 포트: `8080`
- CORS: `http://localhost:3000` 허용

## 📡 API 엔드포인트

### F1 일정 조회

```
GET /api/f1/schedule
```

응답 예시:
```json
[
  {
    "meetingName": "Bahrain Grand Prix",
    "dateStart": "2026-03-15T00:00:00Z",
    "countryName": "Bahrain",
    "location": "Sakhir",
    "meetingKey": 1234
  }
]
```

## 🧪 테스트

```bash
# 모든 테스트 실행
./gradlew test

# 특정 테스트 실행
./gradlew test --tests MyF1ApplicationTests
```

## 📦 의존성

주요 의존성:
- Spring Boot Web
- Spring Data JPA
- MySQL Connector
- Lombok
- org.json

전체 목록은 `build.gradle`을 참조하세요.

