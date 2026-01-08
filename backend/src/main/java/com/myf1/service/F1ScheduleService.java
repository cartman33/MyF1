package com.myf1.service;

// 필요한 클래스들을 import
import com.myf1.dto.F1ScheduleDTO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * OpenF1 API를 사용하여 F1 경기 일정을 가져오는 서비스 클래스
 * SRS 4번 섹션의 로직을 기반으로 구현
 */
@Service // Spring이 이 클래스를 서비스 빈으로 관리하도록 하는 어노테이션
public class F1ScheduleService {

    // OpenF1 API의 기본 URL
    private static final String OPENF1_API_URL = "https://api.openf1.org/v1/meetings";
    
    // HTTP 요청을 보내기 위한 클라이언트 객체
    private final HttpClient httpClient;

    // 생성자 - HttpClient 인스턴스를 초기화
    public F1ScheduleService() {
        // HTTP 요청을 보낼 수 있는 클라이언트 객체 생성
        this.httpClient = HttpClient.newHttpClient();
    }

    /**
     * 2026년 F1 경기 일정을 가져오는 메서드
     * @return F1 경기 일정 리스트
     */
    public List<F1ScheduleDTO> get2026Schedule() {
        // 반환할 일정 리스트를 담을 ArrayList 생성
        List<F1ScheduleDTO> schedules = new ArrayList<>();
        
        try {
            // OpenF1 API에 2026년 경기 일정을 요청하는 URL 생성
            String url = OPENF1_API_URL + "?year=2026";
            
            // HTTP GET 요청 객체 생성
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url)) // 요청할 URL 설정
                    .GET() // GET 메서드 사용
                    .build(); // 요청 객체 생성
            
            // HTTP 요청을 보내고 응답을 받음
            HttpResponse<String> response = httpClient.send(
                    request, 
                    HttpResponse.BodyHandlers.ofString() // 응답을 문자열로 받음
            );
            
            // HTTP 응답 코드가 200 (성공)인지 확인
            if (response.statusCode() == 200) {
                // 응답 본문을 JSON 배열로 파싱
                JSONArray meetings = new JSONArray(response.body());
                
                // JSON 배열의 각 요소를 순회하면서 처리
                for (int i = 0; i < meetings.length(); i++) {
                    // 배열의 i번째 요소를 JSON 객체로 가져옴
                    JSONObject meeting = meetings.getJSONObject(i);
                    
                    // JSON 객체에서 필요한 정보를 추출하여 DTO 객체 생성
                    F1ScheduleDTO dto = new F1ScheduleDTO();
                    dto.setMeetingName(meeting.optString("meeting_name", "Unknown")); // 경기 이름
                    dto.setDateStart(meeting.optString("date_start", "")); // 시작 날짜
                    dto.setDateEnd(meeting.optString("date_end", "")); // 종료 날짜 (전체 기간 표시용)
                    dto.setCountryName(meeting.optString("country_name", "Unknown")); // 국가명
                    dto.setLocation(meeting.optString("location", "Unknown")); // 도시명
                    dto.setMeetingKey(meeting.optInt("meeting_key", 0)); // 경기 고유 ID
                    
                    // 생성한 DTO를 리스트에 추가
                    schedules.add(dto);
                }
            } else {
                // HTTP 응답 코드가 200이 아닌 경우 에러 로그 출력
                System.err.println("OpenF1 API 요청 실패: " + response.statusCode());
            }
            
        } catch (Exception e) {
            // 예외 발생 시 스택 트레이스 출력
            e.printStackTrace();
        }
        
        // 일정 리스트 반환
        return schedules;
    }
}

