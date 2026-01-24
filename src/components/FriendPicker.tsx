import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, Check } from 'lucide-react';
import { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FriendPickerProps {
  open: boolean;
  onClose: () => void;
  friends: User[];
  selectedFriends: User[];
  onSelect: (friend: User) => void;
  onRemove: (userId: string) => void;
}

export function FriendPicker({
  open,
  onClose,
  friends,
  selectedFriends,
  onSelect,
  onRemove,
}: FriendPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (userId: string) =>
    selectedFriends.some((f) => f.id === userId);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            친구 초대하기
          </DialogTitle>
        </DialogHeader>

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

        {/* Selected friends */}
        {selectedFriends.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2 border-b border-border">
            {selectedFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full pl-1 pr-2 py-1"
              >
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                    {friend.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{friend.name}</span>
                <button
                  onClick={() => onRemove(friend.id)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Friend list */}
        <div className="flex-1 overflow-y-auto space-y-1 -mx-2 px-2">
          <AnimatePresence>
            {filteredFriends.map((friend) => (
              <motion.button
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() =>
                  isSelected(friend.id) ? onRemove(friend.id) : onSelect(friend)
                }
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isSelected(friend.id)
                    ? 'bg-primary/10'
                    : 'hover:bg-muted'
                }`}
              >
                <Avatar className="w-10 h-10 border-2 border-primary/20">
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
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.school} · {friend.department || '학과 미입력'}
                  </p>
                </div>
                {isSelected(friend.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>

          {filteredFriends.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>검색 결과가 없어요</p>
            </div>
          )}
        </div>

        {/* Done button */}
        <Button onClick={onClose} className="w-full">
          완료 ({selectedFriends.length}명 선택됨)
        </Button>
      </DialogContent>
    </Dialog>
  );
}
