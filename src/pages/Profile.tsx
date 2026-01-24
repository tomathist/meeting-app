import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, Shield, HelpCircle, LogOut } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/onboarding');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Card */}
      <div className="bg-card m-4 rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
            {user.name?.charAt(0) || user.nickname?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name || user.nickname}</h2>
            <p className="text-muted-foreground text-sm">
              {user.school} · {user.area}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {user.gender && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {user.gender === 'male' ? '👨 남성' : '👩 여성'}
            </span>
          )}
          {user.department && (
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
              {user.department}
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-card m-4 rounded-2xl overflow-hidden shadow-card">
        <button 
          className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors"
          onClick={() => navigate('/settings/account')}
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span>계정 설정</span>
          <span className="ml-auto text-muted-foreground">›</span>
        </button>
        
        <button 
          className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-t border-border"
          onClick={() => navigate('/settings/friends')}
        >
          <Users className="w-5 h-5 text-muted-foreground" />
          <span>친구 목록</span>
          <span className="ml-auto text-muted-foreground">›</span>
        </button>
        
        <button className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-t border-border">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <span>안전 및 신고</span>
          <span className="ml-auto text-muted-foreground">›</span>
        </button>
        
        <button className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-t border-border">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          <span>도움말</span>
          <span className="ml-auto text-muted-foreground">›</span>
        </button>
      </div>

      {/* Logout */}
      <div className="bg-card m-4 rounded-2xl overflow-hidden shadow-card">
        <button 
          className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>로그아웃</span>
          <span className="ml-auto">›</span>
        </button>
      </div>

      <p className="text-center text-muted-foreground text-sm mt-4">미팅 v1.0.0</p>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex justify-around py-3">
          <button 
            className="flex flex-col items-center text-muted-foreground"
            onClick={() => navigate('/discover')}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">발견</span>
          </button>
          <button 
            className="flex flex-col items-center text-muted-foreground"
            onClick={() => navigate('/rooms')}
          >
            <span className="text-xl">+</span>
            <span className="text-xs mt-1">내 방</span>
          </button>
          <button className="flex flex-col items-center text-primary">
            <div className="w-6 h-6 rounded-full bg-primary/20" />
            <span className="text-xs mt-1">프로필</span>
          </button>
        </div>
      </div>
    </div>
  );
}
