import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      setError('인증 코드가 없습니다');
      return;
    }

    // 서버로 code 보내서 로그인 처리
    fetch('/api/auth/kakao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        // 로그인 성공 - 유저 정보 저장
        localStorage.setItem('user', JSON.stringify(data));
        // 프로필 설정으로 이동
        navigate('/onboarding/profile');
      })
      .catch((err) => {
        setError('로그인 실패: ' + err.message);
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-primary underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">로그인 중...</p>
      </div>
    </div>
  );
}