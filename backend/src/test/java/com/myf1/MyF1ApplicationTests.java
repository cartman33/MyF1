package com.myf1;

// Spring Boot 테스트 관련 클래스들을 import
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Spring Boot 애플리케이션의 기본 통합 테스트 클래스
 * 애플리케이션 컨텍스트가 정상적으로 로드되는지 확인하는 테스트
 */
@SpringBootTest // Spring Boot 테스트를 위한 어노테이션
class MyF1ApplicationTests {

    /**
     * 애플리케이션 컨텍스트 로드 테스트
     * Spring Boot 애플리케이션이 정상적으로 시작되는지 확인
     */
    @Test // JUnit 테스트 메서드임을 나타내는 어노테이션
    void contextLoads() {
        // 이 테스트는 애플리케이션 컨텍스트가 정상적으로 로드되는지만 확인
        // 만약 컨텍스트 로드에 실패하면 이 테스트가 실패함
    }
}

