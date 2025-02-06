import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

declare global {
  interface Window {
    kakao: any;
  }
}

const loadKakaoMapScript = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

loadKakaoMapScript()
  .then(() => window.kakao.maps.load(() => console.log('카카오맵 로드 완료')))
  .catch((e) => console.error('카카오맵 초기화 중 오류 발생:', e));