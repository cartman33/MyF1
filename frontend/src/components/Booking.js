// React 훅들을 import
import React, { useState, useEffect } from 'react';

// axios를 import - 백엔드 Booking/Wishlist API와 통신하기 위해 사용
import axios from 'axios';

// AuthContext의 useAuth 훅을 import - 로그인 상태와 사용자 정보에 접근하기 위해 사용
import { useAuth } from '../contexts/AuthContext';

// useNavigate를 import - 로그인하지 않은 경우 로그인 페이지로 이동하기 위해 사용
import { useNavigate } from 'react-router-dom';

// 공항 검색 유틸리티 함수를 import - 지역명을 공항 코드로 변환하기 위해 사용
import { findNearestAirport, getCityNameFromAirport } from '../utils/airportService';

/**
 * Booking 컴포넌트
 * 고도화된 예약 시스템: GP 선택 → 날짜 범위 표시 → 출발/귀국 날짜 선택 플로우
 * 항공/숙소 옵션 추가, F1 티켓 세분화, 최저가 갱신 기능 및 상세 정보 표시 포함
 */
function Booking() {
  // AuthContext에서 로그인 상태와 사용자 정보 가져오기
  const { isLoggedIn, user } = useAuth();
  
  // 페이지 이동을 위해 useNavigate 훅 사용
  const navigate = useNavigate();

  // F1 일정 리스트를 저장하는 상태 변수 (GP 선택 옵션으로 사용)
  const [f1Schedules, setF1Schedules] = useState([]);
  
  // 선택된 GP 일정 정보를 저장하는 상태 변수
  const [selectedGP, setSelectedGP] = useState(null);

  // 검색 조건을 저장하는 상태 변수들
  const [departureLocation, setDepartureLocation] = useState('서울'); // 출발지 지역명 (사용자 입력)
  const [departureAirport, setDepartureAirport] = useState('ICN'); // 출발지 공항 코드 (자동 변환)
  const [destinationCity, setDestinationCity] = useState(''); // 도착지 (GP 선택 시 자동 설정)
  const [departureDate, setDepartureDate] = useState(''); // 출발 날짜 (제한 없음)
  const [returnDate, setReturnDate] = useState(''); // 귀국 날짜
  const [passengers, setPassengers] = useState(1); // 인원 수
  const [hotelCount, setHotelCount] = useState(1); // 숙소 개수

  // 항공 옵션 상태 변수들
  const [flightType, setFlightType] = useState('round-trip'); // 왕복/편도 선택 (기본값: 왕복)
  const [flightRoute, setFlightRoute] = useState('direct'); // 직항/경유 선택 (기본값: 직항)

  // F1 티켓 옵션 상태 변수들
  const [ticketArea, setTicketArea] = useState('Main Grandstand'); // 티켓 구역 선택
  const [ticketDateOption, setTicketDateOption] = useState('전체'); // 티켓 날짜 옵션 (1일권, 2일권, 전체)

  // 검색 결과 패키지 리스트 상태
  const [results, setResults] = useState([]);

  // 서버 응답/에러 메시지를 표시하기 위한 상태
  const [message, setMessage] = useState('');

  // 로딩 상태를 나타내는 상태 변수
  const [loading, setLoading] = useState(false);

  // 가격 갱신 중인 패키지 ID를 추적하는 상태 변수
  const [refreshingPackageId, setRefreshingPackageId] = useState(null);

  /**
   * 컴포넌트가 마운트될 때 F1 일정 데이터를 가져오는 useEffect 훅
   * GP 선택 옵션을 채우기 위해 백엔드 API를 호출
   */
  useEffect(() => {
    // 비동기 함수 정의 - F1 일정 데이터를 가져오는 함수
    const fetchF1Schedules = async () => {
      try {
        // 백엔드 F1 일정 API로 GET 요청 보내기
        const response = await axios.get('http://localhost:8080/api/f1/schedule');
        // 응답 데이터를 상태에 저장
        setF1Schedules(response.data || []);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 메시지 출력
        console.error('F1 일정 데이터를 가져오는 중 에러 발생:', error);
      }
    };

    // fetchF1Schedules 함수 호출
    fetchF1Schedules();
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트 마운트 시 한 번만 실행

  /**
   * 출발지 지역명이 변경될 때 가장 가까운 공항을 자동으로 찾아 설정하는 useEffect 훅
   * 사용자가 지역명을 입력하면 자동으로 공항 코드로 변환
   */
  useEffect(() => {
    // 출발지 지역명이 변경되면 공항 코드 자동 변환
    if (departureLocation) {
      // findNearestAirport 함수를 호출하여 지역명을 공항 코드로 변환
      const airportCode = findNearestAirport(departureLocation);
      // 변환된 공항 코드를 상태에 저장
      if (airportCode) {
        setDepartureAirport(airportCode);
      }
    }
  }, [departureLocation]); // departureLocation이 변경될 때마다 실행

  /**
   * GP 선택 시 호출되는 핸들러 함수
   * 선택된 GP의 정보를 상태에 저장하고 도착지를 자동 설정
   * @param {Object} schedule - 선택된 F1 일정 정보
   */
  const handleGPSelect = (schedule) => {
    // 선택된 GP 일정을 상태에 저장
    setSelectedGP(schedule);
    // 도착지를 GP가 개최되는 도시로 자동 설정
    setDestinationCity(schedule.location);
    // 날짜 필드 초기화 (새로운 GP 선택 시 날짜 재선택 필요)
    setDepartureDate('');
    setReturnDate('');
  };

  /**
   * 날짜 형식을 YYYY-MM-DD로 변환하는 헬퍼 함수
   * ISO 8601 형식("2026-03-15T00:00:00Z")에서 날짜 부분만 추출
   * @param {string} dateString - ISO 8601 형식의 날짜 문자열
   * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
   */
  const formatDateForInput = (dateString) => {
    // 날짜 문자열이 없으면 빈 문자열 반환
    if (!dateString) return '';
    // ISO 형식에서 날짜 부분만 추출 (T 이전 부분)
    return dateString.split('T')[0];
  };

  /**
   * 검색 폼 제출 시 호출되는 핸들러 함수
   * /api/booking/search 엔드포인트로 요청을 보내 Mock 패키지 리스트를 받아옴
   * 편도/왕복, 티켓 옵션 등 모든 검색 조건을 포함하여 요청
   */
  const handleSearch = async (e) => {
    // 기본 폼 전송 동작(페이지 새로고침)을 막음
    e.preventDefault();
    
    // GP가 선택되지 않았으면 검색 불가
    if (!selectedGP) {
      setMessage('먼저 원하는 그랑프리를 선택해주세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 백엔드 Booking 검색 API로 POST 요청 보내기
      // 모든 검색 조건(출발지, 도착지, 날짜, 인원, 항공/숙소 옵션, 티켓 옵션)을 포함
      const response = await axios.post(
        'http://localhost:8080/api/booking/search',
        {
          departureAirport, // 공항 코드
          destinationCity, // 도착 도시
          departureDate, // 출발 날짜 (제한 없음)
          returnDate: flightType === 'round-trip' ? returnDate : null, // 편도일 경우 null
          passengers, // 인원 수
          hotelCount, // 숙소 개수
          flightType, // 항공 옵션 (왕복/편도)
          flightRoute, // 경유 옵션 (직항/경유)
          ticketArea, // F1 티켓 구역
          ticketDateOption, // F1 티켓 날짜 옵션
        }
      );

      // 응답으로 받은 패키지 리스트를 상태에 저장
      setResults(response.data || []);

      // 검색 결과가 없을 경우 메시지 표시
      if (!response.data || response.data.length === 0) {
        setMessage('검색 결과가 없습니다.');
      }
    } catch (error) {
      // 에러 발생 시 메시지 표시
      setMessage('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 특정 패키지의 최저가를 갱신하는 함수
   * 갱신 버튼 클릭 시 호출되어 최신 가격을 다시 조회
   * @param {string} packageId - 갱신할 패키지의 고유 ID
   * @param {number} index - 패키지 리스트에서의 인덱스
   */
  const handleRefreshPrice = async (packageId, index) => {
    // 갱신 중인 패키지 ID를 상태에 저장 (로딩 표시용)
    setRefreshingPackageId(packageId);

    try {
      // 백엔드 가격 갱신 API로 POST 요청 보내기
      // 패키지 ID와 원본 검색 조건을 함께 전송
      const response = await axios.post(
        `http://localhost:8080/api/booking/refresh-price?packageId=${packageId}`,
        {
          departureAirport,
          destinationCity,
          departureDate,
          returnDate: flightType === 'round-trip' ? returnDate : null,
          passengers,
          hotelCount,
          flightType,
          flightRoute,
          ticketArea,
          ticketDateOption,
        }
      );

      // 갱신된 패키지 정보를 받아옴
      const refreshedPackage = response.data;

      // 검색 결과 리스트를 복사하여 해당 인덱스의 패키지만 업데이트
      const updatedResults = [...results];
      updatedResults[index] = refreshedPackage;
      // 업데이트된 리스트를 상태에 저장
      setResults(updatedResults);

      // 성공 메시지 표시
      setMessage('가격이 갱신되었습니다.');
    } catch (error) {
      // 에러 발생 시 메시지 표시
      setMessage('가격 갱신 중 오류가 발생했습니다.');
    } finally {
      // 갱신 완료 후 로딩 상태 해제
      setRefreshingPackageId(null);
    }
  };

  /**
   * 즐겨찾기 버튼 클릭 시 호출되는 함수
   * AuthContext의 사용자 정보를 사용하여 자동으로 즐겨찾기에 추가
   * 로그인하지 않은 경우 로그인 페이지로 이동
   * @param {Object} pkg - 즐겨찾기에 추가할 패키지 정보
   */
  const handleAddToWishlist = async (pkg) => {
    // 로그인하지 않은 경우 로그인 페이지로 이동
    if (!isLoggedIn || !user) {
      setMessage('즐겨찾기를 사용하려면 로그인이 필요합니다.');
      // 1초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    try {
      // AuthContext의 user 객체에서 username을 가져와서 사용
      // WishlistCreateRequest 구조에 맞게 요청 본문 생성
      await axios.post('http://localhost:8080/api/wishlist', {
        username: user.username, // AuthContext에서 가져온 사용자명 사용
        raceName: pkg.raceName,
        seatInfo: pkg.seatInfo,
        ticketPrice: pkg.ticketPrice,
        flightLowestPrice: pkg.flightLowestPrice,
        hotelLowestPrice: pkg.hotelLowestPrice,
        departureAirport,
        destinationCity: pkg.destinationCity,
        raceDate: pkg.raceDate,
      });

      // 성공 메시지 표시
      setMessage('즐겨찾기에 추가되었습니다.');
    } catch (error) {
      // 에러 메시지 표시
      setMessage('즐겨찾기 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 페이지 제목 */}
      <h2 className="text-2xl font-bold text-white mb-6">Booking</h2>

      {/* GP 선택 섹션 - 사용자가 먼저 원하는 그랑프리를 선택 */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          1단계: 그랑프리 선택
        </h3>

        {/* GP 선택 드롭다운 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            원하는 그랑프리 선택
          </label>
          <select
            value={selectedGP ? selectedGP.meetingKey : ''}
            onChange={(e) => {
              // 선택된 meetingKey로 F1 일정 찾기
              const selected = f1Schedules.find(
                (s) => s.meetingKey === parseInt(e.target.value)
              );
              // 찾은 일정이 있으면 handleGPSelect 호출
              if (selected) {
                handleGPSelect(selected);
              }
            }}
            className="w-full md:w-1/2 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
          >
            <option value="">그랑프리를 선택하세요</option>
            {/* F1 일정 리스트를 순회하며 옵션 생성 */}
            {f1Schedules.map((schedule) => (
              <option key={schedule.meetingKey} value={schedule.meetingKey}>
                {schedule.meetingName} - {schedule.location}, {schedule.countryName}
              </option>
            ))}
          </select>
        </div>

        {/* 선택된 GP의 전체 기간 표시 */}
        {selectedGP && (
          <div className="bg-gray-800 rounded p-4 mb-4">
            <h4 className="text-white font-semibold mb-2">
              {selectedGP.meetingName} 일정
            </h4>
            {/* 시작일과 종료일을 모두 표시 (dateEnd가 있으면 표시, 없으면 시작일만 표시) */}
            <p className="text-gray-300 text-sm">
              {selectedGP.dateStart
                ? formatDateForInput(selectedGP.dateStart)
                : '날짜 미정'}{' '}
              {selectedGP.dateEnd && selectedGP.dateEnd !== selectedGP.dateStart
                ? `~ ${formatDateForInput(selectedGP.dateEnd)}`
                : ''}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {selectedGP.location}, {selectedGP.countryName}
            </p>
          </div>
        )}
      </div>

      {/* 검색 조건 입력을 위한 카드 레이아웃 */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          2단계: 검색 조건 입력
        </h3>

        {/* 검색 폼 - 출발지/도착지/날짜/인원수/옵션 입력 */}
        <form onSubmit={handleSearch} className="space-y-4">
          {/* 출발지 선택 - 지역명 검색 후 자동으로 공항 코드 변환 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              출발지 (지역명 또는 공항 코드)
            </label>
            <div className="flex items-center space-x-2">
              {/* 지역명 입력 필드 */}
              <input
                type="text"
                value={departureLocation}
                onChange={(e) => setDepartureLocation(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                placeholder="예: 서울, 도쿄, 로스앤젤레스, ICN 등"
              />
              {/* 자동 변환된 공항 코드 표시 */}
              <div className="px-3 py-2 bg-gray-700 text-gray-300 rounded text-sm">
                {departureAirport}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              입력한 지역명이 자동으로 가장 가까운 공항 코드로 변환됩니다.
            </p>
          </div>

          {/* 도착지 - GP 선택 시 자동 설정되지만 수정 가능 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">도착지</label>
            <input
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              placeholder="GP 선택 시 자동 입력됨"
            />
          </div>

          {/* 날짜 선택 - 출발 날짜 제한 없음 (장거리 비행 및 시차 고려) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 출발 날짜 - 제한 없이 자유롭게 선택 가능 */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                출발 날짜
                {selectedGP && selectedGP.dateStart && (
                  <span className="text-xs text-gray-400 ml-2">
                    (권장: {formatDateForInput(selectedGP.dateStart)} 근처)
                  </span>
                )}
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                // min 속성 제거 - 날짜 제한 없음
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              />
            </div>

            {/* 귀국 날짜 - 왕복일 때만 표시 */}
            {flightType === 'round-trip' && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  귀국 날짜
                  {selectedGP && selectedGP.dateEnd && (
                    <span className="text-xs text-gray-400 ml-2">
                      (권장: {formatDateForInput(selectedGP.dateEnd)} 이후)
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || ''}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                />
              </div>
            )}
          </div>

          {/* F1 티켓 옵션 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 티켓 구역 선택 (스즈카 서킷 등 특정 서킷의 구역 선택) */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                F1 티켓 구역
              </label>
              <select
                value={ticketArea}
                onChange={(e) => setTicketArea(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              >
                <option value="Main Grandstand">Main Grandstand</option>
                <option value="WEST AREA">WEST AREA</option>
                <option value="PADDOCK CLUB">PADDOCK CLUB</option>
                <option value="General Admission">General Admission</option>
                <option value="VIP Suite">VIP Suite</option>
              </select>
            </div>

            {/* 티켓 날짜 옵션 (1일권, 2일권, 전체) */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                티켓 날짜 옵션
              </label>
              <select
                value={ticketDateOption}
                onChange={(e) => setTicketDateOption(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              >
                <option value="1일권">1일권</option>
                <option value="2일권">2일권</option>
                <option value="전체">전체 (3일)</option>
              </select>
            </div>
          </div>

          {/* 항공 옵션 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 왕복/편도 선택 */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">항공 옵션</label>
              <div className="flex space-x-4">
                {/* 왕복 라디오 버튼 */}
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    value="round-trip"
                    checked={flightType === 'round-trip'}
                    onChange={(e) => setFlightType(e.target.value)}
                    className="mr-2"
                  />
                  왕복
                </label>
                {/* 편도 라디오 버튼 */}
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    value="one-way"
                    checked={flightType === 'one-way'}
                    onChange={(e) => setFlightType(e.target.value)}
                    className="mr-2"
                  />
                  편도
                </label>
              </div>
            </div>

            {/* 직항/경유 선택 */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">경유 옵션</label>
              <div className="flex space-x-4">
                {/* 직항 라디오 버튼 */}
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    value="direct"
                    checked={flightRoute === 'direct'}
                    onChange={(e) => setFlightRoute(e.target.value)}
                    className="mr-2"
                  />
                  직항
                </label>
                {/* 경유 라디오 버튼 */}
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    value="connecting"
                    checked={flightRoute === 'connecting'}
                    onChange={(e) => setFlightRoute(e.target.value)}
                    className="mr-2"
                  />
                  경유
                </label>
              </div>
            </div>
          </div>

          {/* 숙소 옵션 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 인원 수 */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">인원 수</label>
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              />
            </div>

            {/* 숙소 개수 */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">숙소 개수</label>
              <input
                type="number"
                min={1}
                value={hotelCount}
                onChange={(e) => setHotelCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              />
            </div>
          </div>

          {/* 검색 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
            >
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>
        </form>
      </div>

      {/* 검색 결과 카드 리스트 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          검색 결과
        </h3>

        {results.length === 0 && !loading && (
          <p className="text-gray-400 text-sm">
            아직 검색 결과가 없습니다. 조건을 입력하고 검색을 눌러주세요.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((pkg, index) => (
            <div
              key={pkg.packageId || index}
              className="bg-gray-900 rounded-lg border border-gray-800 p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-white font-semibold text-lg mb-1">
                  {pkg.raceName}
                </h4>
                <p className="text-gray-400 text-sm mb-1">
                  {pkg.destinationCity} · {pkg.raceDate}
                </p>
                <p className="text-gray-400 text-sm mb-2">{pkg.seatInfo}</p>

                {/* 상세 정보 표시 - 항공사명, 항공편명, 숙소명 */}
                <div className="text-sm text-gray-300 space-y-1 mb-3">
                  <p className="text-f1-red font-semibold">티켓: ₩{pkg.ticketPrice.toLocaleString()}</p>
                  
                  {/* 항공 정보 - 항공사명과 항공편명 표시 */}
                  <div className="bg-gray-800 rounded p-2 mt-2">
                    <p className="text-white font-semibold">✈️ 항공</p>
                    <p className="text-gray-300">
                      {pkg.airlineName || '항공사 미지정'} {pkg.flightNumber || ''}
                    </p>
                    <p className="text-f1-red font-semibold mt-1">
                      ₩{pkg.flightLowestPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* 숙소 정보 - 숙소명 표시 */}
                  <div className="bg-gray-800 rounded p-2 mt-2">
                    <p className="text-white font-semibold">🏨 숙소</p>
                    <p className="text-gray-300">
                      {pkg.hotelName || '숙소 미지정'}
                    </p>
                    <p className="text-f1-red font-semibold mt-1">
                      ₩{pkg.hotelLowestPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 영역 */}
              <div className="flex space-x-2 mt-4">
                {/* 최저가 갱신 버튼 */}
                <button
                  type="button"
                  onClick={() => handleRefreshPrice(pkg.packageId, index)}
                  disabled={refreshingPackageId === pkg.packageId}
                  className="flex-1 py-2 bg-gray-700 text-white text-sm font-semibold rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {refreshingPackageId === pkg.packageId ? '갱신 중...' : '갱신'}
                </button>

                {/* 즐겨찾기 버튼 - AuthContext의 사용자 정보를 자동으로 사용 */}
                <button
                  type="button"
                  onClick={() => handleAddToWishlist(pkg)}
                  className="flex-1 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
                >
                  즐겨찾기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 공통 메시지 영역 */}
      {message && (
        <div className="mt-6 text-sm text-gray-200 text-center">{message}</div>
      )}
    </div>
  );
}

// Booking 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default Booking;
