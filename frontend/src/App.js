
// React 라이브러리를 import
import React from 'react';

// React Router에서 Routes, Route 컴포넌트를 import
import { Routes, Route } from 'react-router-dom';

// AuthContext의 AuthProvider를 import - 전역 인증 상태 관리를 위해 사용
import { AuthProvider } from './contexts/AuthContext';

// 공통 레이아웃 컴포넌트들을 import
import Header from './components/Header';
import HeroSection from './components/HeroSection';

// 페이지 컴포넌트들을 import
import Login from './components/Login';
import Signup from './components/Signup';
import Booking from './components/Booking';
import MyPage from './components/MyPage';
import PasswordReset from './components/PasswordReset';

// CSS 파일을 import
import './App.css';

/**
 * 메인 App 컴포넌트
 * 전체 애플리케이션의 레이아웃과 라우팅을 구성하는 최상위 컴포넌트
 * AuthProvider로 감싸서 하위 모든 컴포넌트에서 인증 상태에 접근 가능하도록 함
 */
function App() {
  return (
    // AuthProvider로 전체 앱을 감싸서 전역 인증 상태를 제공
    // 이렇게 하면 하위 모든 컴포넌트에서 useAuth() 훅을 사용하여 로그인 상태에 접근 가능
    <AuthProvider>
      {/* 전체 앱을 감싸는 div - F1 다크 테마 배경색 적용 */}
      <div className="min-h-screen bg-f1-dark">
        {/* 헤더 컴포넌트 - 상단 네비게이션 바 */}
        <Header />

        {/* 메인 콘텐츠 영역 - 라우트에 따라 다른 페이지를 렌더링 */}
        <main className="px-8 py-8">
          <Routes>
            {/* 메인 페이지 - 기존 HeroSection 유지 */}
            <Route path="/" element={<HeroSection />} />

            {/* 로그인 페이지 */}
            <Route path="/login" element={<Login />} />

            {/* 회원가입 페이지 */}
            <Route path="/signup" element={<Signup />} />

            {/* 예약(Booking) 페이지 */}
            <Route path="/booking" element={<Booking />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<MyPage />} />

            {/* 비밀번호 재설정 페이지 */}
            <Route path="/password-reset" element={<PasswordReset />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

// App 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default App;
