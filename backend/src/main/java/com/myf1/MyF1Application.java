package com.myf1;

// Spring Boot 애플리케이션을 시작하기 위한 어노테이션
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * F1 Trip Planner 애플리케이션의 메인 진입점
 * Spring Boot 애플리케이션을 시작하는 클래스
 */
@SpringBootApplication // Spring Boot의 자동 설정을 활성화하는 어노테이션
public class MyF1Application {

    // 애플리케이션의 메인 메서드 - 프로그램 실행 시 가장 먼저 호출됨
    public static void main(String[] args) {
        // SpringApplication.run()을 통해 Spring Boot 애플리케이션을 시작
        // 이 메서드는 내장 톰캣 서버를 시작하고 모든 빈을 초기화함
        SpringApplication.run(MyF1Application.class, args);
    }
}

