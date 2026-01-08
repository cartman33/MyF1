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
  ![F1 메인 페이지 시안](../images/F1%20메인%20페이지.png)
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

