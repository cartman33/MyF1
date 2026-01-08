// React 라이브러리를 import
import React from 'react';

/**
 * Header 컴포넌트
 * 상단 네비게이션 바를 렌더링하는 컴포넌트
 * SRS에 따라 'My F1' 로고, 메뉴, LOGIN 버튼을 포함
 */
function Header() {
  return (
    // 헤더를 감싸는 nav 요소 - flexbox를 사용하여 레이아웃 구성
    <nav className="flex items-center justify-between px-8 py-4 bg-f1-dark border-b border-gray-800">
      {/* 좌측: My F1 로고 */}
      <div className="flex items-center">
        {/* 로고 텍스트 - F1 레드 컬러 적용 */}
        <h1 className="text-2xl font-bold text-f1-red">
          My F1
        </h1>
      </div>
      
      {/* 중앙: 메뉴 항목들 */}
      <div className="flex items-center space-x-8">
        {/* Schedule 메뉴 */}
        <a href="#schedule" className="text-white hover:text-f1-red transition-colors duration-200">
          Schedule
        </a>
        
        {/* Booking 메뉴 */}
        <a href="#booking" className="text-white hover:text-f1-red transition-colors duration-200">
          Booking
        </a>
        
        {/* MyPage 메뉴 */}
        <a href="#mypage" className="text-white hover:text-f1-red transition-colors duration-200">
          MyPage
        </a>
      </div>
      
      {/* 우측: LOGIN 버튼 */}
      <div className="flex items-center">
        {/* 로그인 버튼 - F1 레드 배경에 흰색 텍스트 */}
        <button className="px-6 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200">
          LOGIN
        </button>
      </div>
    </nav>
  );
}

// Header 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default Header;

