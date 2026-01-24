import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function PhoneVerification() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setIsLoading(true);
    // Mock OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    // Mock OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/onboarding/profile');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button
          onClick={() => step === 'otp' ? setStep('phone') : navigate('/onboarding')}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 'phone' ? (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                전화번호를 입력해주세요
              </h1>
              <p className="text-muted-foreground mb-8">
                인증을 위해 SMS로 코드를 보내드릴게요
              </p>

              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 text-lg rounded-xl"
                />
                
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={phone.length < 10 || isLoading}
                  onClick={handleSendOtp}
                >
                  {isLoading ? '전송 중...' : '인증번호 받기'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                인증번호를 입력해주세요
              </h1>
              <p className="text-muted-foreground mb-8">
                {phone}로 전송된 6자리 코드를 입력해주세요
              </p>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-14 text-2xl text-center tracking-[0.5em] rounded-xl font-mono"
                  maxLength={6}
                />
                
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={otp.length < 6 || isLoading}
                  onClick={handleVerifyOtp}
                >
                  {isLoading ? '확인 중...' : '확인'}
                </Button>

                <button
                  onClick={handleSendOtp}
                  className="w-full text-center text-sm text-primary hover:underline"
                >
                  인증번호 재전송
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
