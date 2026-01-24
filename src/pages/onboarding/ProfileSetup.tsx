import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Calendar, MapPin, GraduationCap } from 'lucide-react';

type Step = 'name' | 'gender' | 'birthdate' | 'area' | 'school';

const areas = [
  '서울 강남', '서울 홍대', '서울 신촌', '서울 건대', '서울 성수',
  '서울 종로', '서울 여의도', '부산 서면', '부산 해운대', '대구 동성로',
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('name');
  const [profile, setProfile] = useState({
    name: '',
    gender: '' as 'male' | 'female' | '',
    birthdate: '',
    area: '',
    school: '',
    department: '',
  });

  const steps: Step[] = ['name', 'gender', 'birthdate', 'area', 'school'];
  const currentStepIndex = steps.indexOf(step);

  const goBack = () => {
    if (currentStepIndex === 0) {
      navigate('/onboarding');
    } else {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentStepIndex === steps.length - 1) {
      // 프로필 저장하고 메인 화면으로
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
      navigate('/discover');
    } else {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                이름을 알려주세요
              </h1>
              <p className="text-muted-foreground">
                실명으로 입력해주세요
              </p>
            </div>
            <Input
              placeholder="이름"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="h-14 text-lg rounded-xl"
            />
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!profile.name.trim()}
              onClick={goNext}
            >
              다음
            </Button>
          </div>
        );

      case 'gender':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                성별을 선택해주세요
              </h1>
              <p className="text-muted-foreground">
                매칭에 사용됩니다
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfile({ ...profile, gender: 'male' })}
                className={`h-32 rounded-2xl border-2 transition-all ${
                  profile.gender === 'male'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-4xl mb-2 block">👨</span>
                <span className="font-medium">남성</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfile({ ...profile, gender: 'female' })}
                className={`h-32 rounded-2xl border-2 transition-all ${
                  profile.gender === 'female'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-4xl mb-2 block">👩</span>
                <span className="font-medium">여성</span>
              </motion.button>
            </div>
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!profile.gender}
              onClick={goNext}
            >
              다음
            </Button>
          </div>
        );

      case 'birthdate':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                생년월일을 입력해주세요
              </h1>
              <p className="text-muted-foreground">
                만 18세 이상만 이용 가능합니다
              </p>
            </div>
            <Input
              type="date"
              value={profile.birthdate}
              onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
              className="h-14 text-lg rounded-xl"
            />
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!profile.birthdate}
              onClick={goNext}
            >
              다음
            </Button>
          </div>
        );

      case 'area':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                주로 활동하는 지역은?
              </h1>
              <p className="text-muted-foreground">
                미팅 장소 추천에 사용됩니다
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setProfile({ ...profile, area })}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    profile.area === area
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!profile.area}
              onClick={goNext}
            >
              다음
            </Button>
          </div>
        );

      case 'school':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                어느 학교에 다니세요?
              </h1>
              <p className="text-muted-foreground">
                같은 학교 학생들과 매칭됩니다
              </p>
            </div>
            <Input
              placeholder="대학교 이름"
              value={profile.school}
              onChange={(e) => setProfile({ ...profile, school: e.target.value })}
              className="h-14 text-lg rounded-xl"
            />
            <Input
              placeholder="학과"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="h-14 text-lg rounded-xl"
            />
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!profile.school.trim() || !profile.department.trim()}
              onClick={goNext}
            >
              완료
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={goBack}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full transition-colors ${
                i <= currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
