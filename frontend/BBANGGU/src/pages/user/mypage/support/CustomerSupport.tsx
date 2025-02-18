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
        <div className="w-20 h-20 bg-[#000000] rounded-full flex items-center justify-center mb-8">
              <svg 
                className="w-12 h-12" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path 
                  d="M12 3C6.48 3 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8z" 
                  fill="white"
                />
                <path 
                  d="M11 7h2v6h-2zm0 8h2v2h-2z" 
                  fill="white"
                />
              </svg>
            </div>
          <h2 className="text-lg font-bold mb-2">카카오톡 상담창으로 이동하시겠습니까?</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
          전문 상담원이 친절하게 답변해드립니다 :)
          </p>
          <button 
            className="w-full py-4 bg-[#FEE500] rounded-xl font-bold text-[#3C1E1E]"
            onClick={() => window.open('http://pf.kakao.com/_ffeTn', '_blank')}
          >
            카카오톡 상담하기
          </button>
        </div>
      </div>
    </div>
  );
}