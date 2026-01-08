package com.myf1.service;

// 도메인, DTO, 리포지토리 import
import com.myf1.domain.User;
import com.myf1.domain.Wishlist;
import com.myf1.dto.WishlistDtos;
import com.myf1.repository.UserRepository;
import com.myf1.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 위시리스트(즐겨찾기) 관련 비즈니스 로직을 담당하는 서비스 클래스
 * Booking 화면에서 즐겨찾기 저장, MyPage에서 조회/삭제 기능을 제공
 */
@Service // 이 클래스가 서비스 빈으로 등록되도록 하는 어노테이션
@Transactional // DB 변경 작업을 트랜잭션으로 묶어주는 어노테이션
public class WishlistService {

    /** Wishlist 엔티티에 대한 CRUD 작업을 수행하는 리포지토리 */
    private final WishlistRepository wishlistRepository;

    /** User 엔티티를 조회하기 위한 리포지토리 */
    private final UserRepository userRepository;

    /**
     * 생성자 주입을 통해 리포지토리들을 받아 초기화
     */
    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
    }

    /**
     * 즐겨찾기 항목을 생성하여 저장하는 메서드
     * 1) username으로 User 조회
     * 2) Wishlist 엔티티 생성
     * 3) DB에 저장
     */
    public void createWishlist(WishlistDtos.WishlistCreateRequest request) {
        // username으로 사용자 엔티티 조회 (없으면 예외 발생)
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 요청 DTO를 기반으로 Wishlist 엔티티 객체 생성
        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .raceName(request.getRaceName())
                .seatInfo(request.getSeatInfo())
                .ticketPrice(request.getTicketPrice())
                .flightLowestPrice(request.getFlightLowestPrice())
                .hotelLowestPrice(request.getHotelLowestPrice())
                .departureAirport(request.getDepartureAirport())
                .destinationCity(request.getDestinationCity())
                .raceDate(request.getRaceDate())
                .build();

        // 리포지토리를 통해 DB에 저장
        wishlistRepository.save(wishlist);
    }

    /**
     * 특정 사용자의 모든 즐겨찾기(여행 패키지) 목록을 조회하는 메서드
     * @return 마이페이지에서 사용할 응답 DTO 리스트
     */
    @Transactional(readOnly = true)
    public List<WishlistDtos.WishlistResponse> getWishlistForUser(String username) {
        // username으로 사용자 엔티티 조회 (없으면 예외 발생)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 사용자의 위시리스트 엔티티 목록 조회
        List<Wishlist> wishlists = wishlistRepository.findByUser(user);

        // 엔티티 목록을 응답 DTO 목록으로 변환하여 반환
        return wishlists.stream()
                .map(w -> new WishlistDtos.WishlistResponse(
                        w.getId(),
                        w.getRaceName(),
                        w.getSeatInfo(),
                        w.getTicketPrice(),
                        w.getFlightLowestPrice(),
                        w.getHotelLowestPrice(),
                        w.getDepartureAirport(),
                        w.getDestinationCity(),
                        w.getRaceDate()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 위시리스트 항목을 삭제하는 메서드
     * 간단하게 ID만으로 삭제하며, 추가적인 권한 검사는 추후 확장 가능
     */
    public void deleteWishlist(Long id) {
        // 존재 여부와 상관없이 deleteById 호출 (존재하지 않으면 예외는 발생하지 않음)
        wishlistRepository.deleteById(id);
    }
}


