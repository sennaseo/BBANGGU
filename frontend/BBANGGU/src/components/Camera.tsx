import { useRef, useState } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
}

export default function Camera({ onCapture, onError }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // 후면 카메라 사용
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      onError('카메라 접근 권한이 필요합니다.');
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
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="bg-[#FF9F43] text-white px-4 py-2 rounded-lg"
          >
            카메라 시작
          </button>
        ) : (
          <button
            onClick={captureImage}
            className="bg-[#FF9F43] text-white px-4 py-2 rounded-lg"
          >
            사진 촬영
          </button>
        )}
      </div>
    </div>
  );
} 