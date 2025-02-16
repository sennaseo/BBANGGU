import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleKakaoCallback } from '../../api/common/login/KakaoLogin';
import { loginSuccess } from '../../store/slices/authSlice';
import { setUserInfo } from '../../store/slices/userSlice';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const processKakaoLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        navigate('/login');
        return;
      }

      try {
        const response = await handleKakaoCallback(code);
        
        // Authorization 헤더에서 토큰 추출
        const accessToken = response.headers['authorization']?.toString().replace('Bearer ', '');
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          dispatch(loginSuccess({ 
            data: { 
              access_token: accessToken,
              refresh_token: '', // 쿠키에 저장되므로 생략
              user_type: response.data.user.role 
            } 
          }));
        }

        dispatch(setUserInfo(response.data.user));
        navigate('/user');
      } catch (error) {
        console.error('카카오 로그인 처리 실패:', error);
        alert('로그인에 실패했습니다.');
        navigate('/login');
      }
    };

    processKakaoLogin();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fc973b]"></div>
        <p className="text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
} 