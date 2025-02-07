import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import { useRecoilState } from 'recoil';
import { packageItemsState, BreadItem } from '../../../store/package';
import { CameraIcon } from '@heroicons/react/24/outline';
import { HiPencil } from 'react-icons/hi';

const PackagePreview: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useRecoilState(packageItemsState);

  // 초기 데이터가 없을 경우에만 설정
  useEffect(() => {
    if (items.length === 0) {
      setItems([
        { id: 1, name: '식빵', count: 1, price: 3500, status: 'confirmed' },
        { id: 2, name: '크로와상', count: 1, price: 3500, status: 'confirmed' },
        { id: 3, name: '케이크', count: 1, price: 3500, status: 'confirmed' },
      ]);
    }
  }, [items.length, setItems]);

  const handleEdit = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: 'editing' } : item
      )
    );
  };

  const handleConfirm = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: 'confirmed' } : item
      )
    );
  };

  const handleChange = (id: number, field: keyof BreadItem, value: string | number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddMore = () => {
    navigate('/owner/package/analysis'); // 추가 촬영
  };

  const handleManualAdd = () => {
    setItems(prevItems => [
      ...prevItems,
      { id: prevItems.length + 1, name: '', count: 1, price: 0, status: 'editing' }
    ]);
  };

  const handleDelete = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
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
            {items.map(item => (
              <div key={item.id}>
                <div className="grid grid-cols-12 items-center h-[52px]">
                  <div className="col-span-3 text-center text-[14px] text-gray-900 px-2">
                    {item.status === 'editing' ? (
                      <input
                        type="text"
                        value={item.name}
                        className="w-20 text-center border rounded-[6px] h-10 focus:outline-none focus:border-[#FC973B] focus:ring-1 focus:ring-[#FC973B]"
                        onChange={(e) => handleChange(item.id, 'name', e.target.value)}
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
                          onChange={(e) => handleChange(item.id, 'count', parseInt(e.target.value) || 0)}
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
                          onChange={(e) => handleChange(item.id, 'price', parseInt(e.target.value) || 0)}
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
                      onClick={() => item.status === 'confirmed' ? handleEdit(item.id) : handleConfirm(item.id)}
                    >
                      {item.status === 'confirmed' ? '수정' : '완료'}
                    </button>
                    {item.status === 'editing' && (
                      <button
                        className="w-[72px] h-10 rounded-[6px] text-[14px] border border-red-500 text-red-500"
                        onClick={() => handleDelete(item.id)}
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
              className="bg-[#FC973B] text-white py-3.5 rounded-[8px] flex items-center justify-center gap-2 text-[16px] font-medium"
            >
              <CameraIcon className="w-5 h-5" />
              추가 촬영
            </button>
            <button
              onClick={handleManualAdd}
              className="bg-white border border-[#FC973B] text-[#FC973B] py-3.5 rounded-[8px] flex items-center justify-center gap-2 text-[16px] font-medium"
            >
              <HiPencil className="w-5 h-5" />
              직접 추가
            </button>
          </div>

          {/* 경고 메시지 */}
        </div>

        <div className="p-4 mb-8 sticky bottom-0 bg-white">
          <div className="text-center mb-4">
            <p className="text-[14px] text-[#FC973B] mb-1">
              마지막으로 한 번만 더 확인해주세요!
            </p>
            <p className="text-[14px] text-gray-600">
              이후에는 수정이 어려울 수 있어요.
            </p>
          </div>

          <button
            className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
            onClick={() => navigate('/owner/package/loading')}
          >
            빵꾸러미 만들러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagePreview; 