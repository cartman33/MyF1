package com.myf1.config;

// 필요한 클래스들을 import
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct; // 'javax'를 'jakarta'로 바꿉니다.
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * .env 파일을 읽어서 시스템 환경 변수로 설정하는 설정 클래스
 * 애플리케이션 시작 시 .env 파일의 내용을 환경 변수로 로드
 */
@Configuration // 이 클래스가 Spring 설정 클래스임을 나타내는 어노테이션
public class EnvConfig {

    /**
     * 애플리케이션 시작 시 실행되는 메서드
     * .env 파일을 읽어서 환경 변수로 설정
     */
    @PostConstruct // Spring이 빈을 초기화한 후 자동으로 실행되는 메서드
    public void loadEnvFile() {
        try {
            // 프로젝트 루트 디렉토리의 .env 파일 경로 생성
            // 현재 작업 디렉토리에서 상위로 올라가서 .env 파일 찾기
            Path envPath = Paths.get(System.getProperty("user.dir"), ".env");

            // .env 파일이 존재하는지 확인
            if (Files.exists(envPath)) {
                // .env 파일을 읽기 위한 BufferedReader 생성
                try (BufferedReader reader = Files.newBufferedReader(envPath)) {
                    String line;
                    // 파일의 각 줄을 읽어서 처리
                    while ((line = reader.readLine()) != null) {
                        // 주석 줄(#으로 시작)이나 빈 줄은 건너뛰기
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }

                        // "KEY=VALUE" 형식의 줄을 파싱
                        int equalsIndex = line.indexOf('=');
                        if (equalsIndex > 0) {
                            // 키와 값을 분리
                            String key = line.substring(0, equalsIndex).trim();
                            String value = line.substring(equalsIndex + 1).trim();

                            // 환경 변수가 아직 설정되지 않았으면 설정
                            // (이미 시스템 환경 변수로 설정되어 있으면 덮어쓰지 않음)
                            if (System.getenv(key) == null) {
                                // Windows에서는 환경 변수를 동적으로 설정하기 어려우므로
                                // System.setProperty를 사용하여 시스템 프로퍼티로 설정
                                System.setProperty(key, value);
                            }
                        }
                    }
                }
                System.out.println(".env 파일을 성공적으로 로드했습니다.");
            } else {
                // .env 파일이 없으면 경고 메시지 출력
                System.out.println("경고: .env 파일을 찾을 수 없습니다. 프로젝트 루트에 .env 파일을 생성하세요.");
            }
        } catch (IOException e) {
            // 파일 읽기 중 에러 발생 시 에러 메시지 출력
            System.err.println(".env 파일을 읽는 중 에러 발생: " + e.getMessage());
        }
    }
}

