import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Bell, Heart, UserPlus, Check, X, MapPin } from 'lucide-react';
import { pendingInvitations } from '@/data/mockData';
import { SizeBadge } from '@/components/ui/SizeBadge';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'match' | 'invitation' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: '환영합니다!',
    message: '미팅 앱에 가입해주셔서 감사합니다',
    time: '1시간 전',
    read: true,
  },
];

const iconMap = {
  match: Heart,
  invitation: UserPlus,
  system: Bell,
};

export default function Inbox() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dismissedInvitations, setDismissedInvitations] = useState<Set<string>>(new Set());

  const visibleInvitations = pendingInvitations.filter(inv => !dismissedInvitations.has(inv.id));

  const handleReject = (invitationId: string) => {
    setDismissedInvitations(prev => new Set([...prev, invitationId]));
    toast({
      title: "초대를 거절했어요",
      description: "다음에 더 좋은 만남이 있을 거예요!",
    });
  };

  const handleAccept = (invitationId: string, roomId: string) => {
    setDismissedInvitations(prev => new Set([...prev, invitationId]));
    toast({
      title: "🎉 초대를 수락했어요!",
      description: "새로운 미팅방으로 이동합니다.",
    });
    // Navigate to discover with the new room
    navigate(`/discover?room=${roomId}`);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">알림</h1>
          <p className="text-sm text-muted-foreground">새 소식을 확인하세요</p>
        </div>

        {/* Pending Invitations Section */}
        <AnimatePresence>
          {visibleInvitations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                초대 요청
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {visibleInvitations.length}
                </span>
              </h2>
              <div className="space-y-3">
                {visibleInvitations.map((invitation, index) => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -300, height: 0, marginBottom: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-4 shadow-card border border-border border-l-4 border-l-primary"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {invitation.room.members[0]?.user.name}님이 초대했어요
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            <MapPin className="w-3 h-3" />
                            {invitation.room.area}
                          </span>
                          <SizeBadge size={invitation.room.size} variant="compact" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Team preview */}
                    <div className="flex -space-x-2 mb-4">
                      {invitation.room.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={member.userId}
                          className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
                          style={{ zIndex: 3 - idx }}
                        >
                          {member.user.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="default"
                        onClick={() => handleReject(invitation.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        거절
                      </Button>
                      <Button 
                        variant="hero" 
                        className="flex-1" 
                        size="default"
                        onClick={() => handleAccept(invitation.id, invitation.roomId)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        수락
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Other Notifications */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림
          </h2>
          
          {mockNotifications.length > 0 ? (
            <div className="space-y-3">
              {mockNotifications.map((notification, index) => {
                const Icon = iconMap[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (visibleInvitations.length + index) * 0.1 }}
                    className={`bg-card rounded-2xl p-4 shadow-card border border-border flex items-start gap-4 cursor-pointer hover:shadow-elevated transition-shadow ${
                      !notification.read ? 'border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.type === 'match' ? 'bg-primary/10 text-primary' :
                      notification.type === 'invitation' ? 'bg-secondary text-secondary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                새 알림이 없어요
              </h3>
              <p className="text-sm text-muted-foreground">
                새로운 소식이 오면 알려드릴게요
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
