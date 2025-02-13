import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';

const PackageCameraTest: React.FC = () => {
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
      console.log('카메라 시작 중...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',  // 후면 카메라 사용
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
          console.log('카메라 시작 성공');
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
        title="재고 촬영 테스트" 
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

        <div className="h-24 bg-black flex items-center justify-center">
          {isStreaming && (
            <button
              onClick={takePhoto}
              className="w-16 h-16 rounded-full bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCameraTest; 