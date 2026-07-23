// 환경변수 접근은 이 파일로 일원화한다. 컴포넌트/API 파일에서 import.meta.env를 직접 읽지 말 것.
const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export const API_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
);

export const IMAGE_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_IMAGE_BASE_URL || API_BASE_URL
);

// 토스 클라이언트 키는 브라우저 노출용 공개 키. 기본값은 문서용 공용 테스트 키.
export const TOSS_CLIENT_KEY =
  import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_d46qopOB896qMYBeYgj53ZmM75y0';
