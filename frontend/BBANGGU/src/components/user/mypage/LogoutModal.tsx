interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* 모달 컨텐츠 */}
        <div className="relative bg-white rounded-2xl p-6 w-[80%] max-w-sm">
          <h2 className="text-center text-lg font-semibold text-[#333333] mb-4">
            로그아웃
          </h2>
          
          <p className="text-center text-[#666666] mb-6">
            정말 로그아웃 하시겠습니까?
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[#666666] bg-[#F5F5F5] font-medium"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl text-white bg-[#FC973B] font-medium"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }