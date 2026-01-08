// React와 ReactDOM 라이브러리를 import
import React from 'react';
import ReactDOM from 'react-dom/client';

// App 컴포넌트와 CSS 파일을 import
import App from './App';
import './index.css';

// React 18의 새로운 createRoot API를 사용하여 루트 요소 생성
// document.getElementById('root')는 public/index.html에 있는 루트 div 요소를 가져옴
const root = ReactDOM.createRoot(document.getElementById('root'));

// App 컴포넌트를 렌더링하여 화면에 표시
root.render(
  // React.StrictMode는 개발 모드에서 잠재적인 문제를 찾아주는 도구
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

