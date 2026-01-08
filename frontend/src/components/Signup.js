// React 훅들을 import
import React, { useState } from 'react';

// React Router의 useNavigate를 import - 회원가입 성공 후 이동에 사용
import { useNavigate } from 'react-router-dom';

// axios를 import - 백엔드 API와 통신하기 위해 사용
import axios from 'axios';

/**
 * Signup 컴포넌트
 * PDF 명세의 회원가입 필드를 참고하여 아이디/비밀번호/이메일/이름/약관 동의를 입력받는 페이지
 * 비밀번호 2차 검증 및 아이디 중복 체크 기능을 포함
 */
function Signup() {
  // 폼 입력값들을 상태로 관리
  const [title, setTitle] = useState('MR');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // 아이디 중복 여부 및 메시지 상태
  const [isUsernameDuplicated, setIsUsernameDuplicated] = useState(false);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState('');

  // 서버 응답 또는 에러 메시지 표시를 위한 상태
  const [message, setMessage] = useState('');

  // 회원가입 성공 후 이동을 위해 useNavigate 훅 사용
  const navigate = useNavigate();

  /**
   * 아이디 입력 필드 포커스 해제 시 아이디 중복 여부를 확인하는 함수
   * GET /api/auth/check-username?username=... 엔드포인트를 호출
   */
  const handleUsernameBlur = async () => {
    if (!username) return;
    try {
      const response = await axios.get(
        'http://localhost:8080/api/auth/check-username',
        {
          params: { username },
        }
      );
      if (response.data === true) {
        setIsUsernameDuplicated(true);
        setUsernameCheckMessage('이미 사용 중인 아이디입니다.');
      } else {
        setIsUsernameDuplicated(false);
        setUsernameCheckMessage('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      setIsUsernameDuplicated(false);
      setUsernameCheckMessage('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  /**
   * 회원가입 폼 제출 시 호출되는 핸들러 함수
   * 1) 비밀번호와 비밀번호 확인 일치 여부를 클라이언트에서 먼저 검사
   * 2) 백엔드 /api/auth/signup 엔드포인트에 POST 요청
   */
  const handleSubmit = async (e) => {
    // 기본 폼 전송 동작(페이지 새로고침)을 막음
    e.preventDefault();

    // 비밀번호와 비밀번호 확인 값이 일치하는지 우선 검사
    if (password !== passwordConfirm) {
      setMessage('비밀번호와 비밀번호 확인 값이 일치하지 않습니다.');
      return;
    }

    // 약관 동의가 체크되어 있는지 검사
    if (!termsAgreed) {
      setMessage('개인정보 처리방침 및 약관에 동의해야 합니다.');
      return;
    }

    try {
      // 닉네임은 First name + Last name 조합으로 구성
      const nickname = `${firstName} ${lastName}`.trim();

      // 백엔드 회원가입 API로 POST 요청 보내기
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        username,
        password,
        passwordConfirm,
        email,
        nickname,
        termsAgreed,
      });

      // 성공 메시지를 상태에 저장
      setMessage(response.data.message || '회원가입이 완료되었습니다.');

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      // 서버에서 내려준 에러 메시지를 추출하여 표시
      const errorMessage =
        error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setMessage(errorMessage);
    }
  };

  return (
    // 회원가입 페이지 전체를 감싸는 컨테이너 - 중앙 정렬 및 다크 테마 카드 레이아웃
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xl bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
        {/* 제목 영역 */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          CREATE ACCOUNT
        </h2>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title, First name, Last name 필드 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              >
                <option value="MR">Mr</option>
                <option value="MS">Ms</option>
                <option value="MRS">Mrs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                placeholder="First name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          {/* 이메일 입력 필드 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* 아이디(username) 입력 필드 + 중복 체크 메시지 */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleUsernameBlur}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
              placeholder="Enter your username"
              required
            />
            {usernameCheckMessage && (
              <p
                className={`mt-1 text-xs ${
                  isUsernameDuplicated ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {usernameCheckMessage}
              </p>
            )}
          </div>

          {/* 비밀번호 및 비밀번호 확인 입력 필드 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-f1-red"
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>

          {/* 약관 동의 체크박스 */}
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              개인정보 처리방침 및 이용 약관에 동의합니다.
            </label>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full mt-2 py-2 bg-f1-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
          >
            SIGN UP
          </button>
        </form>

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

// Signup 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default Signup;


