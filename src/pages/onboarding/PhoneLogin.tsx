import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PhoneLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async () => {
    const phoneNumber = phone.replace(/-/g, '');
    if (phoneNumber.length !== 11) {
      alert('올바른 전화번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      // DB에서 전화번호로 유저 찾기
      let { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (!existingUser) {
        // 새 유저 생성
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

      // 로컬스토리지에 저장
      localStorage.setItem('user', JSON.stringify(existingUser));

      // 프로필 완성 여부 확인
      if (existingUser.name) {
        navigate('/discover');
      } else {
        navigate('/onboarding/profile');
      }
    } catch (e) {
      alert('로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button
          onClick={() => navigate('/onboarding')}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              전화번호를 입력해주세요
            </h1>
            <p className="text-muted-foreground">
              전화번호로 간편하게 시작하세요
            </p>
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
            onClick={handleSubmit}
          >
            {loading ? '로그인 중...' : '시작하기'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
