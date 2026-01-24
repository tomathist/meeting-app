import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function BioSetup() {
  const navigate = useNavigate();
  const [bio, setBio] = useState('');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/onboarding/picture')}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className={`w-6 h-1 rounded-full transition-colors ${
                i <= 8 ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              간단한 자기소개를 해주세요
            </h1>
            <p className="text-muted-foreground">
              선택사항이에요. 상대방에게 보여지는 정보예요
            </p>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="예: 음악과 맛집 탐방을 좋아해요 🎵🍽️ 친구들이랑 놀기 좋아하고, 대화하는 거 좋아해요!"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[150px] text-lg rounded-xl resize-none"
              maxLength={100}
            />
            <p className="text-sm text-muted-foreground text-right">
              {bio.length}/100
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> 취미, 관심사, 성격 등을 자유롭게 적어보세요!
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={() => navigate('/onboarding/email')}
            >
              {bio.trim() ? '다음' : '건너뛰기'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
