import { useNavigate } from "react-router-dom";

interface SignupCompleteStepProps {
  isOwner?: boolean;
  userName?: string;
}

export function SignupCompleteStep({ 
  isOwner = false, 
  userName = "" 
}: SignupCompleteStepProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-5">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%95%88%EB%87%BD%201-RoGhwjxqrnjWs2Y8IQJifa3C4wDkiI.png"
        alt="Welcome"
        className="w-[120px] mb-6"
      />
      <h1 className="text-[22px] font-bold mb-2">
        환영합니다 {isOwner ? "사장님" : `${userName}님`}!
      </h1>
      <p className="text-[15px] text-gray-600 mb-8">가입이 완료되었어요 🙌</p>
      <button
        onClick={() => navigate(isOwner ? "/main" : "/user")}
        className="w-full h-[52px] bg-[#FF9F43] text-white rounded-2xl text-lg font-medium"
      >
        {isOwner ? "메인화면 가기" : "빵꾸러미 둘러보기"}
      </button>
    </div>
  );
}
