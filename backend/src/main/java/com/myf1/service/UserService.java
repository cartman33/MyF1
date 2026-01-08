package com.myf1.service;

// 도메인, 리포지토리, DTO import
import com.myf1.domain.User;
import com.myf1.dto.AuthDtos;
import com.myf1.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원 가입, 로그인 검증 등 사용자 관련 비즈니스 로직을 담당하는 서비스 클래스
 */
@Service // 이 클래스가 서비스 빈으로 등록되도록 하는 어노테이션
@Transactional // 메서드 실행을 트랜잭션으로 묶어주는 어노테이션
public class UserService {

    /** User 엔티티에 대한 데이터베이스 접근을 담당하는 리포지토리 */
    private final UserRepository userRepository;

    /** BCrypt 해시 함수를 사용하여 비밀번호를 암호화하는 인코더 */
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * 생성자 주입을 통해 UserRepository와 BCryptPasswordEncoder를 받아 초기화
     */
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 회원 가입 로직을 처리하는 메서드
     * 1) 아이디/이메일 중복 검사
     * 2) 비밀번호와 비밀번호 확인 일치 여부 검사
     * 3) BCrypt로 비밀번호 암호화 후 DB에 저장
     */
    public void signup(AuthDtos.SignupRequest request) {
        // 비밀번호와 비밀번호 확인 값이 일치하는지 검사
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
        }

        // username 중복 체크
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // email 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호를 BCryptPasswordEncoder를 사용하여 해시 값으로 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // User 엔티티 객체 생성 (빌더 패턴 사용)
        User user = User.builder()
                .username(request.getUsername())
                .password(encodedPassword)
                .email(request.getEmail())
                .nickname(request.getNickname())
                .termsAgreed(request.isTermsAgreed())
                .build();

        // 리포지토리를 통해 DB에 사용자 정보 저장
        userRepository.save(user);
    }

    /**
     * 로그인 시 아이디/비밀번호 조합이 올바른지 검증하는 메서드
     * @return 검증에 성공하면 User 엔티티를 반환하고, 실패하면 예외를 던짐
     */
    @Transactional(readOnly = true)
    public User login(AuthDtos.LoginRequest request) {
        // username으로 사용자 조회 (없으면 예외 발생)
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        // 입력받은 평문 비밀번호와 저장된 해시 비밀번호를 비교
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }

        // 인증에 성공한 사용자 엔티티 반환
        return user;
    }

    /**
     * 아이디 중복 여부를 확인하는 메서드
     * @return 이미 존재하면 true, 아니면 false
     */
    @Transactional(readOnly = true)
    public boolean isUsernameDuplicated(String username) {
        return userRepository.existsByUsername(username);
    }
}


