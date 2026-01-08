package com.myf1.service;

// 필요한 클래스들을 import
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Amadeus API와 통신하여 액세스 토큰을 발급받는 서비스 클래스
 * 환경 변수에서 API 키와 시크릿을 읽어와 사용
 */
@Service // Spring이 이 클래스를 서비스 빈으로 관리하도록 하는 어노테이션
public class AmadeusService {

    // Amadeus API의 토큰 발급 엔드포인트 URL
    private static final String AMADEUS_TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
    
    // HTTP 요청을 보내기 위한 클라이언트 객체
    private final HttpClient httpClient;
    
    // application.yml에서 주입받은 Amadeus API 키
    @Value("${amadeus.api.key}") // 환경 변수에서 값을 주입받음
    private String apiKey;
    
    // application.yml에서 주입받은 Amadeus API 시크릿
    @Value("${amadeus.api.secret}") // 환경 변수에서 값을 주입받음
    private String apiSecret;
    
    // 발급받은 액세스 토큰을 저장할 변수
    private String accessToken;
    
    // 토큰의 만료 시간을 저장할 변수 (밀리초 단위)
    private long tokenExpiryTime;

    // 생성자 - HttpClient 인스턴스를 초기화
    public AmadeusService() {
        // HTTP 요청을 보낼 수 있는 클라이언트 객체 생성
        this.httpClient = HttpClient.newHttpClient();
    }

    /**
     * Amadeus API에서 액세스 토큰을 발급받는 메서드
     * 토큰이 아직 유효하면 기존 토큰을 반환하고, 만료되었으면 새로 발급받음
     * @return 액세스 토큰 문자열
     */
    public String getAccessToken() {
        // 현재 시간이 토큰 만료 시간보다 이전이면 (토큰이 아직 유효하면)
        if (accessToken != null && System.currentTimeMillis() < tokenExpiryTime) {
            // 기존 토큰을 반환 (새로 발급받을 필요 없음)
            return accessToken;
        }
        
        try {
            // API 키와 시크릿을 "key:secret" 형식으로 결합
            String credentials = apiKey + ":" + apiSecret;
            
            // Base64로 인코딩하여 HTTP Basic 인증 헤더에 사용할 값 생성
            String encodedCredentials = Base64.getEncoder()
                    .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
            
            // 토큰 발급을 위한 요청 본문 데이터 (grant_type은 client_credentials 사용)
            String requestBody = "grant_type=client_credentials";
            
            // HTTP POST 요청 객체 생성
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(AMADEUS_TOKEN_URL)) // 요청할 URL 설정
                    .header("Content-Type", "application/x-www-form-urlencoded") // 요청 본문 타입 설정
                    .header("Authorization", "Basic " + encodedCredentials) // Basic 인증 헤더 추가
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody)) // POST 메서드와 본문 데이터 설정
                    .build(); // 요청 객체 생성
            
            // HTTP 요청을 보내고 응답을 받음
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString() // 응답을 문자열로 받음
            );
            
            // HTTP 응답 코드가 200 (성공)인지 확인
            if (response.statusCode() == 200) {
                // 응답 본문을 JSON 객체로 파싱
                JSONObject jsonResponse = new JSONObject(response.body());
                
                // JSON에서 액세스 토큰 추출
                accessToken = jsonResponse.getString("access_token");
                
                // 토큰 만료 시간 계산 (expires_in은 초 단위이므로 밀리초로 변환)
                int expiresIn = jsonResponse.getInt("expires_in");
                tokenExpiryTime = System.currentTimeMillis() + (expiresIn * 1000L);
                
                // 발급받은 토큰 반환
                return accessToken;
            } else {
                // HTTP 응답 코드가 200이 아닌 경우 에러 로그 출력
                System.err.println("Amadeus 토큰 발급 실패: " + response.statusCode());
                System.err.println("응답 본문: " + response.body());
                return null;
            }
            
        } catch (Exception e) {
            // 예외 발생 시 스택 트레이스 출력
            e.printStackTrace();
            return null;
        }
    }
}

