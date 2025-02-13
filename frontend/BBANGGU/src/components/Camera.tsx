import { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
  className?: string;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onError, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      // 더 유연한 카메라 설정 사용
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'  // exact 제거, 더 유연하게 설정
        },
        audio: false
      });

      console.log('Got stream:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Detailed camera error:', err);
      // 일반 카메라로 시도
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (fallbackErr) {
        console.error('Fallback camera error:', fallbackErr);
        onError('카메라 접근에 실패했습니다.');
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !isStreaming) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="hidden">
        <button
          data-camera-trigger
          onClick={isStreaming ? captureImage : startCamera}
        >
          {isStreaming ? '사진 촬영' : '카메라 시작'}
        </button>
      </div>
    </div>
  );
};

export default Camera; 