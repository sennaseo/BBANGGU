import { Link } from 'react-router-dom';
import qnaIcon from '@/assets/icons/qna-icon.svg';
import supportIcon from '@/assets/icons/support-icon.svg';

export function CustomerSupport() {
  return (
    <div className="mt-3 px-6">
      <h3 className="text-sm text-gray-600 mb-3">고객 지원 서비스</h3>
      <div className="flex justify-center gap-3">
        <Link 
          to="/owner/qna"
          className="flex flex-col items-center justify-center w-[190px] h-[180px] bg-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)]"
        >
          <img src={qnaIcon} alt="Q&A" className="w-14 h-14 mb-2" />
          <span className="text-gray-900">Q&A</span>
        </Link>
        <Link 
          to="/owner/chatbot"
          className="flex flex-col items-center justify-center w-[190px] h-[180px] bg-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)]"
        >
          <img src={supportIcon} alt="고객센터" className="w-14 h-14 mb-2" />
          <span className="text-gray-900">고객센터</span>
        </Link>
      </div>
    </div>
  );
}