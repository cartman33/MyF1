package com.myf1.dto;

// Lombok 라이브러리의 어노테이션들을 사용하기 위한 import
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * F1 경기 일정 정보를 담는 데이터 전송 객체 (DTO)
 * 프론트엔드로 전달할 데이터의 구조를 정의
 */
@Data // Lombok이 자동으로 Getter, Setter, toString 등을 생성
@NoArgsConstructor // 매개변수 없는 기본 생성자 자동 생성
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자 자동 생성
public class F1ScheduleDTO {
    
    // 경기 이름 (예: "Bahrain Grand Prix")
    private String meetingName;
    
    // 경기 시작 날짜 (ISO 8601 형식: "2026-03-15T00:00:00Z")
    private String dateStart;
    
    // 경기 종료 날짜 (ISO 8601 형식: "2026-03-17T00:00:00Z")
    // 전체 경기 기간(Start ~ End)을 표시하기 위해 추가된 필드
    private String dateEnd;
    
    // 경기 개최 국가
    private String countryName;
    
    // 경기 개최 도시
    private String location;
    
    // 경기 고유 ID (OpenF1 API에서 제공)
    private Integer meetingKey;
}

