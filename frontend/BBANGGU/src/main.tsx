import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import App from './App'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react'

// 인증은 httpOnly accessToken 쿠키로만 이루어진다. JS는 토큰을 만지지 않으므로
// 모든 axios 호출(인스턴스/생 axios 모두)이 쿠키를 실어보내게 전역 기본값을 켠다.
axios.defaults.withCredentials = true

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
      };
    };
  }
}

const loadKakaoMapScript = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

// 카카오맵 SDK는 백그라운드로 로드만 시도한다.
// 렌더를 이 Promise 안에 두면 SDK 로드가 실패할 때(예: 도메인 미등록) .then이 안 돌아
// React가 통째로 마운트되지 못하고 흰 화면이 된다. 지도 성공 여부와 앱 구동을 분리한다.
loadKakaoMapScript().catch((e) => console.error('카카오맵 초기화 중 오류 발생:', e));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)