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
      try {
        const compressedFile = await compressImage(file);
        console.log('원본 크기:', file.size, '압축 후 크기:', compressedFile.size);

        const formData = new FormData();
        formData.append('images', compressedFile);

        // API 호출 수정
        const response = await fetch('https://i12d102.p.ssafy.io/detect', {  // 전체 URL 사용
          method: 'POST',
          headers: {
            // Content-Type은 FormData를 사용할 때는 자동으로 설정됨
            'Accept': 'application/json',
          },
          body: formData
        });

        console.log('서버 응답:', response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('서버 에러 응답:', errorData);
          throw new Error(`서버 에러: ${response.status}`);
        }

        const result = await response.json();
        console.log('분석 결과:', result);

        // 이미지 미리보기용 base64 변환
        const reader = new FileReader();
        reader.onloadend = () => {
          navigate('/owner/package/preview', { 
            state: { 
              image: reader.result,
              analyzedItems: result.items
            } 
          });
        };
        reader.readAsDataURL(compressedFile);

      } catch (error) {
        console.error('상세 에러:', error);
        alert('이미지 분석 중 오류가 발생했습니다.');
      }
    }
  };

  // 이미지 압축 함수
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;  // 최대 너비
          const MAX_HEIGHT = 1024; // 최대 높이
          let width = img.width;
          let height = img.height;

          // 비율 유지하면서 크기 조정
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // 압축된 이미지를 Blob으로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('이미지 압축 실패'));
            }
          }, 'image/jpeg', 0.7);  // 품질 0.7로 압축
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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