import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, UserPlus, MapPin, Users, Check } from 'lucide-react';
import { RoomSize } from '@/types';

type Step = 'invite' | 'details' | 'review';

const areas = [
  '서울 강남', '서울 홍대', '서울 신촌', '서울 건대', '서울 성수',
  '서울 종로', '서울 여의도', '부산 서면', '부산 해운대', '대구 동성로',
];

const sizes: { value: RoomSize; label: string; emoji: string }[] = [
  { value: '2:2', label: '2대2', emoji: '👫' },
  { value: '3:3', label: '3대3', emoji: '👥' },
  { value: '4:4', label: '4대4', emoji: '🧑‍🤝‍🧑' },
];

export default function CreateRoom() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('invite');
  const [invites, setInvites] = useState<string[]>(['']);
  const [area, setArea] = useState('');
  const [size, setSize] = useState<RoomSize>('2:2');

  const steps: Step[] = ['invite', 'details', 'review'];
  const currentStepIndex = steps.indexOf(step);

  const goBack = () => {
    if (currentStepIndex === 0) {
      navigate('/rooms');
    } else {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentStepIndex === steps.length - 1) {
      // Create room and navigate
      navigate('/rooms');
    } else {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const addInvite = () => {
    if (invites.length < 3) {
      setInvites([...invites, '']);
    }
  };

  const updateInvite = (index: number, value: string) => {
    const newInvites = [...invites];
    newInvites[index] = value;
    setInvites(newInvites);
  };

  const validInvites = invites.filter(i => i.trim().length > 0);

  const renderStep = () => {
    switch (step) {
      case 'invite':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                친구를 초대하세요
              </h1>
              <p className="text-muted-foreground">
                함께 미팅할 친구를 초대해주세요
              </p>
            </div>

            <div className="space-y-3">
              {invites.map((invite, index) => (
                <Input
                  key={index}
                  placeholder="전화번호 또는 이름"
                  value={invite}
                  onChange={(e) => updateInvite(index, e.target.value)}
                  className="h-14 text-lg rounded-xl"
                />
              ))}
              
              {invites.length < 3 && (
                <button
                  onClick={addInvite}
                  className="w-full h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + 친구 추가
                </button>
              )}
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={validInvites.length === 0}
              onClick={goNext}
            >
              다음
            </Button>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                미팅 설정
              </h1>
              <p className="text-muted-foreground">
                원하는 지역과 인원을 선택하세요
              </p>
            </div>

            {/* Area selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                지역
              </label>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      area === a
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                인원
              </label>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`h-24 rounded-xl border-2 transition-all ${
                      size === s.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{s.emoji}</span>
                    <span className="font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!area}
              onClick={goNext}
            >
              다음
            </Button>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                방 만들기
              </h1>
              <p className="text-muted-foreground">
                설정을 확인하고 방을 만드세요
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">초대</p>
                  <p className="font-medium text-foreground">
                    {validInvites.join(', ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">지역</p>
                  <p className="font-medium text-foreground">{area}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">인원</p>
                  <p className="font-medium text-foreground">{size}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-secondary/50 rounded-xl p-4">
              💡 친구가 초대를 수락하면 방이 활성화되고 추천 미팅을 받을 수 있어요
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={goNext}
            >
              방 만들기
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
          {steps.map((s, i) => (
            <div
              key={s}
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
