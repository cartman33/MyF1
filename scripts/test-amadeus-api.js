// Amadeus API 테스트 스크립트
// 이 스크립트는 Amadeus API 연동을 테스트하기 위한 유틸리티입니다.
// 사용법: node scripts/test-amadeus-api.js

// 필요한 모듈 가져오기
const axios = require('axios'); // HTTP 요청을 보내기 위한 라이브러리
const qs = require('qs');       // 데이터를 URL 인코딩 형식(key=value)으로 변환해주는 라이브러리

// 본인의 API 인증 정보 (보안상 원래는 .env 파일에 넣어야 하지만, 테스트를 위해 변수로 설정합니다)
const CLIENT_ID = 'QCyEqg1NE2GqBZdgcu8dS5eQR6mIaxgq';
const CLIENT_SECRET = 'RdmgVfMvU359sCAm';

// 메인 테스트 함수 정의 (비동기 함수 async 사용)
async function runTest() {
    try {
        console.log("--- [1단계] 액세스 토큰 발급 요청 시작 ---");

        // Amadeus 서버에 토큰을 요청합니다.
        const authResponse = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
            qs.stringify({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        // 발급받은 토큰 저장
        const accessToken = authResponse.data.access_token;
        console.log("✅ 토큰 발급 성공: " + accessToken.substring(0, 15) + "...");

        console.log("\n--- [2단계] F1 개최지(밀라노) 항공권 검색 시작 ---");

        // 발급받은 토큰을 사용하여 실제 항공권 정보를 요청합니다.
        // 이탈리아 GP가 열리는 몬차(Monza)와 가장 가까운 밀라노(MXP) 노선을 검색합니다.
        const flightResponse = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            params: {
                originLocationCode: 'ICN',      // 출발지: 인천공항
                destinationLocationCode: 'MXP', // 도착지: 밀라노 말펜사 공항
                departureDate: '2026-09-03',    // 2026년 이탈리아 GP 시작 전날 (임의 날짜)
                adults: '1',                    // 인원: 성인 1명
                max: 3                          // 결과는 최대 3개만 가져오기
            },
            headers: {
                // 중요: 앞서 발급받은 토큰을 Authorization 헤더에 Bearer 방식으로 넣어줍니다.
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // 검색 결과 출력
        const flights = flightResponse.data.data;

        if (flights.length === 0) {
            console.log("⚠️ 검색 결과가 없습니다. (테스트 서버의 데이터 한계일 수 있습니다)");
        } else {
            console.log(`✅ 총 ${flights.length}개의 항공권을 찾았습니다!`);

            flights.forEach((flight, index) => {
                console.log(`\n[티켓 #${index + 1}]`);
                console.log(`- 가격: ${flight.price.total} ${flight.price.currency}`);
                console.log(`- 항공사: ${flight.validatingAirlineCodes[0]}`);
                console.log(`- 경유 횟수: ${flight.itineraries[0].segments.length - 1}회`);
            });
        }

    } catch (error) {
        // 에러가 발생했을 때 상세 내용 출력
        console.error("\n❌ 오류가 발생했습니다!");
        if (error.response) {
            // 서버가 응답은 보냈으나 상태 코드가 2xx가 아닌 경우
            console.error("상태 코드:", error.response.status);
            console.error("에러 내용:", JSON.stringify(error.response.data, null, 2));
        } else {
            // 요청 자체에 문제가 생긴 경우
            console.error("메시지:", error.message);
        }
    }
}

// 테스트 실행
runTest();

