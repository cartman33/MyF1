# 🏁 Software Requirements Specification (SRS): F1 Trip Planner

## 1. Project Overview
- **Project Name:** F1 Trip Planner (가칭: My F1)
- **Goal:** F1 공식 경기 일정을 기반으로, 직관을 희망하는 팬들에게 해당 개최지로 가는 **최적의 항공권 및 숙박 정보**를 통합 제공합니다.
- **Key Value:** 사용자가 직접 날짜와 장소를 검색할 필요 없이, 그랑프리 선택만으로 여행 계획의 핵심 데이터(항공+숙소)를 즉시 파악할 수 있도록 돕습니다.

---

## 2. Tech Stack (기술 스택)

| 분류 | 기술 스택 | 비고 |
| :--- | :--- | :--- |
| **IDE** | IntelliJ IDEA / Cursor | AI 기반 개발 및 자바 환경 최적화 |
| **Frontend** | React.js | UI 컴포넌트 기반 및 Axios 통신 |
| **Backend** | Java (Spring Boot) | RESTful API 서버 구축 |
| **Database** | MySQL | 유저 정보 및 관심 레이스(위시리스트) 저장 |
| **Schedule API** | [OpenF1 API](https://openf1.org/) | 공식 경기 일정 데이터 추출 (2026 시즌) |
| **Travel API** | [Amadeus API](https://developers.amadeus.com/) | 실시간 항공권 및 숙박 가격 조회 |

---

## 3. Functional Requirements (주요 기능)

### 3.1 F1 공식 일정 관리 (Schedule Management)
- **OpenF1 API**를 호출하여 2026년 시즌의 전체 그랑프리 일정(대회명, 국가, 도시, 시작 날짜)을 서버로 로드합니다.
- 사용자는 메인 화면에서 연간 전체 레이스 리스트를 시각적으로 확인할 수 있습니다.

### 3.2 통합 여행 검색 (Integrated Search)
- 사용자가 특정 그랑프리를 선택하면 시스템이 자동으로 개최지의 공항 코드와 경기 날짜를 검색 파라미터로 설정합니다.
- **Amadeus API**를 연동하여 유저의 '출발지'에서 '개최지'로 가는 최저가/최적 항공권 및 인근 숙소 정보를 반환합니다.

### 3.3 유저 서비스 (User Services)
- JWT 기반의 회원가입 및 로그인 기능을 제공합니다.
- 관심 있는 그랑프리 일정을 '위시리스트'에 저장하고 마이페이지에서 관리하는 기능을 구현합니다.

---

## 4. Implementation Details: F1 Schedule Fetcher
OpenF1 API를 통해 경기 일정을 가져오는 백엔드 핵심 로직입니다. 이 코드는 추후 Spring Boot의 Service 레이어로 전환하여 구현됩니다.

```java 
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * OpenF1 API를 사용하여 2026년 F1 일정을 가져오는 로직입니다.
 */
public class F1ScheduleFetcher {
    public static void main(String[] args) {
        String url = "https://api.openf1.org/v1/meetings?year=2026";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JSONArray meetings = new JSONArray(response.body());
                for (int i = 0; i < meetings.length(); i++) {
                    JSONObject meeting = meetings.getJSONObject(i);
                    String name = meeting.getString("meeting_name");
                    String date = meeting.getString("date_start");
                    System.out.println(date.split("T")[0] + " | " + name);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
---

## 5. UI/UX Concept & Design Reference

### 5.1 전체 테마 (Theme)
- F1 공식 브랜드의 아이덴티티를 반영한 **다크 테마 (#15151E 배경)**를 적용합니다.

### 5.2 메인 히어로 섹션 (Main Hero Section)
- **시각 요소**: "Only For Your Watching Live F1 Planner" 문구를 좌측에 배치하여 서비스 정체성을 강조합니다.
- **그래픽 요소**: 우측에 체커 플래그(Checked Flag) 이미지와 역동적인 요소를 배치합니다.
- **상호 작용**: 눈에 띄는 디자인의 **'Start'** 버튼을 배치하여 검색/일정 페이지로의 진입을 유도합니다.

### 5.3 네비게이션 (Navigation)
- **좌측**: `My F1` 로고 (Red 포인트 컬러 적용)
- **중앙**: `Schedule`, `Booking`, `MyPage` 메뉴 배치
- **우측**: 아이콘과 함께 `LOGIN` 버튼 구성

### 5.4 디자인 초안
- 사용자 제공 파일 `F1_Main_Page.png`의 레이아웃을 기반으로 컴포넌트를 설계합니다.
- **시안 이미지:**
  ![F1 메인 페이지 시안](./images/F1%20메인%20페이지.png)
---

## 6. Implementation Strategy

### 6.1 Backend Development
- Spring Boot 프로젝트를 생성하고, `AmadeusService`와 `OpenF1Service`를 구축하여 데이터를 처리하는 REST API 엔드포인트를 노출합니다.

### 6.2 Frontend Development
- React 프로젝트를 생성하고 Tailwind CSS 또는 Styled Components를 사용하여 초안 이미지와 동일한 UI 컴포넌트를 제작합니다.

### 6.3 Database Integration
- MySQL을 연동하여 JPA(Java Persistence API)를 통해 사용자 정보 및 관심 레이스 데이터를 관리합니다.

### 6.4 Data Integration
- Axios 라이브러리를 통해 프론트엔드에서 백엔드 API를 호출하고 실시간 데이터를 화면에 바인딩합니다.

---

## 7. Implementation Status (구현 현황)

> **참고**: 이 섹션은 실제 구현된 내용을 설명하는 부분입니다. 위의 1-6번 섹션은 프로젝트 초기 요구사항 명세이며, 아래 내용은 실제 개발 과정에서 구현된 내용입니다.

### 7.1 Backend 구현 완료 사항

#### 7.1.1 프로젝트 구조
- **Spring Boot 3.2.0** 기반 백엔드 프로젝트 구성
- **Gradle** 빌드 시스템 사용
- 표준 Maven 디렉토리 구조 준수 (`src/main/java`, `src/test/java`)

#### 7.1.2 F1ScheduleService 구현
- **위치**: `backend/src/main/java/com/myf1/service/F1ScheduleService.java`
- **기능**: 
  - OpenF1 API (`https://api.openf1.org/v1/meetings?year=2026`)를 호출하여 2026년 F1 경기 일정 조회
  - HTTP GET 요청을 통해 JSON 데이터 수신
  - JSON 파싱 후 `F1ScheduleDTO` 객체로 변환하여 리스트 반환
- **구현 세부사항**:
  - `HttpClient`를 사용한 비동기 HTTP 통신
  - `org.json` 라이브러리를 활용한 JSON 파싱
  - 에러 처리 및 예외 상황 대응

#### 7.1.3 AmadeusService 구현
- **위치**: `backend/src/main/java/com/myf1/service/AmadeusService.java`
- **기능**:
  - Amadeus API OAuth 2.0 인증을 통한 액세스 토큰 발급
  - 토큰 캐싱 및 만료 시간 관리 (토큰 재사용으로 API 호출 최소화)
- **구현 세부사항**:
  - Basic Authentication 방식 사용 (API Key + Secret을 Base64 인코딩)
  - `grant_type=client_credentials`를 사용한 서버 간 인증
  - 토큰 만료 시간(`expires_in`)을 기반으로 한 자동 갱신 로직

#### 7.1.4 F1Controller 구현
- **위치**: `backend/src/main/java/com/myf1/controller/F1Controller.java`
- **엔드포인트**:
  - `GET /api/f1/schedule`: 2026년 F1 경기 일정 조회
- **응답 형식**: JSON 배열 형태의 `F1ScheduleDTO` 리스트

#### 7.1.5 환경 변수 관리
- **EnvConfig 클래스**: `backend/src/main/java/com/myf1/config/EnvConfig.java`
  - 프로젝트 루트의 `.env` 파일을 자동으로 읽어 시스템 프로퍼티로 설정
  - 애플리케이션 시작 시 자동 실행 (`@PostConstruct` 사용)
- **application.yml 설정**:
  - 환경 변수 참조: `${AMADEUS_API_KEY}`, `${AMADEUS_API_SECRET}`
  - 서버 포트: `8080`

#### 7.1.6 CORS 설정
- **WebConfig 클래스**: `backend/src/main/java/com/myf1/config/WebConfig.java`
  - 프론트엔드(`http://localhost:3000`)와의 통신 허용
  - 모든 HTTP 메서드 및 헤더 허용 설정

### 7.2 Frontend 구현 완료 사항

#### 7.2.1 프로젝트 구조
- **React 18.2.0** 기반 프론트엔드 프로젝트
- **Create React App** 템플릿 사용
- 컴포넌트 기반 아키텍처

#### 7.2.2 UI 컴포넌트 구현

**Header 컴포넌트** (`frontend/src/components/Header.js`):
- "My F1" 로고 (F1 레드 컬러 `#E10600` 적용)
- 네비게이션 메뉴: Schedule, Booking, MyPage
- LOGIN 버튼 (우측 정렬)
- Tailwind CSS를 사용한 반응형 디자인

**HeroSection 컴포넌트** (`frontend/src/components/HeroSection.js`):
- 메인 카피: "Only For Your Watching Live F1 Planner"
- 체커 플래그 그래픽 (CSS Grid를 활용한 체커 패턴 구현)
- Start 버튼 (호버 효과 포함)
- F1 일정 데이터 표시 영역 (백엔드 API 연동)

#### 7.2.3 스타일링
- **Tailwind CSS 3.3.6** 사용
- 커스텀 색상 정의:
  - `f1-dark`: `#15151E` (배경색)
  - `f1-red`: `#E10600` (포인트 컬러)
- 다크 테마 일관성 유지

#### 7.2.4 API 연동
- **Axios 1.6.0** 라이브러리 사용
- `useEffect` 훅을 활용한 컴포넌트 마운트 시 데이터 로딩
- 백엔드 API (`http://localhost:8080/api/f1/schedule`) 호출
- 로딩 상태 관리 및 에러 처리
- 콘솔 로그를 통한 데이터 확인

### 7.3 프로젝트 구조 최적화

#### 7.3.1 표준 프로젝트 구조
- Backend와 Frontend 명확히 분리
- `docs/` 폴더에 프로젝트 문서 중앙 집중
- `scripts/` 폴더에 유틸리티 스크립트 관리
- `images/` 폴더에 디자인 자산 보관

#### 7.3.2 개발 환경 설정
- **.editorconfig**: 에디터 간 일관된 코딩 스타일 유지
- **.gitattributes**: Git 속성 설정 (줄 끝 정규화 등)
- **.gitignore**: 포괄적인 제외 규칙 (빌드 파일, IDE 설정, 환경 변수 등)

#### 7.3.3 문서화
- 각 모듈별 README.md 파일 작성
- 프로젝트 구조 가이드 (`PROJECT_STRUCTURE.md`)
- 환경 변수 설정 가이드 (`docs/ENV_SETUP.md`)

### 7.4 보안 구현

#### 7.4.1 API 키 관리
- `.env` 파일에 민감 정보 저장
- `.gitignore`를 통한 Git 제외
- 환경 변수를 통한 런타임 주입
- 소스 코드에 하드코딩 방지

### 7.5 테스트

#### 7.5.1 백엔드 테스트
- `MyF1ApplicationTests.java`: 기본 통합 테스트 (컨텍스트 로드 확인)
- 테스트 디렉토리 구조 준비 (`src/test/java`)

#### 7.5.2 API 테스트 스크립트
- `scripts/test-amadeus-api.js`: Amadeus API 연동 테스트 유틸리티

---

## 8. 향후 개발 계획

### 8.1 미구현 기능
- JWT 기반 인증 시스템 (회원가입/로그인)
- 위시리스트 기능 (MySQL 데이터베이스 연동)
- 항공권 및 숙박 검색 기능 (Amadeus API 활용)
- 사용자 마이페이지

### 8.2 개선 사항
- 에러 처리 강화
- 로깅 시스템 구축
- API 문서화 (Swagger/OpenAPI)
- 단위 테스트 및 통합 테스트 확대
- 프론트엔드 상태 관리 (Redux 또는 Context API)

---

## 9. 참고 자료

- [OpenF1 API 문서](https://openf1.org/)
- [Amadeus API 문서](https://developers.amadeus.com/)
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

