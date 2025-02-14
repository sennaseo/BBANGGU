import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitButton } from '../../../common/form/SubmitButton';
import cameraExample from '@/assets/images/bakery/camera_ex.png';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import Header from '../../../components/owner/header/Header';

const PackageGuide: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // FormData 생성
          const formData = new FormData();
          formData.append('images', file);  // 파일 그대로 전송

          // API 호출
          const response = await fetch('/bread-package/detect', {
            method: 'POST',
            body: formData  // multipart/form-data로 전송
          });

          if (!response.ok) {
            throw new Error('이미지 업로드 실패');
          }

          const result = await response.json();
          console.log('분석 결과:', result);  // 응답 확인용

          // 분석 결과와 함께 preview 페이지로 이동
          navigate('/owner/package/preview', { 
            state: { 
              image: reader.result,  // 미리보기용 이미지
              analyzedItems: result.items  // 분석 결과
            } 
          });

        } catch (error) {
          console.error('이미지 분석 중 오류:', error);
          alert('이미지 분석 중 오류가 발생했습니다.');
        }
      };
      reader.readAsDataURL(file);  // 미리보기용 base64
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="촬영 가이드" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.GUIDE} 
          totalSteps={TOTAL_PACKAGE_STEPS}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* 설명 텍스트 */}
        <div className="mt-4 text-center">
          <p className="text-base text-gray-600">
            예시와 같이 촬영해주세요
          </p>
          <p className="text-[18px] font-bold text-gray-600">
            빵구 AI가 자동으로 빵의 제고와 가격을 파악합니다!
          </p>
        </div>

        {/* AI 분석 예시 이미지 */}
        <div className="mt-6 flex justify-center">
          <img 
            src={cameraExample} 
            alt="카메라 사용 예시" 
            className="w-[300px] rounded-lg mb-4"
          />
        </div>

        {/* 촬영 가이드라인 */}
        <div className="mt-6 space-y-4 pl-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">1</div>
            <p className="text-gray-700">빵을 트레이에 잘 정렬해주세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">2</div>
            <p className="text-gray-700">빵이 겹치지 않도록 간격을 두세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">3</div>
            <p className="text-gray-700">전체 트레이가 잘 보이게 촬영해주세요</p>
          </div>
        </div>

        {/* 카메라 input 추가 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
        />

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <SubmitButton
            text={<span className="font-bold">재고 찍으러 가기</span>}
            onClick={() => fileInputRef.current?.click()}  // 버튼 클릭시 바로 카메라 열기
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageGuide; 