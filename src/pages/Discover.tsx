import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { recommendedRooms, friendsList } from '@/data/mockData';
import { Plus, MapPin, Users, X, ArrowDown, GraduationCap, MessageCircle, Sparkles, PartyPopper } from 'lucide-react';
import { Room, RoomSize, User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FriendPicker } from '@/components/FriendPicker';
import { SizeBadge } from '@/components/ui/SizeBadge';
import { useToast } from '@/hooks/use-toast';
import { useMyRooms } from '@/hooks/useMyRooms';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const areas = [
  '서울 강남', '서울 홍대', '서울 신촌', '서울 건대', '서울 성수',
];

// Helper to calculate age from birthDate
const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default function Discover() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeHostRooms, getRoomMembersWithStatus, getIncomingLikes } = useMyRooms();
  
  // Get room from URL param or default
  const urlRoomId = searchParams.get('room');
  const [selectedRoomId, setSelectedRoomId] = useState<string | 'create'>(
    urlRoomId === 'create' ? 'create' : 
    urlRoomId && activeHostRooms.find(r => r.id === urlRoomId) ? urlRoomId :
    activeHostRooms.length > 0 ? activeHostRooms[0].id : 'create'
  );
  
  // Update when URL changes
  useEffect(() => {
    if (urlRoomId === 'create') {
      setSelectedRoomId('create');
    } else if (urlRoomId && activeHostRooms.find(r => r.id === urlRoomId)) {
      setSelectedRoomId(urlRoomId);
    }
  }, [urlRoomId, activeHostRooms]);

  const [votedRooms, setVotedRooms] = useState<Set<string>>(new Set());
  const [matchedRooms, setMatchedRooms] = useState<Set<string>>(new Set());
  
  // Create room form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomIntroduction, setNewRoomIntroduction] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<RoomSize[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [invitedFriends, setInvitedFriends] = useState<User[]>([]);
  
  // Friend picker state
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  
  // Re-invite dialog state
  const [reinviteFriendId, setReinviteFriendId] = useState<string | null>(null);

  const selectedRoom = activeHostRooms.find(r => r.id === selectedRoomId);
  const isCreateTab = selectedRoomId === 'create';

  // Get incoming likes for current room using hook
  const currentRoomLikes = selectedRoom 
    ? getIncomingLikes(selectedRoom.id)
    : [];

  // Combine incoming likes (priority) + daily recommendations (limit 3)
  const allCards = [
    ...currentRoomLikes.map(like => ({ ...like.sourceRoom, isIncomingLike: true as const })),
    ...recommendedRooms.slice(0, 3).map(room => ({ ...room, isIncomingLike: false as const })),
  ];
  
  const visibleRooms = allCards.filter(r => !votedRooms.has(r.id));
  
  // Get members with status for current room using hook
  const currentRoomMembers = selectedRoom 
    ? getRoomMembersWithStatus(selectedRoom.id)
    : [];

  const handleVote = (roomId: string, decision: 'yes' | 'no', isIncomingLike: boolean) => {
    if (decision === 'yes' && isIncomingLike) {
      // This is a match! Show celebration and mark as matched
      setMatchedRooms(prev => new Set([...prev, roomId]));
      toast({
        title: "🎊 축하해요! 미팅이 성립되었어요!",
        description: "새로운 인연이 시작됩니다. 설레는 마음으로 대화를 나눠보세요!",
      });
    } else if (decision === 'no') {
      setVotedRooms(prev => new Set([...prev, roomId]));
    } else {
      // Regular yes vote (not incoming like)
      setVotedRooms(prev => new Set([...prev, roomId]));
    }
  };

  const handleGoToChat = (roomId: string) => {
    navigate(`/chat?match=${roomId}`);
  };

  const toggleSize = (size: RoomSize) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const addFriend = (user: User) => {
    if (!invitedFriends.find(f => f.id === user.id)) {
      setInvitedFriends([...invitedFriends, user]);
    }
  };

  const removeFriend = (userId: string) => {
    setInvitedFriends(invitedFriends.filter(f => f.id !== userId));
  };

  const handleReinvite = () => {
    console.log('Re-inviting friend:', reinviteFriendId);
    setReinviteFriendId(null);
  };

  // Render 2x2 grid of members
  const renderMemberGrid = (members: Room['members']) => {
    const memberCount = members.length;
    const showSecondRow = memberCount > 2;
    
    return (
      <div className={`grid grid-cols-2 gap-3 ${!showSecondRow ? '' : ''}`}>
        {[0, 1, 2, 3].map((index) => {
          // For 2 people, only show first row
          if (!showSecondRow && index >= 2) return null;
          
          const member = members[index];
          
          if (!member) {
            // Empty cell for 3 people case
            if (memberCount === 3 && index === 3) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                >
                  <span className="text-muted-foreground text-sm">빈 자리</span>
                </div>
              );
            }
            return null;
          }

          return (
            <div
              key={member.userId}
              className="bg-muted/50 rounded-2xl p-3 flex flex-col items-center"
            >
              {/* Large Profile Pic / Univ initial */}
              <div className="relative mb-2">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  {member.user.avatarUrl ? (
                    <img src={member.user.avatarUrl} alt={member.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                      {member.user.school.slice(0, 1)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
              
              {/* Info below - smaller */}
              <div className="text-center space-y-0.5">
                <p className="text-sm font-medium text-foreground truncate max-w-full">
                  {member.user.school}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-full">
                  {member.user.department || '학과 미입력'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {calculateAge(member.user.birthDate)}세
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Room Tabs */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {activeHostRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRoomId === room.id
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {room.name || `${room.area} ${room.size}`}
              </button>
            ))}
            <button
              onClick={() => setSelectedRoomId('create')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                isCreateTab
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {/* Create Room Tab */}
          {isCreateTab && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Encouragement Card Stack */}
              <div className="relative h-[280px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-primary/20 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="text-5xl mb-4">😔</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    오늘 기분이 안좋아?
                  </h3>
                  <p className="text-lg text-foreground mb-2">
                    미팅 안해서 그래.
                  </p>
                  <p className="text-primary font-semibold text-lg">
                    바로 친구 초대해!
                  </p>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mt-4"
                  >
                    <ArrowDown className="w-6 h-6 text-primary" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Friends Section */}
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">함께 가는 친구</h4>
                <div className="flex flex-wrap gap-2">
                  {invitedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-2 bg-muted rounded-full pl-1 pr-3 py-1"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">
                          {friend.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{friend.name}</span>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowFriendPicker(true)}
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Conditions - Combined */}
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  🔍 검색조건
                </h4>
                
                {/* Size Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-medium text-foreground">인원수</span>
                    {selectedSizes.length > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                        {selectedSizes.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {(['2:2', '3:3', '4:4'] as RoomSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`flex-1 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                          selectedSizes.includes(size)
                            ? 'bg-primary text-primary-foreground shadow-soft'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-medium text-foreground">지역</span>
                    {selectedAreas.length > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                        {selectedAreas.length}개 선택
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area) => (
                      <button
                        key={area}
                        onClick={() => toggleArea(area)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedAreas.includes(area)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Room Introduction */}
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">방 소개 (선택)</h4>
                <Textarea
                  placeholder="예: 유쾌하고 재밌는 친구들이에요! 같이 맛있는 거 먹으면서 수다 떨어요 🎉"
                  value={newRoomIntroduction}
                  onChange={(e) => setNewRoomIntroduction(e.target.value)}
                  className="min-h-[80px] resize-none"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {newRoomIntroduction.length}/100
                </p>
              </div>

              {/* Room Name */}
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">방 이름 (선택)</h4>
                <Input
                  placeholder="예: 금요일 강남 미팅"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Create Button */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                disabled={invitedFriends.length === 0 || selectedSizes.length === 0 || selectedAreas.length === 0}
              >
                방 만들기
              </Button>
            </motion.div>
          )}

          {/* Room Cards View */}
          {!isCreateTab && selectedRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* My Team Section - MOVED ABOVE CARDS */}
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  🚀 친구들과 함께 돌격!
                </h4>
                <div className="flex gap-3">
                  {currentRoomMembers.map((member) => {
                    const isCurrentUser = member.userId === 'user-1';
                    const hasAccepted = member.hasAccepted;
                    
                    return (
                      <button
                        key={member.userId}
                        onClick={() => !hasAccepted && !isCurrentUser && setReinviteFriendId(member.userId)}
                        disabled={hasAccepted || isCurrentUser}
                        className={`flex flex-col items-center gap-1 transition-all ${
                          !hasAccepted && !isCurrentUser ? 'cursor-pointer hover:scale-105' : ''
                        }`}
                      >
                        <Avatar className={`w-12 h-12 border-2 transition-all ${
                          hasAccepted 
                            ? 'border-primary/40' 
                            : 'border-muted-foreground/20 opacity-50'
                        }`}>
                          {member.user.avatarUrl ? (
                            <img 
                              src={member.user.avatarUrl} 
                              alt={member.user.name} 
                              className={`w-full h-full object-cover ${!hasAccepted ? 'opacity-50' : ''}`}
                            />
                          ) : (
                            <AvatarFallback className={`font-medium ${
                              hasAccepted 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground opacity-50'
                            }`}>
                              {member.user.name.slice(0, 1)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className={`text-xs ${hasAccepted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {member.user.name}
                        </span>
                        {member.role === 'host' && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            방장
                          </span>
                        )}
                        {!hasAccepted && !isCurrentUser && (
                          <span className="text-[10px] text-muted-foreground">대기중</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Stack */}
              <div className="relative h-[420px]">
                <AnimatePresence mode="popLayout">
                  {visibleRooms.length > 0 ? (
                    visibleRooms.slice(0, 3).map((room, index) => {
                      const isTop = index === 0;
                      const isIncomingLike = room.isIncomingLike;
                      
                      return (
                        <motion.div
                          key={room.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{
                            opacity: isTop ? 1 : 0.7 - index * 0.2,
                            scale: 1 - index * 0.05,
                            y: index * 8,
                            zIndex: 3 - index,
                          }}
                          exit={{ opacity: 0, x: -300, rotate: -10 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className={`absolute inset-0 bg-card rounded-3xl shadow-elevated overflow-hidden ${
                            isIncomingLike 
                              ? 'border-[3px] border-primary ring-2 ring-primary/20' 
                              : 'border border-border'
                          }`}
                          style={{ pointerEvents: isTop ? 'auto' : 'none' }}
                        >
                          <div className="p-4 h-full flex flex-col">
                            {/* Incoming like badge */}
                            {isIncomingLike && (
                              <div className="mb-3 flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-xl">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  이 팀이 먼저 좋아요를 눌렀어요! 수락하면 바로 채팅 시작 💬
                                </span>
                              </div>
                            )}
                            
                            {/* Room Preferences at top */}
                            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-border">
                              {(room.preferredAreas || [room.area]).map((area) => (
                                <span
                                  key={area}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                >
                                  <MapPin className="w-3 h-3" />
                                  {area}
                                </span>
                              ))}
                              {(room.preferredSizes || [room.size]).map((size) => (
                                <SizeBadge key={size} size={size} />
                              ))}
                            </div>

                            {/* Team Members - 2x2 Grid */}
                            <div className="flex-1">
                              {renderMemberGrid(room.members)}
                            </div>

                            {/* Room Introduction */}
                            {room.introduction && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-sm text-muted-foreground italic">
                                  "{room.introduction}"
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            {isTop && (
                              <>
                                {matchedRooms.has(room.id) ? (
                                  // Matched state - show celebration button
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4"
                                  >
                                    <Button
                                      variant="hero"
                                      size="lg"
                                      className="w-full h-14 rounded-2xl gap-2"
                                      onClick={() => handleGoToChat(room.id)}
                                    >
                                      <PartyPopper className="w-5 h-5" />
                                      매칭 완료! 대화를 시작해보세요 💬
                                    </Button>
                                  </motion.div>
                                ) : (
                                  // Normal voting buttons
                                  <div className="flex gap-3 mt-4">
                                    <Button
                                      variant="outline"
                                      size="lg"
                                      className="flex-1 h-14 rounded-2xl border-2"
                                      onClick={() => handleVote(room.id, 'no', isIncomingLike)}
                                    >
                                      <X className="w-6 h-6" />
                                    </Button>
                                    <Button
                                      variant="hero"
                                      size="lg"
                                      className={`flex-1 h-14 rounded-2xl ${isIncomingLike ? 'gap-2' : ''}`}
                                      onClick={() => handleVote(room.id, 'yes', isIncomingLike)}
                                    >
                                      {isIncomingLike ? (
                                        <>
                                          <MessageCircle className="w-5 h-5" />
                                          채팅 시작!
                                        </>
                                      ) : (
                                        <span className="text-lg">👍</span>
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-card rounded-3xl border border-border flex flex-col items-center justify-center text-center p-6"
                    >
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        오늘의 추천을 모두 확인했어요!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        내일 새로운 추천이 도착해요
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Conditions - Moved below cards */}
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  🔍 검색조건
                </h4>
                <div className="flex flex-wrap gap-2">
                  {/* Areas */}
                  {(selectedRoom.preferredAreas || [selectedRoom.area]).map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {area}
                    </span>
                  ))}
                  {/* Sizes */}
                  {(selectedRoom.preferredSizes || [selectedRoom.size]).map((size) => (
                    <SizeBadge key={size} size={size} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Friend Picker Modal */}
      <FriendPicker
        open={showFriendPicker}
        onClose={() => setShowFriendPicker(false)}
        friends={friendsList}
        selectedFriends={invitedFriends}
        onSelect={addFriend}
        onRemove={removeFriend}
      />

      {/* Re-invite dialog */}
      <AlertDialog open={!!reinviteFriendId} onOpenChange={() => setReinviteFriendId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>다시 친구를 초대하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              아직 수락하지 않은 친구에게 다시 초대를 보냅니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleReinvite}>
              초대 보내기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
