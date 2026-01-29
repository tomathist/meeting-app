import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';

const KAKAO_JS_KEY = '4b9fc07ba0cd8cd40c3df53fbb602a12';

export default function LoginChoice() {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      if (!user.phone) {
        // 핸드폰 미인증
        navigate('/onboarding/phone-verify');
      } else if (!user.name) {
        // 프로필 미완성
        navigate('/onboarding/profile');
      } else {
        // 완료
        navigate('/discover');
      }
    }
  }, [navigate]);

  const handleKakaoLogin = () => {
    const redirectUri = import.meta.env.PROD
      ? 'https://meeting-app-sepia.vercel.app/onboarding/callback'
      : 'http://localhost:5173/onboarding/callback';
    
    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_JS_KEY}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code`;
    
    window.location.href = kakaoAuthUrl;
  };

  const handleNaverLogin = () => {
    alert('네이버 로그인은 준비 중입니다');
  };

  const handlePhoneLogin = () => {
    navigate('/onboarding/phone');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-3xl gradient-hero shadow-elevated flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-4xl">💕</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3">미팅</h1>
          <p className="text-muted-foreground text-lg">새로운 인연을 만나보세요</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          <Button
            variant="social"
            size="xl"
            className="w-full justify-start gap-4"
            onClick={handleKakaoLogin}
          >
            <div className="w-8 h-8 rounded-lg bg-[#FEE500] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#3C1E1E]" />
            </div>
            카카오로 시작하기
          </Button>

          <Button
            variant="social"
            size="xl"
            className="w-full justify-start gap-4"
            onClick={handleNaverLogin}
          >
            <div className="w-8 h-8 rounded-lg bg-[#03C75A] flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            네이버로 시작하기
          </Button>

          <Button
            variant="social"
            size="xl"
            className="w-full justify-start gap-4"
            onClick={handlePhoneLogin}
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-foreground" />
            </div>
            전화번호로 시작하기
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 text-center"
      >
        <p className="text-xs text-muted-foreground">
          계속 진행하면 <span className="underline">이용약관</span> 및{' '}
          <span className="underline">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
        </p>
      </motion.div>
    </div>
  );
}
