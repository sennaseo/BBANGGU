import { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
  className?: string;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onError, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
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
          {isStreaming ? '촬영' : '카메라 시작'}
        </button>
      </div>
    </div>
  );
};

export default Camera; 