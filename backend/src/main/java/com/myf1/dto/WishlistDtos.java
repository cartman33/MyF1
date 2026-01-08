package com.myf1.dto;

// 검증을 위한 import
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 위시리스트(즐겨찾기) 관련 요청과 응답에 사용되는 DTO들을 정의하는 클래스
 * Booking, MyPage 화면에서 사용하는 데이터 형태를 표현
 */
public class WishlistDtos {

    /**
     * 즐겨찾기 항목을 생성할 때 클라이언트가 전달하는 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistCreateRequest {

        /** 로그인한 사용자 이름 (백엔드에서 세션/토큰으로 대체 가능, 현재는 단순 필드 사용) */
        @NotBlank
        private String username;

        /** 경기 이름 */
        @NotBlank
        private String raceName;

        /** 좌석 정보 */
        @NotBlank
        private String seatInfo;

        /** 티켓 가격 */
        @NotNull
        private Integer ticketPrice;

        /** 항공 최저가 */
        @NotNull
        private Integer flightLowestPrice;

        /** 숙소 최저가 */
        @NotNull
        private Integer hotelLowestPrice;

        /** 출발 공항 코드 (ICN 고정) */
        @NotBlank
        private String departureAirport;

        /** 도착 도시 이름 */
        @NotBlank
        private String destinationCity;

        /** 경기 날짜 (YYYY-MM-DD) */
        @NotBlank
        private String raceDate;
    }

    /**
     * 마이페이지에서 노출할 즐겨찾기(여행 패키지) 정보를 표현하는 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistResponse {

        /** 위시리스트 항목 고유 ID */
        private Long id;

        /** 경기 이름 */
        private String raceName;

        /** 좌석 정보 */
        private String seatInfo;

        /** 티켓 가격 */
        private Integer ticketPrice;

        /** 항공 최저가 */
        private Integer flightLowestPrice;

        /** 숙소 최저가 */
        private Integer hotelLowestPrice;

        /** 출발 공항 코드 */
        private String departureAirport;

        /** 도착 도시 이름 */
        private String destinationCity;

        /** 경기 날짜 */
        private String raceDate;
    }
}


