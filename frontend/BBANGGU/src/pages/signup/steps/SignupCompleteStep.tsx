import { useNavigate } from "react-router-dom";
import { removeLocalStorage } from "../../../store/slices/authSlice";
import { logout } from "../../../store/slices/authSlice";
import { login } from "../../../api/common/login/login";
import { getUserInfo } from "../../../api/user/user";
import { setUserInfo } from "../../../store/slices/userSlice";
import { store } from "../../../store";
import { useDispatch } from "react-redux";

interface SignupCompleteStepProps {
  isOwner?: boolean;
  userName?: string;
  email?: string;
  password?: string;
}

export function SignupCompleteStep({ 
  isOwner = false, 
  userName = "",
  email = "",
  password = "",
}: SignupCompleteStepProps) {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {

      const accessToken = store.getState().auth.accessToken;
      console.log('accessToken', accessToken)
      dispatch(logout())
      dispatch(removeLocalStorage())

      // 1. 로그인 API 호출
      await login({email, password}, dispatch)

      // 4. 사용자 정보 가져오기
      const userResponse = await getUserInfo()
      console.log('4. 사용자 정보 응답:', userResponse)
      
      // 5. Redux store에 저장되는 데이터 확인
      console.log('5. Redux store에 저장될 데이터:', userResponse)
      dispatch(setUserInfo(userResponse))
      
      // 6. 최종 Redux 상태 확인
      const state = store.getState()
      console.log('6. 최종 Redux 상태:', state)

      // 사용자 역할에 따른 리다이렉션
      if (state.user.userInfo?.role === 'OWNER') {
        navigate('/owner/main')
      } else if (state.user.userInfo?.role === 'USER') {
        navigate('/user')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('로그인 에러:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('로그인 중 오류가 발생했습니다.')
      }
    } finally {
    }
  }


  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-5 min-h-[calc(100vh-132px)]">
      <div className="flex flex-col items-center">
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
          onClick={handleSubmit}
          className="w-full h-[52px] bg-[#FF9F43] text-white rounded-2xl text-lg font-medium"
        >
          {isOwner ? "메인화면 가기" : "빵꾸러미 둘러보기"}
        </button>
      </div>
    </div>
  );
}
