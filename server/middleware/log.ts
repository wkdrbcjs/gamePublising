// 미들웨어 함수 정의:
// defineEventHandler() 또는 eventHandler()를 사용하여 함수 정의
// event 객체를 인자로 받음
// 반환값이 없어야 함 (요청을 수정하거나 로깅만 수행)
// 미들웨어 실행 순서:
// 1. 파일 이름 알파벳 순서로 실행됨
// 2. 숫자 접두사로 순서 제어 가능 (예: 01.logger.ts)

// 모든 서버 요청을 중간에 가로채서 요청을 수정하거나 로깅할 수 있음

export default defineEventHandler(async (event) => {
  // console.log('this is server/middleware new request: ' + getRequestURL(event))
})