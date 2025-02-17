import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { 
  setItems, 
  updateItem, 
  deleteItem,
  BreadItem,
  setCombinations,
  setLoading
} from '../../../store/slices/packageSlice';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import { CameraIcon } from '@heroicons/react/24/outline';
import { HiPencil } from 'react-icons/hi';
import axios from 'axios';
import { compressImage } from '../../../utils/imageCompression';

const PackagePreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.package.items);
  const { bakeryId } = useSelector((state: RootState) => state.user.userInfo ?? { bakeryId: null });
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const analyzedItems = location.state?.analyzedItems;
    if (analyzedItems && items.length === 0) {
      // 분석된 빵 목록을 상태로 변환
      const breadList = analyzedItems[1].map((item: { name: string; price: number; count: number }) => ({
        name: item.name,
        count: item.count,
        price: item.price,
        status: 'confirmed' as const
      }));
      dispatch(setItems(breadList));
      
      // 추천 조합도 저장
      if (analyzedItems[0]) {
        dispatch(setCombinations(analyzedItems[0]));
      }
    }
  }, [location.state, items.length, dispatch]);

  const handleEdit = (name: string) => {
    const item = items.find(item => item.name === name);
    if (item) {
      dispatch(updateItem({ ...item, status: 'editing' }));
    }
  };

  const handleConfirm = (name: string) => {
    const item = items.find(item => item.name === name);
    if (item) {
      dispatch(updateItem({ ...item, status: 'confirmed' }));
    }
  };

  const handleChange = (name: string, field: keyof BreadItem, value: string | number) => {
    const item = items.find(item => item.name === name);
    if (item) {
      dispatch(updateItem({ ...item, [field]: value }));
    }
  };

  const handleAddMore = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && bakeryId) {
        try {
          dispatch(setLoading(true));
          const compressedFile = await compressImage(file);
          
          const formData = new FormData();
          formData.append('images', compressedFile);
          formData.append('bakeryId', bakeryId.toString());

          const response = await axios.post(
            'https://i12d102.p.ssafy.io/ai/detectcrop',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
              },
              withCredentials: false
            }
          );

          const result = response.data;
          if (Array.isArray(result) && result.length >= 2) {
            // 새로운 빵 목록을 기존 목록과 병합
            const newBreadList = result[1].map((item: { name: string; price: number; count: number }) => ({
              name: item.name,
              count: item.count,
              price: item.price,
              status: 'confirmed' as const
            }));

            // 기존 items와 새로운 items 병합 (같은 이름의 빵은 수량 합치기)
            const mergedItems = [...items];
            
            newBreadList.forEach((newItem: BreadItem) => {
              const existingItemIndex = mergedItems.findIndex(item => item.name === newItem.name);
              
              if (existingItemIndex !== -1) {
                // 이미 존재하는 빵이면 수량만 더하기
                mergedItems[existingItemIndex] = {
                  ...mergedItems[existingItemIndex],
                  count: mergedItems[existingItemIndex].count + newItem.count
                };
              } else {
                // 새로운 빵이면 추가
                mergedItems.push(newItem);
              }
            });

            dispatch(setItems(mergedItems));
            
            // 새로운 조합 추가
            if (result[0]) {
              dispatch(setCombinations(result[0]));
            }
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
      } else if (!bakeryId) {
        alert('베이커리 정보를 찾을 수 없습니다.');
      }
    };

    fileInput.click();
  };

  const handleManualAdd = () => {
    const newItem: BreadItem = {
      name: '',
      count: 1,
      price: 0,
      status: 'editing'
    };
    dispatch(setItems([...items, newItem]));
  };

  const handleDelete = (name: string) => {
    dispatch(deleteItem(name));
  };

  // 재고 등록 API 호출 함수 수정
  const registerStock = async () => {
    try {
      // 모든 아이템의 재고 등록을 병렬로 처리
      const stockPromises = items.map(item => 
        axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/stock`,
          {
            bakeryId,
            breadId: item.name, // TODO: 실제 breadId로 수정 필요
            quantity: item.count
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      await Promise.all(stockPromises);
      
      // 재고 등록 성공 후 로딩 페이지로 이동
      navigate('/owner/package/loading');

    } catch (error) {
      console.error('재고 등록 실패:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        } else {
          alert('재고 등록 중 오류가 발생했습니다.');
        }
      }
    }
  };

  return (
    <div className="h-[100vh] bg-white flex flex-col">
      <Header 
        title="재고 확인" 
        onBack={() => navigate(-1)}
      />
      
      <ProgressBar 
        currentStep={PACKAGE_STEPS.PREVIEW} 
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 flex-1">
          <div className="mb-8 pl-2">
            <p className="text-[16px] text-gray-900 font-medium mb-2">
              빵구 AI가 촬영한 빵을 자동으로 인식했어요!
            </p>
            <p className="text-[14px] text-gray-600">
              *새로운 빵을 등록하면 다음 촬영부터는
            </p>
            <p className="text-[14px] text-gray-600">
              자동으로 가격과 정보를 기억해서 채워드려요.
            </p>
          </div>

          <div className="mb-2">
            <div className="grid grid-cols-12 text-[14px] text-gray-900 h-[40px] items-center">
              <div className="col-span-3 text-center font-medium">상품명</div>
              <div className="col-span-2 text-center font-medium">수량</div>
              <div className="col-span-3 text-center font-medium">가격</div>
              <div className="col-span-4 text-center font-medium">관리</div>
            </div>
            <div className="h-[1px] bg-gray-200 w-full"></div>
          </div>

          <div className="flex-1">
            {items.map((item, index) => (
              <div key={`${item.name}-${index}`}>
                <div className="grid grid-cols-12 items-center h-[52px]">
                  <div className="col-span-3 text-center text-[14px] text-gray-900 px-2">
                    {item.status === 'editing' ? (
                      <input
                        type="text"
                        value={item.name}
                        className="w-20 text-center border rounded-[6px] h-10 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                        onChange={(e) => handleChange(item.name, 'name', e.target.value)}
                      />
                    ) : (
                      <span className="truncate">{item.name}</span>
                    )}
                  </div>
                  <div className="col-span-2 text-center text-[14px] text-gray-900">
                    {item.status === 'editing' ? (
                      <div className="flex justify-center">
                        <input
                          type="number"
                          value={item.count}
                          className="w-16 text-center border rounded-[6px] h-10 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                          onChange={(e) => handleChange(item.name, 'count', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ) : (
                      item.count
                    )}
                  </div>
                  <div className="col-span-3 text-center text-[14px] text-gray-900">
                    {item.status === 'editing' ? (
                      <div className="flex justify-center">
                        <input 
                          type="number" 
                          value={item.price} 
                          className="w-24 text-center border rounded-[6px] h-10 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                          onChange={(e) => handleChange(item.name, 'price', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ) : (
                      item.price.toLocaleString()
                    )}
                  </div>
                  <div className="col-span-4 text-center flex justify-center gap-3">
                    <button
                      className={`
                        w-[72px] h-10
                        rounded-[6px] text-[14px]
                        ${
                          item.status === 'confirmed' 
                            ? 'border border-[#FC973B] text-gray-900'
                            : 'bg-[#FC973B] text-white'
                        }
                      `}
                      onClick={() => item.status === 'confirmed' ? handleEdit(item.name) : handleConfirm(item.name)}
                    >
                      {item.status === 'confirmed' ? '수정' : '완료'}
                    </button>
                    {item.status === 'editing' && (
                      <button
                        className="w-[72px] h-10 rounded-[6px] text-[14px] border border-red-500 text-red-500"
                        onClick={() => handleDelete(item.name)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-[1px] bg-gray-200 w-full"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={handleAddMore}
              className="bg-[#FC973B] text-white py-3.5 rounded-[8px] flex items-center justify-center gap-2 text-[16px] font-bold"
            >
              <CameraIcon className="w-5 h-5" />
              추가 촬영
            </button>
            <button
              onClick={handleManualAdd}
              className="bg-white border border-[#FC973B] text-[#FC973B] py-3.5 rounded-[8px] flex items-center justify-center gap-2 text-[16px] font-bold"
            >
              <HiPencil className="w-5 h-5" />
              직접 추가
            </button>
          </div>

          {/* 경고 메시지 */}
        </div>

        <div className="p-4 mb-8 sticky bottom-0 bg-white">
          <div className="text-center mb-4">
            <p className="text-[18px] text-[#FC973B] mb-1 font-bold">
              마지막으로 한 번만 더 확인해주세요!
            </p>
            <p className="text-[16px] text-gray-600">
              이후에는 수정이 불가능해요.
            </p>
          </div>

          <button
            className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
            onClick={registerStock}
            disabled={items.length === 0} // 아이템이 없으면 버튼 비활성화
          >
            빵꾸러미 만들러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagePreview; 