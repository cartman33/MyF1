// React와 ReactDOM 라이브러리를 import
import React from 'react';
import ReactDOM from 'react-dom/client';

// React Router의 BrowserRouter를 import - 클라이언트 사이드 라우팅을 위한 컴포넌트
import { BrowserRouter } from 'react-router-dom';

// App 컴포넌트와 CSS 파일을 import
import App from './App';
import './index.css';

// React 18의 새로운 createRoot API를 사용하여 루트 요소 생성
// document.getElementById('root')는 public/index.html에 있는 루트 div 요소를 가져옴
const root = ReactDOM.createRoot(document.getElementById('root'));

// App 컴포넌트를 BrowserRouter로 감싸서 라우팅 기능을 활성화
root.render(
  // React.StrictMode는 개발 모드에서 잠재적인 문제를 찾아주는 도구
  <React.StrictMode>
    {/* BrowserRouter 내부에서 App 컴포넌트가 라우팅을 사용할 수 있도록 설정 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

