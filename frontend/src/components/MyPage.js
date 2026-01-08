// React 훅들을 import
import React, { useEffect, useState } from 'react';

// axios를 import - 마이페이지 관련 백엔드 API와 통신하기 위해 사용
import axios from 'axios';

// AuthContext의 useAuth 훅을 import - 로그인 상태와 사용자 정보에 접근하기 위해 사용
import { useAuth } from '../contexts/AuthContext';

// useNavigate를 import - 로그인하지 않은 경우 로그인 페이지로 이동하기 위해 사용
import { useNavigate } from 'react-router-dom';

/**
 * MyPage 컴포넌트
 * 로그인된 사용자의 정보를 기반으로 즐겨찾기 목록을 자동으로 로드하는 페이지
 * 비밀번호 재설정 버튼을 통해 별도 페이지(/password-reset)로 이동
 */
function MyPage() {
  // AuthContext에서 로그인 상태와 사용자 정보 가져오기
  const { isLoggedIn, user } = useAuth();
  
  // 페이지 이동을 위해 useNavigate 훅 사용
  const navigate = useNavigate();

  // 저장된 여행 패키지 리스트 상태
  const [packages, setPackages] = useState([]);

  // 공통 메시지(성공/에러)를 표시하기 위한 상태
  const [message, setMessage] = useState('');

  // 로딩 상태를 나타내는 상태 변수
  const [loading, setLoading] = useState(false);

  /**
   * 로그인된 사용자의 패키지 리스트를 로드하는 함수
   * GET /api/mypage/packages?username=... 엔드포인트를 호출
   * AuthContext의 user 정보를 사용하여 자동으로 로드
   */
  const loadPackages = async () => {
    // 로그인하지 않았거나 사용자 정보가 없으면 패키지 로드 불가
    if (!isLoggedIn || !user || !user.username) {
      setPackages([]);
      return;
    }

    setLoading(true);
    try {
      // AuthContext에서 가져온 username을 사용하여 패키지 조회
      const response = await axios.get(
        'http://localhost:8080/api/mypage/packages',
        {
          params: { username: user.username }, // AuthContext의 user.username 사용
        }
      );
      // 응답 데이터를 상태에 저장
      setPackages(response.data || []);
      setMessage('');
    } catch (error) {
      // 에러 발생 시 메시지 표시
      setMessage('여행 패키지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 특정 패키지를 삭제하는 함수
   * DELETE /api/mypage/packages/{id} 엔드포인트를 호출
   * @param {number} id - 삭제할 패키지의 ID
   */
  const handleDeletePackage = async (id) => {
    try {
      // 백엔드 삭제 API로 DELETE 요청 보내기
      await axios.delete(`http://localhost:8080/api/mypage/packages/${id}`);
      // 성공 메시지 표시
      setMessage('패키지가 삭제되었습니다.');
      // 삭제 후 리스트 갱신
      loadPackages();
    } catch (error) {
      // 에러 발생 시 메시지 표시
      setMessage('패키지 삭제 중 오류가 발생했습니다.');
    }
  };

  /**
   * 비밀번호 재설정 버튼 클릭 시 호출되는 핸들러 함수
   * 비밀번호 재설정 페이지(/password-reset)로 이동
   */
  const handlePasswordReset = () => {
    navigate('/password-reset');
  };

  /**
   * 컴포넌트가 마운트되거나 로그인 상태가 변경될 때 실행되는 useEffect 훅
   * 로그인된 사용자의 패키지를 자동으로 로드
   */
  useEffect(() => {
    // 로그인 상태이고 사용자 정보가 있으면 패키지 자동 로드
    if (isLoggedIn && user && user.username) {
      loadPackages();
    } else {
      // 로그인하지 않았으면 패키지 리스트 초기화
      setPackages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user]); // isLoggedIn 또는 user가 변경될 때마다 실행

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 페이지 제목 */}
      <h2 className="text-2xl font-bold text-white">My Page</h2>

      {/* 로그인하지 않은 경우 안내 메시지 */}
      {!isLoggedIn || !user ? (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <p className="text-gray-300 text-center">
            로그인이 필요합니다.{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-f1-red hover:underline"
            >
              로그인하기
            </button>
          </p>
        </div>
      ) : (
        <>
          {/* 저장된 여행 패키지 리스트 섹션 */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                내 여행 패키지
              </h3>
              {/* 새로고침 버튼 - 패키지 리스트를 다시 로드 */}
              <button
                type="button"
                onClick={loadPackages}
                disabled={loading}
                className="px-4 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? '로딩 중...' : '새로고침'}
              </button>
            </div>

            {/* 저장된 여행 패키지 리스트 */}
            <div>
              {loading ? (
                <p className="text-gray-400 text-sm text-center">로딩 중...</p>
              ) : packages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center">
                  저장된 패키지가 없습니다. Booking 페이지에서 즐겨찾기를 추가해보세요.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h5 className="text-white font-semibold mb-1">
                          {pkg.raceName}
                        </h5>
                        <p className="text-gray-400 text-sm mb-1">
                          {pkg.destinationCity} · {pkg.raceDate}
                        </p>
                        <p className="text-gray-400 text-sm mb-2">
                          {pkg.seatInfo}
                        </p>

                        <div className="text-sm text-gray-300 space-y-1">
                          <p>티켓: ₩{pkg.ticketPrice.toLocaleString()}</p>
                          <p>항공 최저가: ₩{pkg.flightLowestPrice.toLocaleString()}</p>
                          <p>숙소 최저가: ₩{pkg.hotelLowestPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="mt-4 py-2 bg-red-700 text-white font-semibold rounded hover:bg-red-800 transition-colors duration-200"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 재설정 섹션 - 인라인 입력창 제거하고 버튼만 표시 */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              계정 설정
            </h3>

            {/* 비밀번호 재설정 버튼 - 클릭 시 별도 페이지로 이동 */}
            <button
              type="button"
              onClick={handlePasswordReset}
              className="px-6 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
            >
              비밀번호 재설정
            </button>
          </div>
        </>
      )}

      {/* 공통 메시지 영역 */}
      {message && (
        <div className="text-sm text-gray-200 text-center">{message}</div>
      )}
    </div>
  );
}

// MyPage 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default MyPage;
