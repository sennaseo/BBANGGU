import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';

const PackageAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // 컴포넌트 마운트 시 자동으로 카메라 시작
  useEffect(() => {
    startCamera();
    console.log('자동 시작 시도');
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        },
        audio: false 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.objectFit = 'contain';
        
        // 카메라 기능 확인
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities() as any;  // 타입 캐스팅
        console.log('카메라 기능:', capabilities);

        // 줌 기능이 지원되는 경우에만 이벤트 추가
        if (capabilities?.zoom) {  // optional chaining 추가
          let initialDistance = 0;

          const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
              initialDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
              );
            }
          };

          const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
              const distance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
              );
              
              const scale = distance / initialDistance;
              const settings = videoTrack.getSettings() as any;  // 타입 캐스팅
              const currentZoom = settings?.zoom || 1;
              const maxZoom = capabilities?.zoom?.max || 2;
              const newZoom = Math.max(1, Math.min(maxZoom, currentZoom * scale));
              
              try {
                videoTrack.applyConstraints({
                  advanced: [{
                    // @ts-ignore
                    zoom: newZoom
                  }]
                });
              } catch (err) {
                console.log('줌 적용 실패:', err);
              }
            }
          };

          videoRef.current.addEventListener('touchstart', handleTouchStart);
          videoRef.current.addEventListener('touchmove', handleTouchMove);
        }

        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
          console.log('카메라 설정:', videoTrack.getSettings());
        };
      }
    } catch (err) {
      console.error('카메라 에러:', err);
      alert('카메라 접근 권한이 필요합니다.');
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !isStreaming) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      // 촬영 후 미리보기 페이지로 이동
      navigate('/owner/package/preview', { state: { image: imageData } });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        title="재고 촬영" 
        onBack={() => navigate(-1)}
        className="bg-black"
        textColor="text-white"
      />
      
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="h-32 bg-black flex items-center justify-center mb-8">
          {isStreaming && (
            <button
              onClick={takePhoto}
              className="w-16 h-16 rounded-full bg-white shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageAnalysis; 