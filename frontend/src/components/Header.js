// React 라이브러리를 import
import React from 'react';

// React Router의 Link, useNavigate를 import - 페이지 이동에 사용
import { Link, useNavigate } from 'react-router-dom';

// AuthContext의 useAuth 훅을 import - 로그인 상태와 사용자 정보에 접근하기 위해 사용
import { useAuth } from '../contexts/AuthContext';

/**
 * Header 컴포넌트
 * 상단 네비게이션 바를 렌더링하는 컴포넌트
 * 로그인 상태에 따라 LOGIN/LOGOUT 버튼과 사용자명을 동적으로 표시
 * localStorage를 통해 페이지 새로고침 시에도 로그인 상태가 유지됨
 */
function Header() {
  // useAuth 훅을 사용하여 전역 인증 상태에 접근
  // isLoggedIn: 현재 로그인 여부 (boolean)
  // user: 현재 로그인한 사용자 정보 (Object 또는 null)
  // logout: 로그아웃 함수
  const { isLoggedIn, user, logout } = useAuth();

  // 페이지 이동을 위해 useNavigate 훅 사용
  const navigate = useNavigate();

  /**
   * 로그아웃 버튼 클릭 시 호출되는 핸들러 함수
   * AuthContext의 logout 함수를 호출하여 로그인 상태를 초기화하고 메인 페이지로 이동
   * localStorage에서도 인증 정보가 자동으로 삭제됨
   */
  const handleLogout = () => {
    // AuthContext의 logout 함수 호출 - localStorage에서도 인증 정보 삭제됨
    logout();
    // 로그아웃 후 메인 페이지로 이동
    navigate('/');
  };

  /**
   * LOGIN 버튼 클릭 시 호출되는 핸들러 함수
   * 로그인 페이지로 이동
   */
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    // 헤더를 감싸는 nav 요소 - flexbox를 사용하여 레이아웃 구성
    <nav className="flex items-center justify-between px-8 py-4 bg-f1-dark border-b border-gray-800">
      {/* 좌측: My F1 로고 - 클릭 시 메인 페이지로 이동 */}
      <div className="flex items-center">
        {/* Link 컴포넌트를 사용하여 클릭 시 메인 페이지로 이동 */}
        <Link to="/" className="text-2xl font-bold text-f1-red hover:text-red-600 transition-colors duration-200">
          My F1
        </Link>
      </div>
      
      {/* 중앙: 메뉴 항목들 - React Router의 Link 컴포넌트 사용 */}
      <div className="flex items-center space-x-8">
        {/* Schedule 메뉴 - 메인 페이지로 이동 (일정 표시) */}
        <Link to="/" className="text-white hover:text-f1-red transition-colors duration-200">
          Schedule
        </Link>
        
        {/* Booking 메뉴 - 예약 페이지로 이동 */}
        <Link to="/booking" className="text-white hover:text-f1-red transition-colors duration-200">
          Booking
        </Link>
        
        {/* MyPage 메뉴 - 마이페이지로 이동 */}
        <Link to="/mypage" className="text-white hover:text-f1-red transition-colors duration-200">
          MyPage
        </Link>
      </div>
      
      {/* 우측: 로그인 상태에 따라 다른 UI 표시 */}
      <div className="flex items-center space-x-4">
        {/* 로그인 상태일 때: 사용자명과 LOGOUT 버튼 표시 */}
        {isLoggedIn ? (
          <>
            {/* 환영 메시지 - 로그인한 사용자의 username을 표시 */}
            <span className="text-white text-sm">
              환영합니다 <span className="text-f1-red font-semibold">{user?.username}</span>님
            </span>
            {/* 로그아웃 버튼 - 클릭 시 handleLogout 함수 호출 */}
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors duration-200"
            >
              LOGOUT
            </button>
          </>
        ) : (
          // 로그아웃 상태일 때: LOGIN 버튼만 표시
          <button
            onClick={handleLoginClick}
            className="px-6 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
          >
            LOGIN
          </button>
        )}
      </div>
    </nav>
  );
}

// Header 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default Header;
