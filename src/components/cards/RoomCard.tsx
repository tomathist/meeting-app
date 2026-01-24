import { motion } from 'framer-motion';
import { MapPin, Users, GraduationCap, Crown } from 'lucide-react';
import { Room, RoomStatus } from '@/types';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  showActions?: boolean;
  onYes?: () => void;
  onNo?: () => void;
  onClick?: () => void;
  isHost?: boolean;
}

const statusLabels: Record<RoomStatus, string> = {
  draft: '작성 중',
  pending: '대기 중',
  active: '활성',
  matched: '매칭됨',
  paused: '일시정지',
  closed: '종료',
};

const statusColors: Record<RoomStatus, string> = {
  draft: 'bg-muted text-foreground',
  pending: 'bg-secondary text-foreground font-medium',
  active: 'bg-success text-success-foreground font-medium',
  matched: 'bg-primary text-primary-foreground font-medium',
  paused: 'bg-muted text-foreground',
  closed: 'bg-muted text-foreground',
};

export function RoomCard({ room, showActions, onYes, onNo, onClick, isHost }: RoomCardProps) {
  // Get unique schools from members
  const schools = [...new Set(room.members.map(m => m.user.school))];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "relative bg-card rounded-2xl p-5 shadow-card border border-border overflow-hidden",
        onClick && "cursor-pointer hover:shadow-elevated transition-shadow"
      )}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isHost && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Crown className="w-3 h-3" />
            방장
          </span>
        )}
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[room.status])}>
          {statusLabels[room.status]}
        </span>
      </div>

      {/* Member avatars */}
      <div className="flex -space-x-3 mb-4">
        {room.members.slice(0, 4).map((member, index) => (
          <div
            key={member.userId}
            className="relative w-12 h-12 rounded-full border-2 border-card overflow-hidden bg-muted"
            style={{ zIndex: 4 - index }}
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {room.area}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {room.size}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <GraduationCap className="w-4 h-4" />
          <span className="truncate">{schools.join(', ')}</span>
        </div>
      </div>

      {/* Action buttons for discover */}
      {showActions && (
        <div className="flex gap-3 mt-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onNo?.(); }}
            className="flex-1 h-12 rounded-xl border-2 border-muted-foreground/20 text-muted-foreground font-semibold hover:bg-muted transition-colors"
          >
            패스
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onYes?.(); }}
            className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-soft"
          >
            좋아요 💕
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
