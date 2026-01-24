import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { currentUser } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Camera, 
  Save,
  User,
  GraduationCap,
  MapPin,
  Phone
} from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: currentUser.name,
    school: currentUser.school,
    department: currentUser.department || '',
    area: currentUser.area,
    bio: currentUser.bio || '',
    phoneNumber: currentUser.phoneNumber,
  });

  const handleSave = () => {
    console.log('Saving user settings:', user);
    navigate('/profile');
  };

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">계정 설정</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {currentUser.name.slice(0, 1)}
                  </AvatarFallback>
                )}
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Name */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <User className="w-4 h-4" />
                이름
              </label>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* School */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <GraduationCap className="w-4 h-4" />
                학교
              </label>
              <Input
                value={user.school}
                onChange={(e) => setUser({ ...user, school: e.target.value })}
                placeholder="학교를 입력하세요"
              />
            </div>

            {/* Department */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <GraduationCap className="w-4 h-4" />
                학과
              </label>
              <Input
                value={user.department}
                onChange={(e) => setUser({ ...user, department: e.target.value })}
                placeholder="학과를 입력하세요"
              />
            </div>

            {/* Area */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                지역
              </label>
              <Input
                value={user.area}
                onChange={(e) => setUser({ ...user, area: e.target.value })}
                placeholder="주로 활동하는 지역"
              />
            </div>

            {/* Phone */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Phone className="w-4 h-4" />
                전화번호
              </label>
              <Input
                value={user.phoneNumber}
                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                placeholder="전화번호"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                전화번호는 변경할 수 없습니다
              </p>
            </div>

            {/* Bio */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                자기소개
              </label>
              <Textarea
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="간단한 자기소개를 작성해주세요"
                className="min-h-[100px] resize-none"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {user.bio.length}/100
              </p>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleSave}
              className="w-full h-12 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              저장하기
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
