package com.myf1.domain;

// JPA 관련 어노테이션 import
import jakarta.persistence.*;
// Lombok 어노테이션 import
import lombok.*;

/**
 * 사용자가 즐겨찾기한 F1 여행 패키지를 저장하는 위시리스트 엔티티 클래스
 * 경기 정보와 항공/숙소 최저가 정보를 함께 보관
 */
@Entity // 이 클래스가 JPA 엔티티임을 나타내는 어노테이션
@Table(name = "wishlists") // 매핑될 데이터베이스 테이블 이름 지정
@Getter // Lombok을 사용하여 Getter 메서드를 자동 생성
@Setter // Lombok을 사용하여 Setter 메서드를 자동 생성
@NoArgsConstructor // 기본 생성자를 자동 생성
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자를 자동 생성
@Builder // 빌더 패턴을 사용하여 객체를 생성할 수 있도록 하는 어노테이션
public class Wishlist {

    /** 기본 키 역할을 하는 위시리스트 항목 고유 ID (자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 위시리스트를 소유한 사용자와의 다대일 연관관계 설정 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 경기 이름 (예: "Monaco Grand Prix") */
    @Column(nullable = false)
    private String raceName;

    /** 좌석 정보 (예: "Grandstand K, Row 3") */
    @Column(nullable = false)
    private String seatInfo;

    /** 티켓 가격 (예: 3500000) */
    @Column(nullable = false)
    private Integer ticketPrice;

    /** 항공 최저가 정보 (예: 1830000) */
    @Column(nullable = false)
    private Integer flightLowestPrice;

    /** 숙소 최저가 정보 (예: 450000) */
    @Column(nullable = false)
    private Integer hotelLowestPrice;

    /** 출발 공항 코드 (예: "ICN" - 인천) */
    @Column(nullable = false, length = 10)
    private String departureAirport;

    /** 도착 도시 이름 (예: "Melbourne") */
    @Column(nullable = false)
    private String destinationCity;

    /** 경기 시작 날짜 (YYYY-MM-DD 형식으로 저장) */
    @Column(nullable = false, length = 20)
    private String raceDate;
}


