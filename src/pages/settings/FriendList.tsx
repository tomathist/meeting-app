import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Search,
  UserMinus,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function FriendList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(mockUsers.filter(u => u.id !== 'user-1'));
  const [removingFriend, setRemovingFriend] = useState<string | null>(null);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFriend = (userId: string) => {
    setFriends(friends.filter(f => f.id !== userId));
    setRemovingFriend(null);
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
            <h1 className="text-lg font-semibold">친구 목록</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="이름 또는 학교로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Friend count */}
          <p className="text-sm text-muted-foreground">
            친구 {friends.length}명
          </p>

          {/* Friend list */}
          <div className="space-y-2">
            <AnimatePresence>
              {filteredFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-3"
                >
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    {friend.avatarUrl ? (
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {friend.name.slice(0, 1)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.school} · {friend.department || '학과 미입력'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        메시지 보내기
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                        onClick={() => setRemovingFriend(friend.id)}
                      >
                        <UserMinus className="w-4 h-4" />
                        친구 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFriends.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>친구가 없어요</p>
              </div>
            )}
          </div>
        </div>

        {/* Remove friend dialog */}
        <AlertDialog open={!!removingFriend} onOpenChange={() => setRemovingFriend(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>친구를 삭제하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                삭제된 친구는 다시 추가해야 합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removingFriend && handleRemoveFriend(removingFriend)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
