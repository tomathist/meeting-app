import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function EmailVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('code');
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('success');
  };

  const handleComplete = () => {
    navigate('/discover');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {step !== 'success' && (
        <div className="flex items-center p-4">
          <button
            onClick={() => step === 'code' ? setStep('email') : navigate('/onboarding/profile')}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 px-6 pt-8 flex flex-col">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {step === 'email' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                학교 이메일을 입력해주세요
              </h1>
              <p className="text-muted-foreground mb-8">
                학교 이메일로 재학생 인증이 진행됩니다
              </p>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="example@university.ac.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-lg rounded-xl"
                />
                
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={!email.includes('@') || isLoading}
                  onClick={handleSendCode}
                >
                  {isLoading ? '전송 중...' : '인증 코드 받기'}
                </Button>
              </div>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                인증 코드를 입력해주세요
              </h1>
              <p className="text-muted-foreground mb-8">
                {email}로 전송된 6자리 코드를 입력해주세요
              </p>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-14 text-2xl text-center tracking-[0.5em] rounded-xl font-mono"
                  maxLength={6}
                />
                
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={code.length < 6 || isLoading}
                  onClick={handleVerifyCode}
                >
                  {isLoading ? '확인 중...' : '확인'}
                </Button>

                <button
                  onClick={handleSendCode}
                  className="w-full text-center text-sm text-primary hover:underline"
                >
                  인증 코드 재전송
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-6 shadow-elevated"
              >
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  인증 완료! 🎉
                </h1>
                <p className="text-muted-foreground mb-8">
                  이제 미팅을 시작할 준비가 되었어요
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-sm"
              >
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleComplete}
                >
                  시작하기
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
