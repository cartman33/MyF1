package com.myf1.repository;

// JPA Repository를 사용하기 위한 import
import com.myf1.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * User 엔티티에 대한 데이터베이스 접근을 담당하는 리포지토리 인터페이스
 * Spring Data JPA가 구현체를 자동으로 생성하여 CRUD 작업을 처리
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /** username(아이디)로 사용자 정보를 조회하는 메서드 */
    Optional<User> findByUsername(String username);

    /** 이메일로 사용자 정보를 조회하는 메서드 */
    Optional<User> findByEmail(String email);

    /** username이 이미 존재하는지 여부를 확인하는 메서드 */
    boolean existsByUsername(String username);

    /** email이 이미 존재하는지 여부를 확인하는 메서드 */
    boolean existsByEmail(String email);
}


