// React의 createContext와 useState, useEffect 훅을 import
import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * AuthContext 생성
 * React Context API를 사용하여 전역 인증 상태를 관리하기 위한 컨텍스트 객체
 * 이 컨텍스트는 isLoggedIn(로그인 여부)과 user(사용자 정보)를 전역에서 공유할 수 있게 해줌
 */
const AuthContext = createContext();

/**
 * AuthProvider 컴포넌트
 * 앱의 최상위 레벨에서 이 Provider로 감싸면 하위 모든 컴포넌트에서 인증 상태에 접근 가능
 * localStorage를 활용하여 페이지 새로고침 시에도 로그인 상태를 유지함
 */
export function AuthProvider({ children }) {
  // 로그인 여부를 저장하는 상태 변수 (초기값은 localStorage에서 복원)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // localStorage에서 'isLoggedIn' 키의 값을 읽어옴 (문자열 "true" 또는 null)
    const savedLoginState = localStorage.getItem('isLoggedIn');
    // 문자열 "true"를 boolean true로 변환하여 초기값으로 설정
    return savedLoginState === 'true';
  });

  // 현재 로그인한 사용자 정보를 저장하는 상태 변수 (초기값은 localStorage에서 복원)
  const [user, setUser] = useState(() => {
    // localStorage에서 'user' 키의 값을 읽어옴 (JSON 문자열 또는 null)
    const savedUser = localStorage.getItem('user');
    // JSON 문자열이 있으면 파싱하여 객체로 변환, 없으면 null
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /**
   * 컴포넌트가 마운트될 때 실행되는 useEffect 훅
   * 페이지 새로고침 시 localStorage에서 인증 상태를 복원하는 로직
   */
  useEffect(() => {
    // localStorage에서 저장된 로그인 상태와 사용자 정보를 읽어옴
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('user');

    // 저장된 로그인 상태가 "true"이고 사용자 정보가 있으면 상태를 복원
    if (savedLoginState === 'true' && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    } else {
      // 저장된 정보가 없으면 로그아웃 상태로 초기화
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트 마운트 시 한 번만 실행

  /**
   * 로그인 함수
   * 사용자 정보를 받아서 상태를 업데이트하고 localStorage에 저장
   * @param {Object} userData - 로그인한 사용자의 정보 (username, email 등)
   */
  const login = (userData) => {
    // 로그인 상태를 true로 변경
    setIsLoggedIn(true);
    // 사용자 정보를 상태에 저장
    setUser(userData);
    // localStorage에 로그인 상태를 문자열 "true"로 저장 (브라우저를 닫아도 유지됨)
    localStorage.setItem('isLoggedIn', 'true');
    // localStorage에 사용자 정보를 JSON 문자열로 저장
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * 로그아웃 함수
   * 로그인 상태를 false로 변경하고 localStorage에서 인증 정보를 삭제
   */
  const logout = () => {
    // 로그인 상태를 false로 변경
    setIsLoggedIn(false);
    // 사용자 정보를 null로 초기화
    setUser(null);
    // localStorage에서 로그인 상태 정보 삭제
    localStorage.removeItem('isLoggedIn');
    // localStorage에서 사용자 정보 삭제
    localStorage.removeItem('user');
  };

  /**
   * AuthContext의 값 객체
   * 하위 컴포넌트에서 사용할 수 있도록 isLoggedIn, user, login, logout 함수를 제공
   */
  const value = {
    isLoggedIn, // 현재 로그인 여부 (boolean)
    user, // 현재 로그인한 사용자 정보 (Object 또는 null)
    login, // 로그인 함수
    logout, // 로그아웃 함수
  };

  /**
   * AuthContext.Provider 컴포넌트를 반환
   * value prop에 위에서 정의한 인증 상태와 함수들을 전달하여 하위 컴포넌트에서 사용 가능하게 함
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth 커스텀 훅
 * 컴포넌트에서 AuthContext를 쉽게 사용하기 위한 헬퍼 함수
 * 이 훅을 사용하면 매번 useContext(AuthContext)를 호출할 필요 없이 간단하게 인증 상태에 접근 가능
 * @returns {Object} AuthContext의 값 (isLoggedIn, user, login, logout)
 */
export function useAuth() {
  // useContext 훅을 사용하여 AuthContext의 현재 값을 가져옴
  const context = useContext(AuthContext);
  
  // AuthProvider로 감싸지 않은 컴포넌트에서 useAuth를 호출한 경우 에러 발생
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // AuthContext의 값 반환
  return context;
}

