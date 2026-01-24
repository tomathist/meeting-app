import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, User, X } from 'lucide-react';

export default function ProfilePicture() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePic = () => {
    setProfilePic(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/onboarding/profile')}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className={`w-6 h-1 rounded-full transition-colors ${
                i <= 7 ? 'bg-primary' : 'bg-muted'
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
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              프로필 사진을 등록해주세요
            </h1>
            <p className="text-muted-foreground">
              선택사항이에요. 나중에 추가할 수도 있어요
            </p>
          </div>

          {/* Profile Picture Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              
              {profilePic ? (
                <button
                  onClick={removePic}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              
              <label className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            본인 사진을 올려주세요. 다른 사람의 사진이나<br />
            부적절한 이미지는 삭제될 수 있어요.
          </p>

          <div className="space-y-3 pt-4">
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={() => navigate('/onboarding/bio')}
            >
              {profilePic ? '다음' : '건너뛰기'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
