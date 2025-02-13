import { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
  className?: string;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onError, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);  // 스트림 참조 저장

  // 컴포넌트 언마운트 시 스트림 정리
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // 기존 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        },
        audio: false
      });

      streamRef.current = stream;  // 스트림 참조 저장

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => {
              setIsStreaming(true);
              console.log('Camera started successfully');
            })
            .catch(err => {
              console.error('Failed to play video:', err);
              onError('카메라 시작에 실패했습니다.');
            });
        };
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
        autoPlay={false}  // autoPlay 비활성화
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="hidden">
        <button
          data-camera-trigger
          onClick={isStreaming ? captureImage : startCamera}
        >
          {isStreaming ? '촬영' : '카메라 시작'}
        </button>
      </div>
    </div>
  );
};

export default Camera; 