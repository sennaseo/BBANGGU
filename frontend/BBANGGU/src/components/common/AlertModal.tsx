interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/25" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF4ED] mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#fc973b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#333333] mb-2">
            알림
          </h3>
          <p className="text-[#666666]">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#fc973b] text-white py-3 rounded-xl font-semibold hover:bg-[#e88a2d] transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
} 