import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus, Crown, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SizeBadge } from '@/components/ui/SizeBadge';
import { useMyRooms } from '@/hooks/useMyRooms';

const statusLabels = {
  draft: '작성 중',
  pending: '대기 중',
  active: '활성',
  matched: '매칭됨',
  paused: '일시정지',
  closed: '종료',
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-secondary text-secondary-foreground',
  active: 'bg-success text-success-foreground',
  matched: 'bg-primary text-primary-foreground',
  paused: 'bg-muted text-muted-foreground',
  closed: 'bg-muted text-muted-foreground',
};

export default function Rooms() {
  const navigate = useNavigate();
  const { allRooms } = useMyRooms();

  const handleRoomClick = (roomId: string) => {
    // Navigate to discover with the room selected
    navigate(`/discover?room=${roomId}`);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">내 방</h1>
          <Button variant="gradient" size="sm" onClick={() => navigate('/discover?room=create')}>
            <Plus className="w-4 h-4" />
            방 만들기
          </Button>
        </div>

        {/* Room List */}
        <div className="space-y-4">
          {allRooms.length > 0 ? (
            allRooms.map(({ room, isHost }, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleRoomClick(room.id)}
                className="relative bg-card rounded-2xl p-5 shadow-card border border-border overflow-hidden cursor-pointer hover:shadow-elevated transition-shadow"
              >
                {/* Role Banner */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
                
                {/* Top row: Role Badge + Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isHost ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        방장
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent-foreground text-xs font-medium">
                        <Users className="w-3 h-3" />
                        참가자
                      </span>
                    )}
                  </div>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[room.status])}>
                    {statusLabels[room.status]}
                  </span>
                </div>

                {/* Member avatars */}
                <div className="flex -space-x-3 mb-4">
                  {room.members.slice(0, 4).map((member, idx) => (
                    <div
                      key={member.userId}
                      className="relative w-12 h-12 rounded-full border-2 border-card overflow-hidden bg-muted"
                      style={{ zIndex: 4 - idx }}
                    >
                      {member.user.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt={member.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-medium">
                          {member.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                  {room.members.length < parseInt(room.size.charAt(0)) && (
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground text-xs">
                      +{parseInt(room.size.charAt(0)) - room.members.length}
                    </div>
                  )}
                </div>

                {/* Room info */}
                <div className="space-y-2">
                  {/* Area and Size Tags */}
                  <div className="flex flex-wrap gap-2">
                    {/* Areas */}
                    {(room.preferredAreas || [room.area]).map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        <MapPin className="w-3 h-3" />
                        {area}
                      </span>
                    ))}
                    {/* Sizes - can have multiple */}
                    {(room.preferredSizes || [room.size]).map((size) => (
                      <SizeBadge key={size} size={size} />
                    ))}
                  </div>
                  
                  {/* Room name or schools */}
                  <p className="text-sm text-muted-foreground">
                    {room.name || [...new Set(room.members.map(m => m.user.school))].join(', ')}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState
              emoji="🏠"
              title="아직 방이 없어요"
              description="친구와 함께 방을 만들어 보세요"
              action={
                <Button variant="hero" onClick={() => navigate('/discover?room=create')}>
                  방 만들기
                </Button>
              }
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function EmptyState({
  emoji,
  title,
  description,
  action,
}: {
  emoji: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {action}
    </motion.div>
  );
}
