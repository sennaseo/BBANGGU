import { useState } from "react";

interface CancelReservationModalProps {
  onClose: () => void;
  onSubmit: (cancelReason: string) => void;
}

export default function CancelReservationModal({
  onClose,
  onSubmit,
}: CancelReservationModalProps) {
  const [cancelReason, setCancelReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl mx-5 w-full max-w-[320px] p-6">
        <h3 className="text-lg font-bold text-[#333333] mb-2 text-center">
          예약 취소
        </h3>
        <p className="text-sm text-[#666666] mb-4 text-center">
          예약 취소 사유를 입력해 주세요.
        </p>
        <input
          type="text"
          placeholder="취소 사유 (예: 단순변심)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#fc973b]"
        />
        <div className="flex">
          <button
            className="flex-1 p-3 mr-2 bg-[#F2F2F2] text-[#666666] rounded-full"
            onClick={onClose}
          >
            돌아가기
          </button>
          <button
            className="flex-1 p-3 bg-[#fc973b] text-white rounded-full"
            onClick={() => onSubmit(cancelReason)}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
} 