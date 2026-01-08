/**
 * 공항 검색 및 지역 기반 공항 자동 지정을 위한 유틸리티 서비스
 * 사용자가 입력한 지역명을 기반으로 가장 가까운 공항 코드를 반환
 */

// 주요 도시와 해당 공항 코드 매핑 데이터
// 실제 구현에서는 Geocoding API나 공항 데이터베이스를 활용할 수 있음
const cityToAirportMap = {
  // 한국
  '서울': 'ICN',
  '인천': 'ICN',
  '부산': 'PUS',
  '제주': 'CJU',
  '대구': 'TAE',
  '광주': 'KWJ',
  
  // 일본
  '도쿄': 'NRT',
  '나리타': 'NRT',
  '하네다': 'HND',
  '오사카': 'KIX',
  '교토': 'KIX',
  '후쿠오카': 'FUK',
  '나고야': 'NGO',
  
  // 중국
  '베이징': 'PEK',
  '상하이': 'PVG',
  '홍콩': 'HKG',
  '광저우': 'CAN',
  
  // 미국
  '로스앤젤레스': 'LAX',
  'LA': 'LAX',
  '뉴욕': 'JFK',
  '시카고': 'ORD',
  '샌프란시스코': 'SFO',
  '시애틀': 'SEA',
  '마이애미': 'MIA',
  '라스베가스': 'LAS',
  
  // 유럽
  '런던': 'LHR',
  '파리': 'CDG',
  '프랑크푸르트': 'FRA',
  '암스테르담': 'AMS',
  '로마': 'FCO',
  '마드리드': 'MAD',
  '바르셀로나': 'BCN',
  '베를린': 'BER',
  '뮌헨': 'MUC',
  '취리히': 'ZRH',
  '비엔나': 'VIE',
  
  // 아시아/태평양
  '싱가포르': 'SIN',
  '방콕': 'BKK',
  '쿠알라룸푸르': 'KUL',
  '자카르타': 'CGK',
  '마닐라': 'MNL',
  '시드니': 'SYD',
  '멜버른': 'MEL',
  '브리즈번': 'BNE',
  '뭄바이': 'BOM',
  '델리': 'DEL',
  
  // 중동
  '두바이': 'DXB',
  '도하': 'DOH',
  '아부다비': 'AUH',
  '리야드': 'RUH',
  
  // 기타
  '모스크바': 'SVO',
  '이스탄불': 'IST',
  '카이로': 'CAI',
};

/**
 * 지역명을 입력받아 가장 가까운 공항 코드를 반환하는 함수
 * @param {string} location - 사용자가 입력한 지역명 (예: "서울", "도쿄", "로스앤젤레스")
 * @returns {string} 공항 코드 (예: "ICN", "NRT", "LAX") 또는 입력값 그대로 (매칭 실패 시)
 */
export function findNearestAirport(location) {
  // 입력값이 없거나 공백인 경우 null 반환
  if (!location || !location.trim()) {
    return null;
  }
  
  // 입력값을 소문자로 변환하여 대소문자 구분 없이 검색
  const normalizedLocation = location.trim().toLowerCase();
  
  // 매핑 데이터를 순회하며 일치하는 도시명 찾기
  for (const [city, airport] of Object.entries(cityToAirportMap)) {
    // 도시명을 소문자로 변환하여 비교
    if (city.toLowerCase() === normalizedLocation) {
      // 일치하는 도시를 찾으면 해당 공항 코드 반환
      return airport;
    }
  }
  
  // 이미 공항 코드 형식인 경우 (3자리 대문자) 그대로 반환
  if (/^[A-Z]{3}$/.test(location.trim().toUpperCase())) {
    return location.trim().toUpperCase();
  }
  
  // 매칭 실패 시 입력값을 그대로 반환 (사용자가 직접 공항 코드를 입력한 것으로 간주)
  return location.trim().toUpperCase();
}

/**
 * 공항 코드를 입력받아 해당 공항의 도시명을 반환하는 함수
 * @param {string} airportCode - 공항 코드 (예: "ICN", "NRT")
 * @returns {string} 도시명 (예: "서울", "도쿄") 또는 공항 코드 그대로 (매칭 실패 시)
 */
export function getCityNameFromAirport(airportCode) {
  // 입력값이 없거나 공백인 경우 null 반환
  if (!airportCode || !airportCode.trim()) {
    return null;
  }
  
  // 공항 코드를 대문자로 변환
  const normalizedCode = airportCode.trim().toUpperCase();
  
  // 매핑 데이터를 순회하며 일치하는 공항 코드 찾기
  for (const [city, airport] of Object.entries(cityToAirportMap)) {
    if (airport === normalizedCode) {
      // 일치하는 공항 코드를 찾으면 해당 도시명 반환
      return city;
    }
  }
  
  // 매칭 실패 시 공항 코드 그대로 반환
  return normalizedCode;
}

