package com.myf1.domain;

// JPA 관련 어노테이션 import
import jakarta.persistence.*;
// Lombok 어노테이션 import
import lombok.*;

/**
 * 애플리케이션의 회원 정보를 저장하는 사용자 엔티티 클래스
 * username, password, email, nickname 및 약관 동의 여부를 관리
 */
@Entity // 이 클래스가 JPA 엔티티임을 나타내는 어노테이션
@Table(name = "users") // 매핑될 데이터베이스 테이블 이름 지정
@Getter // Lombok을 사용하여 Getter 메서드를 자동 생성
@Setter // Lombok을 사용하여 Setter 메서드를 자동 생성
@NoArgsConstructor // 기본 생성자를 자동 생성
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자를 자동 생성
@Builder // 빌더 패턴을 사용하여 객체를 생성할 수 있도록 하는 어노테이션
public class User {

    /** 기본 키 역할을 하는 사용자 고유 ID (자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 로그인에 사용할 사용자 이름 (아이디) - 유니크 제약조건 적용 */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** BCryptPasswordEncoder로 암호화된 비밀번호를 저장하는 필드 */
    @Column(nullable = false)
    private String password;

    /** 사용자 이메일 주소를 저장하는 필드 */
    @Column(nullable = false, unique = true)
    private String email;

    /** 화면에 표시할 닉네임을 저장하는 필드 */
    @Column(nullable = false, length = 50)
    private String nickname;

    /** 개인정보 처리방침 및 약관 동의 여부를 저장하는 필드 */
    @Column(nullable = false)
    private boolean termsAgreed;
}


