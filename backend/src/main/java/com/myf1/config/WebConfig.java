package com.myf1.config;

// 필요한 클래스들을 import
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 애플리케이션의 CORS (Cross-Origin Resource Sharing) 설정 클래스
 * 프론트엔드(포트 3000)와 백엔드(포트 8080) 간의 통신을 허용하도록 설정
 */
@Configuration // 이 클래스가 Spring 설정 클래스임을 나타내는 어노테이션
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS 설정을 추가하는 메서드
     * 프론트엔드에서 백엔드 API를 호출할 수 있도록 허용
     * @param registry CORS 설정을 등록하는 레지스트리 객체
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 모든 경로에 대해 CORS 설정 적용
        registry.addMapping("/**")
                // 프론트엔드가 실행되는 포트(3000)에서의 요청을 허용
                .allowedOrigins("http://localhost:3000")
                // 허용할 HTTP 메서드 설정 (GET, POST, PUT, DELETE 등)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // 요청 헤더에 포함될 수 있는 필드 설정
                .allowedHeaders("*")
                // 인증 정보(쿠키 등)를 포함한 요청을 허용할지 여부
                .allowCredentials(true);
    }
}

