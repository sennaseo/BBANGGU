import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'

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

loadKakaoMapScript()
  .then(() => {
    // 서비스 워커 등록 코드 수정
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('서비스 워커가 등록되었습니다:', registration);
        })
        .catch(error => {
          console.log('서비스 워커 등록 실패:', error);
        });
    }

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    )
  })
  .catch((e) => console.error('카카오맵 초기화 중 오류 발생:', e));