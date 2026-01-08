package com.myf1.controller;

// 필요한 클래스들을 import
import com.myf1.dto.F1ScheduleDTO;
import com.myf1.service.F1ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * F1 관련 API 엔드포인트를 제공하는 컨트롤러 클래스
 * 프론트엔드에서 호출할 수 있는 REST API를 정의
 */
@RestController // 이 클래스가 REST 컨트롤러임을 나타내는 어노테이션
@RequestMapping("/api/f1") // 모든 엔드포인트의 기본 경로를 "/api/f1"로 설정
public class F1Controller {

    // F1ScheduleService를 주입받기 위한 필드
    @Autowired // Spring이 자동으로 F1ScheduleService 인스턴스를 주입
    private F1ScheduleService f1ScheduleService;

    /**
     * 2026년 F1 경기 일정을 반환하는 API 엔드포인트
     * GET /api/f1/schedule 요청을 처리
     * @return 2026년 F1 경기 일정 리스트를 담은 HTTP 응답
     */
    @GetMapping("/schedule") // GET 요청을 처리하는 엔드포인트
    public ResponseEntity<List<F1ScheduleDTO>> getSchedule() {
        try {
            // F1ScheduleService를 통해 2026년 경기 일정을 가져옴
            List<F1ScheduleDTO> schedules = f1ScheduleService.get2026Schedule();
            
            // 성공 응답(200 OK)과 함께 일정 리스트를 반환
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            // 예외 발생 시 에러 로그 출력
            e.printStackTrace();
            // 서버 에러(500) 응답 반환
            return ResponseEntity.internalServerError().build();
        }
    }
}

