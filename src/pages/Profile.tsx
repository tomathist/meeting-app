import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { currentUser } from '@/data/mockData';
import { 
  CheckCircle, 
  Phone, 
  GraduationCap, 
  ChevronRight,
  Shield,
  HelpCircle,
  LogOut,
  Settings,
  Users
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const user = currentUser;

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {user.school} · {user.area}
              </p>
            </div>
          </div>

          {/* Verification status */}
          <div className="flex gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              user.phoneVerified 
                ? 'bg-success/10 text-success' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Phone className="w-3.5 h-3.5" />
              전화 인증
              {user.phoneVerified && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              user.schoolVerified 
                ? 'bg-success/10 text-success' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
              학교 인증
              {user.schoolVerified && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
          </div>
        </motion.div>

        {/* Menu sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card border border-border overflow-hidden mb-4"
        >
          <MenuItem icon={Settings} label="계정 설정" onClick={() => navigate('/settings/account')} />
          <MenuItem icon={Users} label="친구 목록" onClick={() => navigate('/settings/friends')} />
          <MenuItem icon={Shield} label="안전 및 신고" />
          <MenuItem icon={HelpCircle} label="도움말" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
        >
          <MenuItem icon={LogOut} label="로그아웃" danger />
        </motion.div>

        {/* App version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          미팅 v1.0.0
        </p>
      </div>
    </AppLayout>
  );
}

function MenuItem({ 
  icon: Icon, 
  label, 
  danger = false,
  onClick 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${danger ? 'text-destructive' : 'text-muted-foreground'}`} />
        <span className={`font-medium ${danger ? 'text-destructive' : 'text-foreground'}`}>
          {label}
        </span>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
