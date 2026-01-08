// React 훅들을 import
import React, { useState } from 'react';

// React Router의 Link, useNavigate를 import - 페이지 이동에 사용
import { Link, useNavigate } from 'react-router-dom';

// axios를 import - 백엔드 API와 통신하기 위해 사용
import axios from 'axios';

// AuthContext의 useAuth 훅을 import - 로그인 상태를 전역으로 관리하기 위해 사용
import { useAuth } from '../contexts/AuthContext';

/**
 * Login 컴포넌트
 * 사용자의 아이디와 비밀번호를 입력받아 로그인 요청을 보내는 페이지
 * 하단에 회원가입(/signup) 링크와 비밀번호 재설정 버튼 UI를 포함
 * 로그인 성공 시 AuthContext의 login 함수를 호출하여 전역 상태를 업데이트
 */
function Login() {
  // 폼 입력값을 관리하는 상태 변수들
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 서버 응답 또는 에러 메시지를 표시하기 위한 상태 변수
  const [message, setMessage] = useState('');

  // 로그인 성공 후 페이지 이동을 위해 useNavigate 훅 사용
  const navigate = useNavigate();

  // AuthContext의 login 함수를 가져옴 - 로그인 성공 시 전역 상태를 업데이트하기 위해 사용
  const { login } = useAuth();

  /**
   * 로그인 폼 제출 시 호출되는 핸들러 함수
   * 백엔드 /api/auth/login 엔드포인트에 POST 요청을 보내고,
   * 성공 시 AuthContext의 login 함수를 호출하여 전역 상태를 업데이트
   */
  const handleSubmit = async (e) => {
    // 기본 폼 전송 동작(페이지 새로고침)을 막음
    e.preventDefault();

    try {
      // 백엔드 로그인 API로 POST 요청 보내기
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      // 성공 메시지를 상태에 저장
      setMessage(response.data.message || '로그인에 성공했습니다.');

      // AuthContext의 login 함수 호출 - 전역 인증 상태를 업데이트하고 localStorage에 저장
      // 사용자 정보 객체를 전달하여 전역 상태에 저장 (username, email 등 필요한 정보 포함)
      login({ username, email: response.data.email || '' });

      // 로그인 성공 후 Booking 페이지로 이동
      navigate('/booking');
    } catch (error) {
      // 서버에서 내려준 에러 메시지를 추출하여 표시
      const errorMessage =
        error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setMessage(errorMessage);
    }
  };

  /**
   * 비밀번호 재설정 버튼 클릭 시 호출되는 핸들러
   * 비밀번호 재설정 페이지(/password-reset)로 이동
   */
  const handleResetPassword = () => {
    navigate('/password-reset');
  };

  return (
    // 로그인 페이지 전체를 감싸는 컨테이너 - 중앙 정렬 및 다크 테마 카드 레이아웃
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
        {/* 제목 영역 */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          SIGN IN
        </h2>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 입력 필드 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email address / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full mt-2 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
          >
            SIGN IN
          </button>
        </form>

        {/* 하단 링크 및 비밀번호 재설정 버튼 영역 */}
        <div className="mt-6 text-sm text-gray-300 space-y-2">
          {/* 회원가입 링크 */}
          <div className="flex justify-between items-center">
            <span>Don't have an account yet?</span>
            <Link
              to="/signup"
              className="text-f1-red hover:underline font-semibold"
            >
              Register with F1
            </Link>
          </div>

          {/* 비밀번호 재설정 버튼 - 현재는 UI만 구현 */}
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full mt-2 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            Forgotten password?
          </button>
        </div>

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

// Login 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default Login;


