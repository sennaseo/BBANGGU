import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from '../../../components/Camera';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';

const PackageAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const autoStart = location.state?.autoStart;

  useEffect(() => {
    // 컴포넌트 마운트 후 약간의 딜레이를 주고 카메라 시작
    if (autoStart) {
      setTimeout(() => {
        const cameraButton = document.querySelector('button[data-camera-trigger]');
        if (cameraButton) {
          (cameraButton as HTMLButtonElement).click();
        }
      }, 500);
    }
  }, [autoStart]);

  const handleCameraClick = () => {
    const button = document.querySelector('button[data-camera-trigger]') as HTMLButtonElement;
    button?.click();
  };

  const handleCapture = (imageData: string) => {
    navigate('/owner/package/preview', { state: { image: imageData } });
  };

  const handleError = (error: string) => {
    console.error('카메라 에러:', error);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        title="재고 촬영" 
        onBack={() => navigate(-1)}
        className="bg-black"
        textColor="text-white"
      />
      
      <ProgressBar 
        currentStep={PACKAGE_STEPS.CAMERA}  
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 relative overflow-hidden">
          <Camera 
            className="h-full w-full"
            onCapture={handleCapture}
            onError={handleError}
          />
        </div>

        <div className="h-24 bg-black flex items-center px-8 pb-8">
          <div className="flex-1" />
          
          <div className="flex-1 flex justify-center">
            <button
              className="w-16 h-16 rounded-full bg-white"
              onClick={handleCameraClick}
            />
          </div>

          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default PackageAnalysis; 