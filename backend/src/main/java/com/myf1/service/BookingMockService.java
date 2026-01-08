package com.myf1.service;

// DTO import
import com.myf1.dto.BookingDtos;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Amadeus API 연동 전 단계에서 사용할 Mock Booking 서비스 클래스
 * 정적인 더미 데이터를 생성하여 항공/숙소 패키지 검색 결과를 흉내 냄
 */
@Service // 이 클래스가 서비스 빈으로 등록되도록 하는 어노테이션
public class BookingMockService {

    /**
     * 전달받은 검색 조건을 기반으로, 하드코딩된 Mock 패키지 리스트를 반환하는 메서드
     * 편도/왕복에 따른 가격 차등화 및 상세 정보(항공사명, 항공편명, 숙소명) 포함
     */
    public List<BookingDtos.BookingResult> search(BookingDtos.BookingSearchRequest request) {
        // 결과 리스트를 담을 ArrayList 생성
        List<BookingDtos.BookingResult> results = new ArrayList<>();

        // 목적지에 따라 간단한 더미 데이터를 분기 생성 (실제 구현에서는 Amadeus API 호출로 대체)
        String destination = request.getDestinationCity();
        
        // 편도/왕복 여부 확인 (기본값은 왕복)
        boolean isOneWay = "one-way".equalsIgnoreCase(request.getFlightType());
        
        // 티켓 구역 정보 생성 (요청에서 받은 값 또는 기본값 사용)
        String ticketArea = request.getTicketArea() != null ? request.getTicketArea() : "Main Grandstand";
        String ticketDateOption = request.getTicketDateOption() != null ? request.getTicketDateOption() : "전체";
        String seatInfo = ticketArea + ", " + ticketDateOption;

        if ("Melbourne".equalsIgnoreCase(destination)) {
            // 2026 멜버른 F1 패키지 예시 데이터
            // 편도일 경우 항공 가격을 왕복의 60%로 계산
            int baseFlightPrice = 1200000;
            int flightPrice = isOneWay ? (int)(baseFlightPrice * 0.6) : baseFlightPrice;
            
            results.add(new BookingDtos.BookingResult(
                    "Australian Grand Prix",
                    "Melbourne",
                    "2026-03-06",
                    seatInfo,
                    850000,
                    flightPrice,
                    650000,
                    "대한항공", // 항공사 이름
                    "KE601", // 항공편명
                    "Grand Hotel Melbourne", // 숙소 명칭
                    "pkg_mel_001" // 패키지 고유 ID
            ));
        } else if ("Monte Carlo".equalsIgnoreCase(destination) || "Monaco".equalsIgnoreCase(destination)) {
            // 2026 모나코 F1 패키지 예시 데이터
            int baseFlightPrice = 1450000;
            int flightPrice = isOneWay ? (int)(baseFlightPrice * 0.6) : baseFlightPrice;
            
            results.add(new BookingDtos.BookingResult(
                    "Monaco Grand Prix",
                    "Monte Carlo",
                    "2026-06-05",
                    seatInfo,
                    1800000,
                    flightPrice,
                    950000,
                    "에어프랑스", // 항공사 이름
                    "AF275", // 항공편명
                    "Hotel Hermitage Monte-Carlo", // 숙소 명칭
                    "pkg_monaco_001" // 패키지 고유 ID
            ));
        } else if ("Suzuka".equalsIgnoreCase(destination) || "Japan".equalsIgnoreCase(destination)) {
            // 스즈카 서킷 F1 패키지 예시 데이터 (특정 구역 선택 가능)
            int baseFlightPrice = 800000;
            int flightPrice = isOneWay ? (int)(baseFlightPrice * 0.6) : baseFlightPrice;
            
            results.add(new BookingDtos.BookingResult(
                    "Japanese Grand Prix",
                    "Suzuka",
                    "2026-03-27",
                    seatInfo,
                    650000,
                    flightPrice,
                    450000,
                    "일본항공", // 항공사 이름
                    "JL701", // 항공편명
                    "Suzuka Circuit Hotel", // 숙소 명칭
                    "pkg_suzuka_001" // 패키지 고유 ID
            ));
        } else {
            // 그 외 목적지에 대한 기본 예시 데이터
            int baseFlightPrice = 900000;
            int flightPrice = isOneWay ? (int)(baseFlightPrice * 0.6) : baseFlightPrice;
            
            results.add(new BookingDtos.BookingResult(
                    "F1 Grand Prix Package",
                    destination,
                    request.getDepartureDate(),
                    seatInfo,
                    550000,
                    flightPrice,
                    500000,
                    "대한항공", // 항공사 이름
                    "KE001", // 항공편명
                    "Grand Hotel " + destination, // 숙소 명칭
                    "pkg_default_001" // 패키지 고유 ID
            ));
        }

        // 구성된 Mock 결과 리스트 반환
        return results;
    }
    
    /**
     * 패키지 ID를 기반으로 최저가를 갱신하는 메서드
     * 실제 구현에서는 Amadeus API를 다시 호출하여 최신 가격을 가져옴
     * @param packageId 갱신할 패키지의 고유 ID
     * @param request 원본 검색 요청 정보
     * @return 갱신된 패키지 정보
     */
    public BookingDtos.BookingResult refreshPrice(String packageId, BookingDtos.BookingSearchRequest request) {
        // 원본 검색 결과를 다시 생성
        List<BookingDtos.BookingResult> results = search(request);
        
        // 패키지 ID로 해당 패키지 찾기
        for (BookingDtos.BookingResult result : results) {
            if (packageId.equals(result.getPackageId())) {
                // 실제 구현에서는 여기서 Amadeus API를 다시 호출하여 최신 가격을 가져옴
                // 현재는 Mock 데이터이므로 약간의 가격 변동을 시뮬레이션
                int priceVariation = (int)(Math.random() * 100000) - 50000; // ±50,000원 변동
                result.setFlightLowestPrice(Math.max(500000, result.getFlightLowestPrice() + priceVariation));
                result.setHotelLowestPrice(Math.max(300000, result.getHotelLowestPrice() + (priceVariation / 2)));
                return result;
            }
        }
        
        // 패키지를 찾지 못한 경우 null 반환
        return null;
    }
}


