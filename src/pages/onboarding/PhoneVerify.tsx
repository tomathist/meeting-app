import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Step = 'phone' | 'verify' | 'link';

export default function PhoneVerify() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [existingUser, setExistingUser] = useState<any>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

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
      setCountdown(60);
      setResendCountdown(60);
    } catch (e) {
      alert('SMS 발송 실패');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setCode(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      if (digits.length === 6) {
        setCode(digits.split(''));
        inputRefs.current[5]?.focus();
        return;
      }
      value = value.slice(-1);
    }
    
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
    if (countdown === 0) {
      alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      return;
    }

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

      // DB에서 이 전화번호로 가입된 유저가 있는지 확인
      const { data: phoneUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (phoneUser && phoneUser.id !== currentUser.id) {
        // 이미 다른 계정으로 가입된 번호
        setExistingUser(phoneUser);
        setStep('link');
      } else {
        // 새 번호 - 현재 계정에 연결
        await linkPhoneToCurrentUser(phoneNumber);
      }
    } catch (e) {
      alert('인증 실패');
    } finally {
      setLoading(false);
    }
  };

  const linkPhoneToCurrentUser = async (phoneNumber: string) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const { data, error } = await supabase
      .from('users')
      .update({ phone: phoneNumber })
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error) {
      alert('저장 실패: ' + error.message);
      return;
    }

    localStorage.setItem('user', JSON.stringify(data));
    
    if (data.name) {
      navigate('/discover');
    } else {
      navigate('/onboarding/profile');
    }
  };

  const handleLinkAccount = async () => {
    // 기존 계정에 카카오 정보 연동
    setLoading(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      // 기존 유저에 카카오 정보 추가
      const { data, error } = await supabase
        .from('users')
        .update({
          kakao_id: currentUser.kakao_id,
          nickname: existingUser.nickname || currentUser.nickname,
          profile_image: existingUser.profile_image || currentUser.profile_image,
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) {
        alert('연동 실패: ' + error.message);
        return;
      }

      // 현재 카카오로 만든 임시 계정 삭제
      await supabase
        .from('users')
        .delete()
        .eq('id', currentUser.id);

      // 기존 계정으로 로그인
      localStorage.setItem('user', JSON.stringify(data));

      if (data.name) {
        navigate('/discover');
      } else {
        navigate('/onboarding/profile');
      }
    } catch (e) {
      alert('연동 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewAccount = async () => {
    // 새 계정으로 진행 (다른 번호로 인증)
    setStep('phone');
    setPhone('');
    setCode(['', '', '', '', '', '']);
    setExistingUser(null);
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setCode(['', '', '', '', '', '']);
    handleSendCode();
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('phone');
      setCode(['', '', '', '', '', '']);
      setCountdown(0);
    } else if (step === 'link') {
      setStep('verify');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('appliedRooms');
      navigate('/onboarding');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-8">
        {step === 'phone' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">전화번호 인증</h1>
              <p className="text-muted-foreground">본인 확인을 위해 전화번호를 인증해주세요</p>
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
        )}

        {step === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">인증번호를 입력해주세요</h1>
              <p className="text-muted-foreground">
                {phone}로 전송된 6자리 코드를 입력해주세요
              </p>
              {countdown > 0 && (
                <p className="text-primary font-medium mt-2">
                  남은 시간: {formatTime(countdown)}
                </p>
              )}
              {countdown === 0 && (
                <p className="text-red-500 font-medium mt-2">
                  인증 시간이 만료되었습니다
                </p>
              )}
            </div>

            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={6}
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
              disabled={code.join('').length !== 6 || loading || countdown === 0}
              onClick={handleVerify}
            >
              {loading ? '확인 중...' : '확인'}
            </Button>

            <button
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className={`w-full text-center text-sm ${
                resendCountdown > 0 ? 'text-muted-foreground' : 'text-primary'
              }`}
            >
              {resendCountdown > 0
                ? `인증번호 재전송 (${formatTime(resendCountdown)})`
                : '인증번호 재전송'}
            </button>
          </motion.div>
        )}

        {step === 'link' && existingUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2">이미 가입된 번호입니다</h1>
              <p className="text-muted-foreground">
                이 전화번호로 가입된 계정이 있습니다.
                기존 계정과 연동하시겠습니까?
              </p>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  {existingUser.name?.charAt(0) || existingUser.nickname?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium">{existingUser.name || existingUser.nickname || '이름 미설정'}</p>
                  <p className="text-sm text-muted-foreground">{phone}</p>
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={loading}
              onClick={handleLinkAccount}
            >
              {loading ? '연동 중...' : '기존 계정과 연동하기'}
            </Button>

            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={handleCreateNewAccount}
            >
              다른 번호로 가입하기
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
