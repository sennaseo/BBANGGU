import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function UserCustomerSupport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* 헤더 */}
      <div className="px-5 py-4 flex items-center border-b">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold mr-6">고객센터</h1>
      </div>

      {/* 카카오톡 상담 섹션 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-md flex flex-col items-center">
          <img 
            src="/src/assets/kakao-talk-fill.png" 
            alt="카카오톡 상담" 
            className="w-30 h-30 mb-4"
          />
          <h2 className="text-lg font-bold mb-2">카카오톡 상담창으로 이동하시겠습니까?</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
          전문 상담원이 친절하게 답변해드립니다 :)
          </p>
          <button 
            className="w-full py-4 bg-[#FEE500] rounded-xl font-bold text-[#3C1E1E]"
            onClick={() => window.open('https://pf.kakao.com/_xgxkExbxj', '_blank')}
          >
            카카오톡 상담하기
          </button>
        </div>
      </div>
    </div>
  );
}