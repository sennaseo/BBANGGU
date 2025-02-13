import React from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../../../components/Camera';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';

const PackageAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const handleCapture = (imageData: string) => {
    navigate('/owner/package/preview', { state: { image: imageData } });
  };

  const handleError = (error: string) => {
    console.error('카메라 에러:', error);
  };

  const handleCameraClick = () => {
    const button = document.querySelector('button[data-camera-trigger]') as HTMLButtonElement;
    button?.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        title="재고 촬영!!" 
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
            onCapture={handleCapture}
            onError={handleError}
            className="h-full w-full"
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