import { IoArrowBack } from 'react-icons/io5';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

function EditSettlement() {
  const handleBack = () => {
    // 뒤로가기 처리
    window.history.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 제출');
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-20">
      {/* 헤더 */}
      <div className="flex items-center h-14">
        <button onClick={handleBack} className="p-2">
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium ml-2">정산 정보</h1>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-gray-600 mt-4 mb-6">
        모든 항목이 입력되어야, 정산금이 이체됩니다.
      </p>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 가게 이름 */}
        <div className="space-y-2">
          <label className="block text-sm">가게 이름</label>
          <input
            type="text"
            placeholder="파리바게트 인동점"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 예금주명 */}
        <div className="space-y-2">
          <label className="block text-sm">예금주명</label>
          <input
            type="text"
            placeholder="중국인러마"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 사업자 계좌번호 */}
        <div className="space-y-2">
          <label className="block text-sm">사업자 계좌번호</label>
          <input
            type="text"
            placeholder="127-01-010112"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 세금계산서 발급용 이메일 */}
        <div className="space-y-2">
          <label className="block text-sm">세금계산서 발급용 이메일</label>
          <input
            type="email"
            placeholder="kky3652@naver.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 사업자등록증 사본 */}
        <div className="space-y-2">
          <label className="block text-sm">사업자등록증 사본</label>
          <div className="w-full h-[120px] border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            터치하여 업로드
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#FF9B50] text-white py-4 rounded-lg mt-8"
        >
          수정
        </button>
      </form>

      <BottomNavigation />
    </div>
  );
}

export default EditSettlement;