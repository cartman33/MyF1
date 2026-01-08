
// React와 useEffect, useState 훅을 import
import React, { useEffect, useState } from 'react';

// React Router의 useNavigate 훅을 import - Start 버튼 클릭 시 /login으로 이동
import { useNavigate } from 'react-router-dom';

// axios 라이브러리를 import - HTTP 요청을 보내기 위한 라이브러리
import axios from 'axios';

/**
 * HeroSection 컴포넌트
 * 메인 히어로 섹션을 렌더링하는 컴포넌트
 * "Only For Your Watching Live F1 Planner" 메시지와 Start 버튼을 포함
 * 백엔드 API에서 F1 일정 데이터를 가져와 화면에 표시
 */
function HeroSection() {
  // F1 일정 데이터를 저장할 state 변수
  const [schedules, setSchedules] = useState([]);

  // 데이터 로딩 상태를 저장할 state 변수
  const [loading, setLoading] = useState(true);

  // 라우팅을 위해 useNavigate 훅을 사용
  const navigate = useNavigate();

  /**
   * 컴포넌트가 마운트될 때 실행되는 useEffect 훅
   * 백엔드 API에서 F1 일정 데이터를 가져옴
   */
  useEffect(() => {
    // 비동기 함수 정의 - API 호출을 위한 함수
    const fetchSchedules = async () => {
      try {
        // 백엔드 API 엔드포인트로 GET 요청 보내기
        // 백엔드는 포트 8080에서 실행됨
        const response = await axios.get('http://localhost:8080/api/f1/schedule');

        // 응답 데이터를 state에 저장
        setSchedules(response.data);

        // 콘솔에 데이터 출력 (개발 중 확인용)
        console.log('F1 일정 데이터:', response.data);

        // 로딩 상태를 false로 변경
        setLoading(false);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 메시지 출력
        console.error('F1 일정 데이터를 가져오는 중 에러 발생:', error);

        // 로딩 상태를 false로 변경
        setLoading(false);
      }
    };

    // fetchSchedules 함수 호출
    fetchSchedules();
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트 마운트 시 한 번만 실행

  return (
    // 히어로 섹션을 감싸는 div - flexbox를 사용하여 레이아웃 구성
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-8">
      {/* 메인 콘텐츠 영역 - 좌우로 나뉘어 배치 */}
      <div className="flex items-center justify-between w-full max-w-7xl">
        {/* 좌측: 메인 카피 문구 */}
        <div className="flex-1">
          {/* 메인 헤드라인 텍스트 */}
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Only For Your<br />
            Watching Live<br />
            <span className="text-f1-red">F1 Planner</span>
          </h2>

          {/* 서브 텍스트 */}
          <p className="text-gray-400 text-lg mb-8">
            F1 경기 일정을 확인하고 최적의 여행 계획을 세워보세요
          </p>

          {/* Start 버튼 - 클릭 시 /login 페이지로 이동 */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-f1-red text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
          >
            Start
          </button>
        </div>

        {/* 우측: F1 메인 페이지 이미지 영역 */}
        <div className="flex-1 flex justify-end">
          {/* 사용자가 제공한 F1MainPage.png 이미지를 표시 */}
          <div className="w-full max-w-lg h-auto rounded-lg overflow-hidden shadow-2xl">
            {/* 이미지 파일을 표시 - public/images/F1MainPage.png 경로 사용 */}
            {/* React의 public 폴더는 루트(/) 경로로 접근 가능하므로 /images/F1MainPage.png로 참조 */}
            <img
              src="/images/F1MainPage.png"
              alt="F1 Racing Scene - Formula 1 race car with price comparison"
              className="w-full h-auto object-contain rounded-lg"
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>
      </div>

      {/* F1 일정 데이터 표시 영역 (개발 중 확인용) */}
      {!loading && schedules.length > 0 && (
        <div className="mt-16 w-full max-w-7xl">
          <h3 className="text-2xl font-bold text-white mb-4">2026 F1 일정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 각 경기 일정을 카드 형태로 표시 */}
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <h4 className="text-white font-semibold mb-2">{schedule.meetingName}</h4>
                <p className="text-gray-400 text-sm">
                  {/* 시작일과 종료일을 모두 표시 (dateEnd가 있으면 전체 기간 표시) */}
                  {schedule.dateStart
                    ? schedule.dateStart.split('T')[0]
                    : '날짜 미정'}{' '}
                  {schedule.dateEnd &&
                  schedule.dateEnd !== schedule.dateStart
                    ? `~ ${schedule.dateEnd.split('T')[0]}`
                    : ''}
                </p>
                <p className="text-gray-400 text-sm">
                  {schedule.location}, {schedule.countryName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 로딩 중일 때 표시할 메시지 */}
      {loading && (
        <div className="mt-16 text-white">
          F1 일정을 불러오는 중...
        </div>
      )}
    </div>
  );
}

// HeroSection 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default HeroSection;
