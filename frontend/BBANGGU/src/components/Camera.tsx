import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

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
      // 모바일에서는 후면 카메라를 우선적으로 사용
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },  // 후면 카메라 우선
          width: { ideal: window.innerWidth },   // 화면 너비에 맞춤
          height: { ideal: window.innerHeight }  // 화면 높이에 맞춤
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      onError('카메라 접근 권한이 필요합니다.');
    }
  };

  // 컴포넌트가 언마운트될 때 카메라 스트림 정리
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

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
        muted  // iOS Safari에서 필요
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}  // 전면 카메라일 때 미러링
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