// React 훅들을 import
import React, { useState } from 'react';

// React Router의 useNavigate를 import - 페이지 이동에 사용
import { useNavigate } from 'react-router-dom';

// axios를 import - 백엔드 API와 통신하기 위해 사용
import axios from 'axios';

// AuthContext의 useAuth 훅을 import - 로그인 상태와 사용자 정보에 접근하기 위해 사용
import { useAuth } from '../contexts/AuthContext';

/**
 * PasswordReset 컴포넌트
 * 비밀번호 재설정을 위한 별도 페이지
 * MyPage에서 분리되어 독립적으로 동작하는 컴포넌트
 * 다크 테마와 레드 포인트 스타일을 엄격히 준수
 */
function PasswordReset() {
  // AuthContext에서 로그인 상태와 사용자 정보 가져오기
  const { isLoggedIn, user } = useAuth();
  
  // 페이지 이동을 위해 useNavigate 훅 사용
  const navigate = useNavigate();

  // 비밀번호 입력 필드 상태 변수들
  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(''); // 새 비밀번호 확인

  // 서버 응답 또는 에러 메시지를 표시하기 위한 상태 변수
  const [message, setMessage] = useState('');

  // 로딩 상태를 나타내는 상태 변수
  const [loading, setLoading] = useState(false);

  /**
   * 비밀번호 변경 폼 제출 시 호출되는 핸들러 함수
   * 현재는 UI만 구현되어 있으며, 추후 백엔드 API 연동 시 사용할 함수
   */
  const handleSubmit = async (e) => {
    // 기본 폼 전송 동작(페이지 새로고침)을 막음
    e.preventDefault();

    // 로그인하지 않은 경우 처리 불가
    if (!isLoggedIn || !user) {
      setMessage('로그인이 필요합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    // 새 비밀번호와 확인 비밀번호가 일치하는지 검증
    if (newPassword !== newPasswordConfirm) {
      setMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 최소 길이 검증 (예: 8자 이상)
    if (newPassword.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 추후 백엔드 API 연동 시 사용할 코드 (현재는 주석 처리)
      // await axios.post('http://localhost:8080/api/mypage/change-password', {
      //   username: user.username,
      //   currentPassword,
      //   newPassword,
      // });

      // 현재는 UI만 구현되어 있으므로 성공 메시지 표시
      setMessage('비밀번호 변경 기능은 추후 구현 예정입니다.');
      
      // 성공 시 폼 초기화
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (error) {
      // 에러 발생 시 메시지 표시
      setMessage('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 뒤로가기 버튼 클릭 시 호출되는 핸들러 함수
   * 마이페이지로 돌아가기
   */
  const handleGoBack = () => {
    navigate('/mypage');
  };

  return (
    // 비밀번호 재설정 페이지 전체를 감싸는 컨테이너 - 중앙 정렬 및 다크 테마 카드 레이아웃
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
        {/* 제목 영역 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">비밀번호 재설정</h2>
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={handleGoBack}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* 로그인하지 않은 경우 안내 메시지 */}
        {!isLoggedIn || !user ? (
          <div className="text-center">
            <p className="text-gray-300 mb-4">로그인이 필요합니다.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
            >
              로그인하기
            </button>
          </div>
        ) : (
          <>
            {/* 현재 로그인한 사용자 정보 표시 */}
            <div className="mb-6 p-3 bg-gray-800 rounded border border-gray-700">
              <p className="text-sm text-gray-400">계정</p>
              <p className="text-white font-semibold">{user.username}</p>
            </div>

            {/* 비밀번호 변경 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 현재 비밀번호 입력 필드 */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                  placeholder="현재 비밀번호를 입력하세요"
                  required
                />
              </div>

              {/* 새 비밀번호 입력 필드 */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                  placeholder="새 비밀번호를 입력하세요 (최소 8자)"
                  required
                  minLength={8}
                />
              </div>

              {/* 새 비밀번호 확인 입력 필드 */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                  minLength={8}
                />
              </div>

              {/* 비밀번호 변경 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '비밀번호 변경'}
              </button>
            </form>
          </>
        )}

        {/* 서버 응답/에러 메시지 표시 영역 */}
        {message && (
          <div className="mt-4 text-sm text-center text-gray-200">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// PasswordReset 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default PasswordReset;

