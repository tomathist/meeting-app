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
        
        // 유저 정보 저장
        localStorage.setItem('user', JSON.stringify(data));
        
        // 핸드폰 인증 여부 확인
        if (!data.phone) {
          // 핸드폰 미인증 → 핸드폰 인증으로
          navigate('/onboarding/phone-verify');
        } else if (!data.name) {
          // 프로필 미완성 → 프로필 설정으로
          navigate('/onboarding/profile');
        } else {
          // 완료된 유저 → 메인으로
          navigate('/discover');
        }
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
