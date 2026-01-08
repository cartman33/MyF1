// React 라이브러리를 import
import React from 'react';

// 컴포넌트들을 import
import Header from './components/Header';
import HeroSection from './components/HeroSection';

// CSS 파일을 import
import './App.css';

/**
 * 메인 App 컴포넌트
 * 전체 애플리케이션의 레이아웃을 구성하는 최상위 컴포넌트
 */
function App() {
  return (
    // 전체 앱을 감싸는 div - F1 다크 테마 배경색 적용
    <div className="min-h-screen bg-f1-dark">
      {/* 헤더 컴포넌트 - 상단 네비게이션 바 */}
      <Header />
      
      {/* 히어로 섹션 컴포넌트 - 메인 콘텐츠 영역 */}
      <HeroSection />
    </div>
  );
}

// App 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default App;

