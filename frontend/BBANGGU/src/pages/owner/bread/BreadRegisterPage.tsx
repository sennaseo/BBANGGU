import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import { 
  Croissant, Cookie, CakeSlice,
  Pizza, Sandwich, IceCream2, Cake,
  Coffee, ChefHat, UtensilsCrossed, Store,
  ShoppingBag, Package, CircleDot, Star
} from 'lucide-react';
import { registerBread, getBakeryBreads, BreadInfo, updateBread, deleteBread } from '../../../api/owner/bread';

interface BreadCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  weight: number;
}

interface BreadItem {
  id: string;
  categoryId: number;
  categoryName: string;
  name: string;
  price: number;
  image?: string;
}

const BREAD_CATEGORIES: BreadCategory[] = [
  { 
    id: 1, 
    name: '바게트',
    icon: <UtensilsCrossed className="w-8 h-8" />,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    weight: 250
  },
  { 
    id: 2, 
    name: '크로와상',
    icon: <Croissant className="w-8 h-8" />,
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    weight: 100
  },
  { 
    id: 3, 
    name: '베이글',
    icon: <CircleDot className="w-8 h-8" />,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    weight: 500
  },
  { 
    id: 4, 
    name: '단팥빵',
    icon: <Cookie className="w-8 h-8" />,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    weight: 0
  },
  { 
    id: 5, 
    name: '식빵',
    icon: <Package className="w-8 h-8" />,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    weight: 0
  },
  { 
    id: 6, 
    name: '소보로',
    icon: <Star className="w-8 h-8" />,
    bgColor: 'bg-lime-50',
    iconColor: 'text-lime-600',
    weight: 0
  },
  { 
    id: 7, 
    name: '슈크림빵',
    icon: <IceCream2 className="w-8 h-8" />,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    weight: 0
  },
  { 
    id: 8, 
    name: '버터번',
    icon: <ShoppingBag className="w-8 h-8" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    weight: 0
  },
  { 
    id: 9, 
    name: '휘낭시에',
    icon: <CakeSlice className="w-8 h-8" />,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    weight: 0
  },
  { 
    id: 10, 
    name: '초코롤',
    icon: <Coffee className="w-8 h-8" />,
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    weight: 0
  },
  { 
    id: 11, 
    name: '패스츄리',
    icon: <ChefHat className="w-8 h-8" />,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
    weight: 0
  },
  { 
    id: 12, 
    name: '케이크',
    icon: <Cake className="w-8 h-8" />,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    weight: 0
  },
  { 
    id: 13, 
    name: '프레첼',
    icon: <Store className="w-8 h-8" />,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    weight: 0
  },
  { 
    id: 14, 
    name: '스콘',
    icon: <Cookie className="w-8 h-8" />,
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    weight: 0
  },
  { 
    id: 15, 
    name: '샌드위치',
    icon: <Sandwich className="w-8 h-8" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    weight: 0
  },
  { 
    id: 16, 
    name: '타르트',
    icon: <Pizza className="w-8 h-8" />,
    bgColor: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
    weight: 0
  },
];

// getFullImageUrl 함수에서 직접 환경변수 사용
const getFullImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  
  const path = imageUrl.startsWith('/') ? imageUrl : `/uploads/${imageUrl}`;
  
  if (import.meta.env.DEV) {
    return path;
  }
  
  return `https://i12d102.p.ssafy.io${path}`;
};

// 에러 타입 정의
interface FormError extends Error {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
}

// 이미 등록된 빵의 카테고리 ID 목록을 추출하는 함수
const getUsedCategoryIds = (breads: BreadInfo[]) => {
  return new Set(breads.map(bread => bread.breadCategoryId));
};

