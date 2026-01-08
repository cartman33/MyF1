# 환경 변수 설정 가이드

## .env 파일 생성

프로젝트 루트 디렉토리(`MyF1/`)에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```
AMADEUS_API_KEY=QCyEqg1NE2GqBZdgcu8dS5eQR6mIaxgq
AMADEUS_API_SECRET=RdmgVfMvU359sCAm
```

## 중요 사항

⚠️ **절대 `.env` 파일을 Git에 커밋하지 마세요!** 
- `.gitignore` 파일에 `.env`가 포함되어 있습니다.
- API 키와 시크릿은 보안상 중요한 정보입니다.

## Windows에서 수동으로 환경 변수 설정하는 방법 (선택사항)

만약 `.env` 파일이 작동하지 않는 경우, 시스템 환경 변수로 직접 설정할 수 있습니다:

1. Windows 검색에서 "환경 변수" 검색
2. "시스템 환경 변수 편집" 선택
3. "환경 변수" 버튼 클릭
4. "새로 만들기"를 클릭하여 다음 변수 추가:
   - 변수 이름: `AMADEUS_API_KEY`
   - 변수 값: `QCyEqg1NE2GqBZdgcu8dS5eQR6mIaxgq`
5. 다시 "새로 만들기"를 클릭하여 다음 변수 추가:
   - 변수 이름: `AMADEUS_API_SECRET`
   - 변수 값: `RdmgVfMvU359sCAm`
6. 확인을 클릭하고 컴퓨터를 재시작

## 확인 방법

백엔드 애플리케이션을 실행하면 콘솔에 다음 메시지가 표시됩니다:
- `.env 파일을 성공적으로 로드했습니다.` (성공)
- `경고: .env 파일을 찾을 수 없습니다...` (실패)

