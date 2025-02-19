import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getUserInfo } from '../../../api/user/user';
import { clearUserInfo } from '../../../store/slices/userSlice';
import { getLocalStorage, logout, removeLocalStorage } from '../../../store/slices/authSlice';
import { setLoading, setItems } from '../../../store/slices/packageSlice';
import { SubmitButton } from '../../../common/form/SubmitButton';
import cameraExample from '@/assets/images/bakery/camera_ex.png';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import Header from '../../../components/owner/header/Header';
import axios from 'axios';
import { getBakeryByOwner } from '../../../api/owner/bakery';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const PackageGuide: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bakeryId, setBakeryId] = useState<number | null>(null);
  
  // Redux에서 auth 상태 가져오기
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const isLoading = useSelector((state: RootState) => state.package.loading);

  // 권한 체크 및 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        console.log('No access token found, getting from localStorage');
        dispatch(getLocalStorage());
        return;
      }

      try {
        const data = await getUserInfo();
        
        if (data.role !== 'OWNER') {
          dispatch(logout());
          dispatch(clearUserInfo());
          dispatch(removeLocalStorage());
          navigate('/login');
          return;
        }

        // 베이커리 정보 조회
        try {
          const bakeryData = await getBakeryByOwner();
          setBakeryId(bakeryData.bakeryId);
        } catch (error) {
          console.error('Error fetching bakery:', error);
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            alert('베이커리 정보를 찾을 수 없습니다. 베이커리를 먼저 등록해주세요.');
            navigate('/owner/bakery/register');
            return;
          }
          throw error;
        }
      } catch (error) {
        console.error('Error in fetchUserInfo:', error);
        dispatch(logout());
        dispatch(clearUserInfo());
        dispatch(removeLocalStorage());
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate, accessToken]);


  // 이미지 캡쳐 및 분석 처리
  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Current bakeryId:', bakeryId);  // bakeryId 상태 확인
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    if (!bakeryId) {
      console.log('No bakeryId found, fetching user info again...');
      try {
        const userData = await getUserInfo();
        if (userData.bakeryId) {
          setBakeryId(userData.bakeryId);
          // 파일 처리 계속 진행
          await processFile(file, userData.bakeryId);
        } else {
          alert('베이커리 정보를 찾을 수 없습니다. 베이커리를 먼저 등록해주세요.');
          navigate('/owner/bakery/register');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('베이커리 정보를 가져오는데 실패했습니다.');
      }
      return;
    }

    await processFile(file, bakeryId);
  };

  // 파일 처리 로직을 별도 함수로 분리
  const processFile = async (file: File, bakeryId: number) => {
    try {
      dispatch(setLoading(true));
      const compressedFile = await compressImage(file);
      
      const formData = new FormData();
      formData.append('images', compressedFile);
      formData.append('bakeryId', bakeryId.toString());

      // 요청 데이터 확인
      console.log('Request Data:', {
        url: '/ai/detect',
        bakeryId,
        fileInfo: {
          name: compressedFile.name,
          type: compressedFile.type,
          size: compressedFile.size
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const response = await axios.post(
        '/ai/detect',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // 응답 데이터 확인
      console.log('Response Data:', response.data);

      const analyzedItems = response.data;
      if (Array.isArray(analyzedItems) && analyzedItems.length > 0) {
        // 분석된 빵 목록을 상태로 저장하고 다음 페이지로 이동
        dispatch(setItems(analyzedItems.map(item => ({
          name: item.name,
          count: item.count,
          price: item.price,
          breadId: item.breadId,
          status: 'confirmed' as const
        }))));

        navigate('/owner/package/preview');
      } else {
        throw new Error('빵을 인식하지 못했습니다.');
      }

    } catch (error) {
      console.error('에러:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (error.response?.status === 413) {
          alert('이미지 크기가 너무 큽니다. 다시 시도해주세요.');
        } else if (error.response?.status === 401) {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
          navigate('/login');
        } else {
          alert('이미지 분석 중 오류가 발생했습니다.');
        }
      }
    } finally {
      dispatch(setLoading(false));
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
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header 
        title="촬영 가이드" 
        onBack={() => navigate(-1)}
      />
      
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center shadow-xl 
            animate-fadeIn mx-4 border border-gray-100">
            <LoadingSpinner />
            <p className="mt-6 text-xl font-semibold text-[#FC973B]">
              빵을 분석하고 있어요
            </p>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-[#FC973B] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#FC973B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#FC973B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

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