package com.myf1.config;

// Spring Security 관련 import
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Spring Security 전역 보안 설정을 담당하는 설정 클래스
 * 현재 단계에서는 REST API 개발 편의를 위해 모든 요청을 허용하되,
 * BCryptPasswordEncoder 빈을 등록하여 비밀번호 암호화에 사용
 */
@Configuration // 이 클래스가 Spring 설정 클래스임을 나타내는 어노테이션
public class SecurityConfig {

    /**
     * HTTP 보안 설정을 정의하는 메서드
     * 개발 단계에서는 CSRF를 비활성화하고 모든 요청을 허용하도록 구성
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF 보호를 비활성화하고, 모든 요청을 인증 없이 허용
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        // 구성된 SecurityFilterChain을 반환
        return http.build();
    }

    /**
     * BCryptPasswordEncoder 빈을 등록하는 메서드
     * UserService에서 비밀번호를 암호화/검증하는 데 사용
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // 강도(라운드 수) 기본값으로 BCryptPasswordEncoder 인스턴스 생성
        return new BCryptPasswordEncoder();
    }
}