export default function BreadRegisterPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [breadName, setBreadName] = useState('');
  const [price, setPrice] = useState('');
  const [breadList, setBreadList] = useState<BreadItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingBreads, setExistingBreads] = useState<BreadInfo[]>([]);
  const [editingBread, setEditingBread] = useState<BreadInfo | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // 드롭다운 메뉴 ref 추가
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지를 위한 useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddBread = () => {
    if (!selectedCategory || !breadName || !price) return;

    const category = BREAD_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return;

    const newBread: BreadItem = {
      id: Date.now().toString(),
      categoryId: selectedCategory,
      categoryName: category.name,
      name: breadName,
      price: Number(price),
      image: previewUrl || undefined
    };

    setBreadList([...breadList, newBread]);
    // 입력 폼 초기화
    setBreadName('');
    setPrice('');
    setSelectedCategory(null);
    setPreviewUrl(null);
  };

  const handleDelete = (id: string) => {
    setBreadList(breadList.filter(bread => bread.id !== id));
  };

  const handleSave = async () => {
    if (breadList.length === 0) return;
    
    setIsLoading(true);
    try {
      for (const bread of breadList) {
        const breadData = {
          bakeryId: 1,  // 실제 존재하는 bakeryId로 변경 필요
          breadCategoryId: bread.categoryId,
          name: bread.name,
          price: bread.price
        };

        let imageFile: File | undefined;
        if (bread.image && bread.image.startsWith('blob:')) {
          const response = await fetch(bread.image);
          const blob = await response.blob();
          imageFile = new File([blob], `bread-${bread.id}.jpg`, { type: 'image/jpeg' });
        }

        const result = await registerBread(breadData, imageFile);
        console.log('빵 등록 성공:', result);
      }

      alert('빵 등록이 완료되었습니다.');
      navigate(-1);
    } catch (error: unknown) {
      const err = error as FormError;
      console.error(err.response);
      alert(err.response?.data.message || '빵 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 기존 빵 목록 조회
  useEffect(() => {
    const fetchExistingBreads = async () => {
      try {
        console.log('빵 목록 조회 시작');  // 디버깅용 로그
        const breadsData = await getBakeryBreads(1);
        console.log('받아온 빵 목록:', breadsData);  // 디버깅용 로그
        setExistingBreads(breadsData);
      } catch (error) {
        console.error('기존 빵 목록 조회 실패:', error);
        setExistingBreads([]);
      }
    };

    fetchExistingBreads();
  }, []);

  // 수정 버튼 클릭 핸들러
  const handleEdit = (bread: BreadInfo) => {
    setEditingBread(bread);
    // 폼 필드 초기화
    setSelectedCategory(bread.breadCategoryId);
    setBreadName(bread.name);
    setPrice(bread.price.toString());
    setPreviewUrl(bread.breadImageUrl);
    // 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 수정 취소 핸들러
  const handleCancelEdit = () => {
    setEditingBread(null);
    // 폼 초기화
    setBreadName('');
    setPrice('');
    setSelectedCategory(null);
    setPreviewUrl(null);
  };

  // 추가/수정 버튼 텍스트
  const getButtonText = () => {
    if (isLoading) return "저장 중...";
    if (editingBread) return "수정하기";
    return "추가하기";
  };

  // 추가/수정 버튼 핸들러
  const handleAddOrUpdate = async () => {
    if (!selectedCategory || !breadName || !price) return;

    if (editingBread) {
      // 수정 로직
      try {
        const breadData = {
          bakeryId: 1,
          breadCategoryId: selectedCategory,
          name: breadName,
          price: Number(price),
          breadImageUrl: editingBread.breadImageUrl
        };

        let imageFile: File | undefined;
        if (previewUrl && previewUrl.startsWith('blob:')) {
          const response = await fetch(previewUrl);
          const blob = await response.blob();
          imageFile = new File([blob], `bread-${editingBread.breadId}.jpg`, { type: 'image/jpeg' });
        }

        await updateBread(editingBread.breadId, breadData, imageFile);
        
        // 목록 새로고침
        const updatedBreads = await getBakeryBreads(1);
        setExistingBreads(updatedBreads);  // 그대로 설정
        
        // 폼 초기화
        handleCancelEdit();
        alert('빵 정보가 수정되었습니다.');
      } catch (error: unknown) {
        const err = error as FormError;
        alert(err.response?.data.message || '빵 수정 중 오류가 발생했습니다.');
      }
    } else {
      // 기존 추가 로직
      handleAddBread();
    }
  };

  // 빵 삭제 핸들러
  const handleDeleteBread = async (breadId: number) => {
    if (!window.confirm('정말 이 빵을 삭제하시겠습니까?')) return;

    try {
      setIsLoading(true); // 로딩 상태 추가
      const result = await deleteBread(breadId);
      console.log('삭제 응답:', result); // 응답 확인용 로그

      if (result.message === "빵 정보 삭제 성공") {
        // 성공적으로 삭제된 경우 목록에서 제거
        setExistingBreads(prev => prev.filter(bread => bread.breadId !== breadId));
        alert('빵이 삭제되었습니다.');
      }
    } catch (error: unknown) {
      const err = error as FormError;
      console.error('삭제 실패:', err);
      alert(err.response?.data.message || '빵 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 선택 핸들러 수정
  const handleCategorySelect = (categoryId: number) => {
    const usedCategories = getUsedCategoryIds(existingBreads);
    
    // 이미 해당 카테고리의 빵이 등록되어 있다면 알림
    if (usedCategories.has(categoryId)) {
      alert('이미 해당 카테고리의 빵이 등록되어 있습니다.');
      return;
    }
    
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <Header 
          title="빵 등록" 
          onBack={() => editingBread ? handleCancelEdit() : navigate(-1)}
          rightButton={{
            text: isLoading ? "저장 중..." : "저장",
            onClick: handleSave,
            disabled: isLoading || (!editingBread && breadList.length === 0)
          }}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="pt-14 pb-20 px-4">
        {/* 설명 섹션 */}
        <div className="mb-8 bg-[#FFF9F5] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#333333] mb-3">
            빵 메뉴 등록하기
          </h2>
          <div className="space-y-2 text-[#666666]">
            <p className="flex items-start gap-2">
              <span className="text-[#FC973B] font-medium">1.</span>
              <span>우리 가게의 빵 카테고리를 선택해주세요</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#FC973B] font-medium">2.</span>
              <span>빵 이름과 가격을 입력해주세요</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#FC973B] font-medium">3.</span>
              <span>등록된 빵은 AI 카메라에서 자동으로 인식됩니다</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#FC973B] font-medium">4.</span>
              <span>빵 카테고리 1개당 1개의 상품만 등록할 수 있어요</span>
            </p>
          </div>
        </div>

        {/* 입력 폼 영역 */}
        <div className="space-y-4">
          {/* 카테고리 선택 */}
          <label className="block text-sm font-medium text-gray-700">
            카테고리
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[240px] overflow-y-auto rounded-lg border border-gray-200 p-2">
            {BREAD_CATEGORIES.map((category) => {
              const isUsed = getUsedCategoryIds(existingBreads).has(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={isUsed}
                  className={`h-[72px] p-4 rounded-lg transition-colors text-center
                    ${selectedCategory === category.id 
                      ? 'bg-[#FC973B] text-white font-medium border-2 border-[#FC973B]' 
                      : isUsed 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'bg-white hover:border-[#FC973B] hover:text-[#FC973B] border border-gray-200'
                    }
                  `}
                >
                  <span className="block text-sm">
                    {category.name}
                    {isUsed && <span className="block text-xs mt-1">(등록됨)</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 선택된 카테고리 표시 */}
          {selectedCategory && (
            <div className="mt-2">
              <span className="inline-block px-3 py-1.5 bg-[#FFF5EC] text-[#FC973B] rounded-lg font-medium">
                {BREAD_CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </span>
            </div>
          )}

          {/* 빵 정보 입력 */}
          <div className="space-y-4">  {/* 간격 조정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                빵 이름
              </label>
              <input
                type="text"
                value={breadName}
                onChange={(e) => setBreadName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
                placeholder="예) 바삭바삭 바게트"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPrice(value);
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
                placeholder="예) 3000"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            {/* 빵 사진 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                빵 사진 (선택)
              </label>
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[4px] cursor-pointer
                ${previewUrl ? 'border-[#FC973B] bg-[#FFF9F5]' : 'border-gray-300 active:border-[#FC973B] active:bg-[#FFF9F5]'}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="미리보기"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <PlusIcon className="w-6 h-6 text-gray-400" />
                    <p className="text-sm text-gray-500">사진 추가</p>
                  </div>
                )}
              </label>
            </div>

            {/* 추가/수정 버튼을 여기에 배치 */}
            <div className="flex gap-2">
              <button
                onClick={handleAddOrUpdate}
                disabled={!selectedCategory || !breadName || !price || isLoading}
                className={`flex-1 py-3.5 text-white rounded-[4px] hover:bg-[#e88934] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#FC973B]`}
              >
                {editingBread ? (
                  <PencilIcon className="w-5 h-5" />
                ) : (
                  <PlusIcon className="w-5 h-5" />
                )}
                {getButtonText()}
              </button>

              {/* 수정 중일 때만 취소 버튼 표시 */}
              {editingBread && (
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3.5 text-gray-600 bg-gray-100 rounded-[4px] hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 추가한 빵 목록 */}
        {breadList.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">추가된 빵 목록</h3>
            <div className="space-y-3">
              {breadList.map((bread) => (
                <div
                  key={bread.id}
                  className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    {bread.image && (
                      <img 
                        src={bread.image}
                        alt={bread.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <span className="text-sm text-[#FC973B] bg-[#FFF5EC] px-2 py-1 rounded-full">
                        {bread.categoryName}
                      </span>
                      <p className="font-medium mt-2">{bread.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {bread.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(bread.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 현재 등록된 빵 목록 */}
        {existingBreads && existingBreads.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-bold text-[#333333] mb-4">
              현재 등록된 빵 목록
            </h3>
            <div className="space-y-3">
              {existingBreads.map((bread) => (
                <div key={bread.breadId} className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center gap-4">
                    {/* 이미지 */}
                    <div className="w-16 h-16 flex-shrink-0">
                      {bread.breadImageUrl ? (
                        <img 
                          src={getFullImageUrl(bread.breadImageUrl)} 
                          alt={bread.name} 
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '🥖'; // 다시 이모지로 변경
                          }}
                          data-bread-id={bread.breadId}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FFF5EC] rounded flex items-center justify-center text-2xl">
                          🥖
                        </div>
                      )}
                    </div>

                    {/* 빵 정보 */}
                    <div className="flex-1">
                      <h4 className="font-medium">{bread.name}</h4>
                      <p className="text-gray-600">{bread.price.toLocaleString()}원</p>
                    </div>

                    {/* 더보기 메뉴 */}
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === bread.breadId ? null : bread.breadId)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>

                      {/* 드롭다운 메뉴 - UI 개선 */}
                      {openMenuId === bread.breadId && (
                        <div className="absolute right-0 top-10 w-36 bg-white border rounded-xl shadow-lg py-1 z-10 overflow-hidden animate-fade-in">
                          <button
                            onClick={() => {
                              handleEdit(bread);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-[#FFF5EC] hover:text-[#FC973B] transition-colors flex items-center gap-2"
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span>수정하기</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteBread(bread.breadId);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-2"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>삭제하기</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 