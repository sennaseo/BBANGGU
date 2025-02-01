import { IoArrowBack } from 'react-icons/io5';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

function CustomerSupport() {
  const handleBack = () => {
    window.history.back();
  };

  const handleKakaoChat = () => {
    // 카카오톡 채널 URL로 이동
    window.location.href = "https://kakao.com/channel/your-channel";  // 실제 카카오톡 채널 URL로 변경 필요
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="flex items-center h-14 px-4">
        <button onClick={handleBack} className="p-2">
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium ml-2">고객센터</h1>
      </div>

      {/* 카카오톡 상담 섹션 */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        {/* 카카오톡 아이콘 */}
        <div className="w-20 h-20 bg-[#000000] rounded-full flex items-center justify-center mb-6">
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

        {/* 안내 텍스트 */}
        <h2 className="text-xl font-medium mb-2">
          카카오톡 상담창으로 이동하시겠습니까?
        </h2>
        <p className="text-gray-500 text-center mb-8">
          전문 상담원이 친절하게 답변해드립니다 :)
        </p>

        {/* 카카오톡 상담하기 버튼 */}
        <button
          onClick={handleKakaoChat}
          className="w-full max-w-md h-14 bg-[#FFE500] rounded-lg flex items-center justify-center text-black font-medium"
        >
          카카오톡 상담하러 가기
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default CustomerSupport;