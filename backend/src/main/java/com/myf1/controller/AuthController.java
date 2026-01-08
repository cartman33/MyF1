package com.myf1.controller;

// DTO, 서비스 import
import com.myf1.dto.AuthDtos;
import com.myf1.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 회원가입 및 로그인, 아이디 중복 체크와 같은 인증 관련 API를 제공하는 컨트롤러 클래스
 */
@RestController // 이 클래스가 REST 컨트롤러임을 나타내는 어노테이션
@RequestMapping("/api/auth") // 인증 관련 엔드포인트의 기본 경로를 설정
public class AuthController {

    /** 사용자 관련 비즈니스 로직을 담당하는 서비스 */
    private final UserService userService;

    /**
     * 생성자 주입을 통해 UserService를 받아 초기화
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 회원가입 요청을 처리하는 엔드포인트
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthDtos.SimpleResponse> signup(@Valid @RequestBody AuthDtos.SignupRequest request) {
        try {
            // UserService를 통해 회원가입 비즈니스 로직 수행
            userService.signup(request);
            // 성공 메시지를 담아 200 OK 응답 반환
            return ResponseEntity.ok(new AuthDtos.SimpleResponse("회원가입이 완료되었습니다."));
        } catch (IllegalArgumentException e) {
            // 비즈니스 검증 예외 발생 시 400 Bad Request 응답과 메시지 반환
            return ResponseEntity.badRequest().body(new AuthDtos.SimpleResponse(e.getMessage()));
        }
    }

    /**
     * 로그인 요청을 처리하는 엔드포인트
     * POST /api/auth/login
     * 현재 단계에서는 세션/토큰을 발급하지 않고 단순 성공/실패만 응답
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDtos.SimpleResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        try {
            // UserService를 통해 아이디/비밀번호 검증
            userService.login(request);
            // 검증에 성공하면 성공 메시지 반환
            return ResponseEntity.ok(new AuthDtos.SimpleResponse("로그인에 성공했습니다."));
        } catch (IllegalArgumentException e) {
            // 검증 실패 시 400 Bad Request 응답과 에러 메시지 반환
            return ResponseEntity.badRequest().body(new AuthDtos.SimpleResponse(e.getMessage()));
        }
    }

    /**
     * 아이디 중복 여부를 확인하는 엔드포인트
     * GET /api/auth/check-username?username=...
     */
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        // UserService를 통해 username 중복 여부를 확인
        boolean duplicated = userService.isUsernameDuplicated(username);
        // true/false 값을 그대로 응답 본문으로 반환
        return ResponseEntity.ok(duplicated);
    }
}


