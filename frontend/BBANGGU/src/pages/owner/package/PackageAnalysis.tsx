import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';

const PackageAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지 데이터를 state로 전달
        const imageData = reader.result as string;
        navigate('/owner/package/preview', { state: { image: imageData } });
      };
      reader.readAsDataURL(file);
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
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-full bg-white shadow-lg"
          aria-label="카메라 열기"
        />
      </div>
    </div>
  );
};

export default PackageAnalysis; 