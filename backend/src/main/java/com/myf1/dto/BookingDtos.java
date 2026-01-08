package com.myf1.dto;

// 검증을 위한 import
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 항공/숙소 검색(Booking 화면)에서 사용하는 요청/응답 DTO들을 정의하는 클래스
 * 현재 단계에서는 Amadeus API 대신 Mock 데이터를 반환하도록 구성
 */
public class BookingDtos {

    /**
     * 항공/숙소 검색 조건을 표현하는 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingSearchRequest {

        /** 출발 공항 코드 (요구사항에 따라 ICN 고정, 필드로도 전달) */
        @NotBlank
        private String departureAirport;

        /** 도착 도시 이름 (예: "Melbourne") */
        @NotBlank
        private String destinationCity;

        /** 출발 날짜 (YYYY-MM-DD) */
        @NotBlank
        private String departureDate;

        /** 귀국 날짜 (YYYY-MM-DD) - 편도일 경우 null 가능 */
        private String returnDate;

        /** 인원 수 */
        @NotNull
        private Integer passengers;

        /** 숙소 개수 */
        private Integer hotelCount;

        /** 항공 옵션: "round-trip" (왕복) 또는 "one-way" (편도) */
        private String flightType;

        /** 경유 옵션: "direct" (직항) 또는 "connecting" (경유) */
        private String flightRoute;

        /** F1 티켓 구역 선택 (예: "WEST AREA", "PADDOCK CLUB") */
        private String ticketArea;

        /** F1 티켓 날짜 옵션 (예: "1일권", "2일권", "전체") */
        private String ticketDateOption;
    }

    /**
     * Booking 검색 결과로 내려보낼 F1 패키지(티켓+항공+숙소) 정보를 표현하는 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingResult {

        /** 경기 이름 */
        private String raceName;

        /** 경기 개최 도시 */
        private String destinationCity;

        /** 경기 날짜 */
        private String raceDate;

        /** 좌석 정보 */
        private String seatInfo;

        /** 티켓 가격 */
        private Integer ticketPrice;

        /** 항공 최저가 */
        private Integer flightLowestPrice;

        /** 숙소 최저가 */
        private Integer hotelLowestPrice;

        /** 항공사 이름 (예: "대한항공", "아시아나항공") */
        private String airlineName;

        /** 항공편명 (예: "KE001", "OZ101") */
        private String flightNumber;

        /** 숙소 명칭 (예: "Grand Hotel Melbourne") */
        private String hotelName;

        /** 패키지 고유 ID (갱신 기능을 위한 식별자) */
        private String packageId;
    }
}


