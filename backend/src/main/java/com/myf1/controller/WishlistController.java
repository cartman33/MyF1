package com.myf1.controller;

// DTO, 서비스 import
import com.myf1.dto.BookingDtos;
import com.myf1.dto.WishlistDtos;
import com.myf1.service.BookingMockService;
import com.myf1.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking 화면의 검색 기능과 MyPage의 즐겨찾기 관련 API를 제공하는 컨트롤러 클래스
 */
@RestController // 이 클래스가 REST 컨트롤러임을 나타내는 어노테이션
@RequestMapping("/api") // 공통 기본 경로를 설정
public class WishlistController {

    /** Mock Booking 검색 결과를 생성하는 서비스 */
    private final BookingMockService bookingMockService;

    /** 즐겨찾기(위시리스트) 비즈니스 로직을 담당하는 서비스 */
    private final WishlistService wishlistService;

    /**
     * 생성자 주입을 통해 필요한 서비스들을 받아 초기화
     */
    public WishlistController(BookingMockService bookingMockService, WishlistService wishlistService) {
        this.bookingMockService = bookingMockService;
        this.wishlistService = wishlistService;
    }

    /**
     * 항공/숙소 패키지 검색 요청을 처리하는 엔드포인트
     * POST /api/booking/search
     */
    @PostMapping("/booking/search")
    public ResponseEntity<List<BookingDtos.BookingResult>> searchBooking(
            @Valid @RequestBody BookingDtos.BookingSearchRequest request
    ) {
        // BookingMockService를 호출하여 Mock 검색 결과를 생성
        List<BookingDtos.BookingResult> results = bookingMockService.search(request);
        // 생성된 결과 리스트를 200 OK 응답으로 반환
        return ResponseEntity.ok(results);
    }

    /**
     * 즐겨찾기(위시리스트) 항목을 저장하는 엔드포인트
     * POST /api/wishlist
     */
    @PostMapping("/wishlist")
    public ResponseEntity<Void> createWishlist(
            @Valid @RequestBody WishlistDtos.WishlistCreateRequest request
    ) {
        // WishlistService를 통해 위시리스트 항목 생성 및 저장
        wishlistService.createWishlist(request);
        // 본문이 없는 200 OK 응답 반환
        return ResponseEntity.ok().build();
    }

    /**
     * 특정 사용자의 즐겨찾기(여행 패키지) 목록을 조회하는 엔드포인트
     * GET /api/mypage/packages?username=...
     */
    @GetMapping("/mypage/packages")
    public ResponseEntity<List<WishlistDtos.WishlistResponse>> getPackages(@RequestParam String username) {
        // WishlistService를 통해 사용자별 위시리스트 목록 조회
        List<WishlistDtos.WishlistResponse> packages = wishlistService.getWishlistForUser(username);
        // 조회 결과를 200 OK 응답으로 반환
        return ResponseEntity.ok(packages);
    }

    /**
     * 즐겨찾기(여행 패키지) 항목을 삭제하는 엔드포인트
     * DELETE /api/mypage/packages/{id}
     */
    @DeleteMapping("/mypage/packages/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        // WishlistService를 통해 위시리스트 항목 삭제
        wishlistService.deleteWishlist(id);
        // 본문이 없는 204 No Content 응답 반환
        return ResponseEntity.noContent().build();
    }

    /**
     * 패키지의 최저가를 갱신하는 엔드포인트
     * POST /api/booking/refresh-price
     * 패키지 ID와 원본 검색 조건을 받아 최신 가격을 조회하여 반환
     */
    @PostMapping("/booking/refresh-price")
    public ResponseEntity<BookingDtos.BookingResult> refreshPrice(
            @RequestParam String packageId,
            @Valid @RequestBody BookingDtos.BookingSearchRequest request
    ) {
        // BookingMockService의 refreshPrice 메서드를 호출하여 최신 가격 조회
        BookingDtos.BookingResult refreshedResult = bookingMockService.refreshPrice(packageId, request);
        
        // 패키지를 찾지 못한 경우 404 Not Found 반환
        if (refreshedResult == null) {
            return ResponseEntity.notFound().build();
        }
        
        // 갱신된 패키지 정보를 200 OK 응답으로 반환
        return ResponseEntity.ok(refreshedResult);
    }
}


