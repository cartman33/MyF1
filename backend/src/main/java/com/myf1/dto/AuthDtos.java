package com.myf1.dto;

// 검증과 직렬화를 위한 import
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인증/인가 관련 요청과 응답에 사용되는 DTO들을 한 파일에 모아 정의
 * 프론트엔드와 백엔드 간에 전달되는 데이터 구조를 명확히 구분
 */
public class AuthDtos {

    /**
     * 회원가입 시 클라이언트가 전달하는 데이터 구조를 정의하는 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupRequest {

        /** 로그인에 사용할 아이디(username)를 전달하는 필드 */
        @NotBlank
        @Size(min = 4, max = 50)
        private String username;

        /** 평문 비밀번호 (서버에서 BCrypt로 암호화) */
        @NotBlank
        @Size(min = 8, max = 100)
        private String password;

        /** 비밀번호 2차 확인 값 (서버에서는 일치 여부만 검증) */
        @NotBlank
        @Size(min = 8, max = 100)
        private String passwordConfirm;

        /** 이메일 주소 */
        @NotBlank
        @Email
        private String email;

        /** 화면에 표시할 닉네임 */
        @NotBlank
        private String nickname;

        /** 개인정보 처리방침 및 약관 동의 여부 */
        private boolean termsAgreed;
    }

    /**
     * 로그인 시 클라이언트가 전달하는 데이터 구조를 정의하는 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {

        /** 로그인 아이디(username)를 전달하는 필드 */
        @NotBlank
        private String username;

        /** 평문 비밀번호 */
        @NotBlank
        private String password;
    }

    /**
     * 간단한 성공/실패 메시지를 프론트엔드로 전달하기 위한 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimpleResponse {

        /** 처리 결과를 설명하는 메시지 */
        private String message;
    }
}


