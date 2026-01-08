package com.myf1.repository;

// JPA Repository를 사용하기 위한 import
import com.myf1.domain.User;
import com.myf1.domain.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Wishlist 엔티티에 대한 데이터베이스 접근을 담당하는 리포지토리 인터페이스
 * Spring Data JPA가 구현체를 자동으로 생성하여 CRUD 작업을 처리
 */
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    /** 특정 사용자의 모든 위시리스트 항목을 조회하는 메서드 */
    List<Wishlist> findByUser(User user);
}


