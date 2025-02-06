import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';

interface BreadItem {
  id: number;
  name: string;
  count: number;
  price: number;
  status: 'confirmed' | 'editing' | 'pending';
}

const PackagePreview: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BreadItem[]>([
    { id: 1, name: '식빵', count: 1, price: 3500, status: 'confirmed' },
    { id: 2, name: '크로와상', count: 1, price: 3500, status: 'editing' },
    { id: 3, name: '케이크', count: 1, price: 3500, status: 'confirmed' },
  ]);

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

  const handleAddMore = () => {
    navigate('/owner/package/analysis'); // 추가 촬영
  };

  const handleManualAdd = () => {
    setItems(prevItems => [
      ...prevItems,
      { id: prevItems.length + 1, name: '', count: 1, price: 0, status: 'editing' }
    ]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="재고 확인" 
        onBack={() => navigate(-1)}
      />
      
      <ProgressBar 
        currentStep={PACKAGE_STEPS.PREVIEW} 
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      <div className="p-4">
        <p className="text-center text-gray-600 mb-4">
          빵구 AI가 자동으로 빵의 재고와 가격을 파악합니다!
        </p>

        <div className="mb-4">
          <div className="grid grid-cols-4 text-sm text-gray-600 pb-2">
            <div>상품명</div>
            <div className="text-center">수량</div>
            <div className="text-center">가격</div>
            <div className="text-center">관리</div>
          </div>

          {items.map(item => (
            <div key={item.id} className="grid grid-cols-4 items-center py-2 border-b">
              <div>{item.name}</div>
              <div className="text-center">{item.count}</div>
              <div className="text-center">{item.price.toLocaleString()}</div>
              <div className="text-center">
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    item.status === 'confirmed' 
                      ? 'bg-gray-100 text-gray-600' 
                      : 'bg-[#FC973B] text-white'
                  }`}
                  onClick={() => item.status === 'confirmed' ? handleEdit(item.id) : handleConfirm(item.id)}
                >
                  {item.status === 'confirmed' ? '수정' : '완료'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAddMore}
            className="bg-[#FC973B] text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <span>📸</span> 추가 촬영
          </button>
          <button
            onClick={handleManualAdd}
            className="bg-white border border-[#FC973B] text-[#FC973B] py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <span>✏️</span> 직접 추가
          </button>
        </div>

        <button
          className="w-full bg-[#FC973B] text-white py-4 rounded-lg mt-4"
          onClick={() => navigate('/owner/package/details')}
        >
          빵꾸러미 만들러 가기
        </button>
      </div>
    </div>
  );
};

export default PackagePreview; 