import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLocalStorage } from '../../store/slices/authSlice';
import { setUserInfo } from '../../store/slices/userSlice';
import { getUserInfo } from '../../api/user/user';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const auth = searchParams.get('auth');
      const token = searchParams.get('token');

      if (auth === 'success' && token) {
        try {
          // 1. 토큰 정보를 리덕스에 저장
          dispatch(loginSuccess({
            data: {
              access_token: token,
              user_type: 'USER'
            }
          }));
          dispatch(setLocalStorage({
            accessToken: token,
            userType: 'USER',
            isAuthenticated: true
          }));

          // 2. getUserInfo를 사용하여 사용자 정보 조회 및 저장
          const userInfo = await getUserInfo();
          dispatch(setUserInfo(userInfo));

          // 3. 사용자 메인 페이지로 이동
          navigate('/user');
        } catch (error) {
          console.error('카카오 로그인 콜백 처리 실패:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleKakaoCallback();
  }, [dispatch, location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">카카오 로그인 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
} 