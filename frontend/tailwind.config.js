/** @type {import('tailwindcss').Config} */
// Tailwind CSS 설정 파일 - 커스텀 색상과 스타일을 정의
module.exports = {
  // Tailwind가 적용될 파일 경로 설정
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내의 모든 JS/JSX/TS/TSX 파일
  ],
  theme: {
    extend: {
      // 커스텀 색상 정의 - F1 브랜드 컬러 사용
      colors: {
        // F1 다크 배경색 (#15151E)
        'f1-dark': '#15151E',
        // F1 레드 포인트 컬러
        'f1-red': '#E10600',
      },
    },
  },
  plugins: [],
}

