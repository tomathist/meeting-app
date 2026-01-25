import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Step = 'phone' | 'verify';

export default function PhoneLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSendCode = async () => {
    const phoneNumber = phone.replace(/-/g, '');
    if (phoneNumber.length !== 11) {
      alert('올바른 전화번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setStep('verify');
    } catch (e) {
      alert('SMS 발송 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      alert('6자리 코드를 입력해주세요');
      return;
    }

    setLoading(true);
    const phoneNumber = phone.replace(/-/g, '');

    try {
      // Twilio 인증 확인
      const verifyRes = await fetch('/api/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, code: enteredCode })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.error) {
        alert(verifyData.error);
        return;
      }

      // DB에서 유저 찾기 또는 생성
      let { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (!existingUser) {
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({ phone: phoneNumber })
          .select()
          .single();

        if (error) {
          alert('가입 실패: ' + error.message);
          return;
        }
        existingUser = newUser;
      }

      localStorage.setItem('user', JSON.stringify(existingUser));

      if (existingUser.name) {
        navigate('/discover');
      } else {
        navigate('/onboarding/profile');
      }
    } catch (e) {
      alert('인증 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCode(['', '', '', '', '', '']);
    handleSendCode();
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('phone');
      setCode(['', '', '', '', '', '']);
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-8">
        {step === 'phone' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">전화번호를 입력해주세요</h1>
              <p className="text-muted-foreground">인증을 위해 SMS로 코드를 보내드릴게요</p>
            </div>

            <Input
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={handlePhoneChange}
              className="h-14 text-lg rounded-xl"
              maxLength={13}
            />

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={phone.replace(/-/g, '').length !== 11 || loading}
              onClick={handleSendCode}
            >
              {loading ? '전송 중...' : '인증번호 받기'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">인증번호를 입력해주세요</h1>
              <p className="text-muted-foreground">{phone.replace(/-/g, '')}로 전송된 6자리 코드를 입력해주세요</p>
            </div>

            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              ))}
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={code.join('').length !== 6 || loading}
              onClick={handleVerify}
            >
              {loading ? '확인 중...' : '확인'}
            </Button>

            <button onClick={handleResend} className="w-full text-center text-primary text-sm">
              인증번호 재전송
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
