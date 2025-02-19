import React, { useEffect, useState } from 'react';
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
import { BREAD_CATEGORIES } from '../bread/BreadRegisterPage';  // 카테고리 정보 import
import { getUserInfo } from '../../../api/user/user';
import { getBakeryByOwner } from '../../../api/owner/bakery';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// 타입 정의 추가
interface BreadCombination {
  breads: {
    name: string;
    quantity: number;
    breadId: number;
  }[];
  total_price: number;
}

const PackagePreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [bakeryId, setBakeryId] = useState<number | null>(null);
  const items = useSelector((state: RootState) => state.package.items);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const isLoading = useSelector((state: RootState) => state.package.loading);

  useEffect(() => {
    const fetchBakeryInfo = async () => {
      try {
        const userData = await getUserInfo();
        
        if (userData.role !== 'OWNER') {
          navigate('/');
          return;
        }

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
        console.error('사용자 정보 조회 실패:', error);
        alert('사장님 정보를 가져오는데 실패했습니다.');
        navigate('/');
      }
    };

    fetchBakeryInfo();
  }, [navigate]);

  useEffect(() => {
    const analyzedItems = location.state?.analyzedItems;
    console.log('초기 분석 데이터:', analyzedItems);
    
    if (analyzedItems && items.length === 0) {
      const breadList = analyzedItems.map((item: { 
        name: string; 
        price: number; 
        count: number;
        breadId: number;
      }) => {
        const category = BREAD_CATEGORIES.find(cat => cat.id === item.breadId);
        console.log('매칭 시도:', {
          breadId: item.breadId,
          foundCategory: category,
          allCategories: BREAD_CATEGORIES.map(c => ({ id: c.id, name: c.name }))
        });
        
        return {
          name: item.name,
          count: item.count,
          price: item.price,
          status: 'confirmed' as const,
          breadId: item.breadId,
          categoryId: item.breadId,
          categoryName: category?.name
        };
      });
      console.log('변환된 빵 목록:', breadList);
      dispatch(setItems(breadList));
      
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
            '/ai/detect',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );

          console.log('추가 촬영 응답:', {
            rawData: response.data,
            status: response.status,
            headers: response.headers
          });

          const analyzedItems = response.data;
          if (Array.isArray(analyzedItems) && analyzedItems.length > 0) {
            const mergedItems = [...items];
            const newIds: string[] = [];
            
            analyzedItems.forEach(newItem => {
              const existingItemIndex = mergedItems.findIndex(item => item.breadId === newItem.breadId);
              
              if (existingItemIndex !== -1) {
                mergedItems[existingItemIndex] = {
                  ...mergedItems[existingItemIndex],
                  count: mergedItems[existingItemIndex].count + newItem.count
                };
                newIds.push(mergedItems[existingItemIndex].name);
              } else {
                const newItemWithId = {
                  name: newItem.name,
                  count: newItem.count,
                  price: newItem.price,
                  breadId: newItem.breadId,
                  status: 'confirmed' as const
                };
                mergedItems.push(newItemWithId);
                newIds.push(newItemWithId.name);
              }
            });

            dispatch(setItems(mergedItems));
            setNewItemIds(newIds);
            
            setTimeout(() => {
              setNewItemIds([]);
            }, 3000);
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

  const handleCategorySelect = (name: string, categoryId: number) => {
    // 이미 해당 카테고리가 사용중인지 확인
    const categoryExists = items.some(item => 
      item.categoryId === categoryId && item.name !== name
    );

    if (categoryExists) {
      alert('이미 등록된 카테고리입니다. 카테고리당 1개의 빵만 등록할 수 있습니다.');
      return;
    }

    const item = items.find(item => item.name === name);
    if (item) {
      const category = BREAD_CATEGORIES.find(cat => cat.id === categoryId);
      dispatch(updateItem({ 
        ...item, 
        categoryId,
        categoryName: category?.name
      }));
    }
  };

  const handleManualAdd = () => {
    const newItem: BreadItem = {
      name: '',
      count: 1,
      price: 0,
      status: 'editing',
      categoryId: undefined,
      categoryName: undefined
    };

    // 사용 가능한 카테고리가 있는지 확인
    const usedCategories = new Set(items.map(item => item.categoryId));
    if (usedCategories.size >= BREAD_CATEGORIES.length) {
      alert('더 이상 새로운 빵을 추가할 수 없습니다. 모든 카테고리가 사용중입니다.');
      return;
    }

    dispatch(setItems([...items, newItem]));
  };

  const handleDelete = (name: string) => {
    dispatch(deleteItem(name));
  };

  // registerStock 함수 수정
  const registerStock = async () => {
    try {
      dispatch(setLoading(true));

      const requestData = items.map(item => ({
        name: item.name,
        price: item.price,
        count: item.count,
        breadId: item.breadId
      }));

      // 요청 데이터 로그
      console.log('빵꾸러미 조합 요청 데이터:', {
        url: '/ai/generate-package',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        requestData
      });

      const response = await axios.post<BreadCombination[][]>(
        '/ai/generate-package',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 응답 데이터 로그
      console.log('빵꾸러미 조합 응답 데이터:', response.data);

      // PackageLoading로 이동하면서 데이터 전달
      navigate('/owner/package/loading', {
        state: {
          packageSuggestions: response.data,
          originalItems: items
        }
      });

    } catch (error) {
      console.error('빵꾸러미 조합 실패:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        } else {
          alert('빵꾸러미 조합 생성 중 오류가 발생했습니다.');
        }
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header 
        title="미리보기" 
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

      <ProgressBar 
        currentStep={PACKAGE_STEPS.PREVIEW} 
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 flex-1">
          <div className="mb-6">
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

          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={`${item.name}-${index}`}
                className={`bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-500
                  ${newItemIds.includes(item.name) ? 
                    'animate-[highlight_1s_ease-in-out]' : ''
                  }
                `}
              >
                {item.status === 'editing' ? (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">카테고리</label>
                      <select
                        value={item.categoryId || ''}
                        onChange={(e) => handleCategorySelect(item.name, Number(e.target.value))}
                        className="w-full h-10 border rounded-[6px] px-3 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                      >
                        <option value="">카테고리 선택</option>
                        {BREAD_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">상품명</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleChange(item.name, 'name', e.target.value)}
                        className="w-full h-10 border rounded-[6px] px-3 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                        placeholder="상품명을 입력하세요"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">수량</label>
                        <input
                          type="number"
                          value={item.count}
                          onChange={(e) => handleChange(item.name, 'count', parseInt(e.target.value) || 0)}
                          className="w-full h-10 border rounded-[6px] px-3 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">가격</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleChange(item.name, 'price', parseInt(e.target.value) || 0)}
                          className="w-full h-10 border rounded-[6px] px-3 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleConfirm(item.name)}
                        className="flex-1 h-10 bg-[#FC973B] text-white rounded-[6px] hover:bg-[#e88934] transition-colors"
                      >
                        완료
                      </button>
                      <button
                        onClick={() => handleDelete(item.name)}
                        className="flex-1 h-10 border border-red-500 text-red-500 rounded-[6px] hover:bg-red-50 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        {item.categoryName && (
                          <span className="inline-block text-xs text-[#FC973B] bg-[#FFF5EC] px-2 py-0.5 rounded-full mb-2">
                            {item.categoryName}
                          </span>
                        )}
                        <h3 className="text-[16px] font-medium">{item.name}</h3>
                        <div className="mt-2 space-x-4 text-[14px] text-gray-600">
                          <span>{item.count}개</span>
                          <span>{item.price.toLocaleString()}원</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(item.name)}
                        className="px-4 h-8 border border-[#FC973B] text-[#FC973B] rounded-full text-sm hover:bg-[#FFF5EC] transition-colors"
                      >
                        수정
                      </button>
                    </div>
                  </div>
                )}
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
        </div>

        <div className="p-4 mb-8 sticky bottom-0 bg-white">
          <div className="text-center mb-4">
            <p className="text-[18px] text-[#FC973B] mb-1 font-bold">
              마지막으로 한 번만 더 확인해주세요!
            </p>
            <p className="text-[16px] text-gray-600">
              이후에는 수정이 불가능해요
            </p>
          </div>

          <button
            className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
            onClick={registerStock}
            disabled={items.length === 0}
          >
            빵꾸러미 만들러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagePreview; 