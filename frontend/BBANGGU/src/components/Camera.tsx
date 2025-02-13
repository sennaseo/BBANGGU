import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export interface CameraHandle {
  switchCamera: () => Promise<void>;
}

const Camera = forwardRef<CameraHandle, CameraProps>(({ onCapture, onError, className }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // ref를 통해 외부에서 접근할 수 있는 메서드 정의
  useImperativeHandle(ref, () => ({
    switchCamera: async () => {
      await startCamera();
    }
  }));

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,  // 단순히 video: true로 설정
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
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
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="hidden">  {/* 실제 트리거 버튼은 숨김 */}
        {!isStreaming ? (
          <button
            data-camera-trigger
            onClick={startCamera}
          >
            카메라 시작
          </button>
        ) : (
          <button
            data-camera-trigger
            onClick={captureImage}
          >
            사진 촬영
          </button>
        )}
      </div>
    </div>
  );
});

Camera.displayName = 'Camera';

export default Camera; 