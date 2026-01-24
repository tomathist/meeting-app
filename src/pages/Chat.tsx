import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mockChatThreads, mockChatMessages, mockMatches, currentUser } from '@/data/mockData';
import { MessageCircle, Send, ChevronLeft, LogOut, Star, Users, Crown, GraduationCap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage, Room, RoomMember } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Helper to calculate age
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

// Format time for messages
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matchId = searchParams.get('match');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Find the match and thread
  const match = mockMatches.find(m => m.id === matchId);
  const thread = mockChatThreads.find(t => t.matchId === matchId);
  
  // Determine which team is ours and which is theirs
  const isRoom1Host = match?.room1.hostId === currentUser.id;
  const myRoom = isRoom1Host ? match?.room1 : match?.room2;
  const theirRoom = isRoom1Host ? match?.room2 : match?.room1;
  
  // Check if current user is a host (can send messages)
  const canSendMessage = myRoom?.hostId === currentUser.id;
  
  useEffect(() => {
    if (matchId && mockChatMessages[matchId]) {
      setMessages(mockChatMessages[matchId]);
    }
  }, [matchId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !matchId) return;
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleExit = () => {
    // In real app, save rating and feedback
    console.log('Rating:', rating, 'Feedback:', feedback);
    navigate('/rooms');
  };
  
  // If no match found or viewing from chat list
  if (!matchId || !match) {
    return (
      <AppLayout>
        <div className="px-4 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">채팅</h1>
            <p className="text-sm text-muted-foreground">매칭된 팀과 대화하세요</p>
          </div>

          {mockChatThreads.length > 0 ? (
            <div className="space-y-3">
              {mockChatThreads.map((thread, index) => {
                const threadMatch = mockMatches.find(m => m.id === thread.matchId);
                const otherRoom = threadMatch?.room1.hostId === currentUser.id 
                  ? threadMatch?.room2 
                  : threadMatch?.room1;
                
                return (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/chat?match=${thread.matchId}`)}
                    className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4 cursor-pointer hover:shadow-elevated transition-shadow"
                  >
                    {/* Team avatars */}
                    <div className="flex -space-x-2">
                      {otherRoom?.members.slice(0, 3).map((member, idx) => (
                        <Avatar 
                          key={member.userId} 
                          className="w-10 h-10 border-2 border-card"
                          style={{ zIndex: 3 - idx }}
                        >
                          {member.user.avatarUrl ? (
                            <img src={member.user.avatarUrl} alt={member.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {member.user.name.slice(0, 1)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {otherRoom?.name || [...new Set(otherRoom?.members.map(m => m.user.school))].join(', ')}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {thread.lastMessage?.content || '아직 메시지가 없어요'}
                      </p>
                    </div>
                    {thread.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(thread.lastMessage.createdAt)}
                      </span>
                    )}
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
                <MessageCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                아직 채팅이 없어요
              </h3>
              <p className="text-sm text-muted-foreground">
                매칭이 되면 채팅을 시작할 수 있어요
              </p>
            </motion.div>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/chat')} className="p-1 hover:bg-muted rounded-full">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex -space-x-2">
          {theirRoom?.members.slice(0, 3).map((member, idx) => (
            <Avatar 
              key={member.userId} 
              className="w-8 h-8 border-2 border-card"
              style={{ zIndex: 3 - idx }}
            >
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {member.user.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground text-sm">
            {theirRoom?.name || [...new Set(theirRoom?.members.map(m => m.user.school))].join(', ')}
          </h2>
          <p className="text-xs text-muted-foreground">
            {theirRoom?.members.length}명 · {theirRoom?.size}
          </p>
        </div>
        <button 
          onClick={() => setShowExitDialog(true)}
          className="p-2 hover:bg-muted rounded-full text-muted-foreground"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Team Info Banner */}
      <div className="bg-muted/50 border-b border-border px-4 py-3">
        <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <Users className="w-3 h-3" />
          상대팀 정보
        </h4>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {theirRoom?.members.map((member) => (
            <div key={member.userId} className="flex-shrink-0 flex items-center gap-2 bg-card rounded-xl px-3 py-2">
              <Avatar className="w-10 h-10 border border-primary/20">
                {member.user.avatarUrl ? (
                  <img src={member.user.avatarUrl} alt={member.user.name} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {member.user.school.slice(0, 1)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-foreground">{member.user.school}</span>
                  {member.role === 'host' && (
                    <Crown className="w-3 h-3 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.user.department} · {calculateAge(member.user.birthDate)}세
                </p>
              </div>
            </div>
          ))}
        </div>
        {!canSendMessage && (
          <p className="text-xs text-muted-foreground mt-2 bg-primary/5 px-3 py-2 rounded-lg">
            💬 방장만 메시지를 보낼 수 있어요. 대화 내용을 확인해보세요!
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => {
            const isMe = message.senderId === currentUser.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                        {message.senderName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {!isMe && (
                      <span className="text-xs text-muted-foreground mb-1 block">
                        {message.senderName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className={`text-[10px] text-muted-foreground mt-1 block ${isMe ? 'text-right' : ''}`}>
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border px-4 py-3 pb-safe">
        {canSendMessage ? (
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 h-11 rounded-full bg-muted border-0"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              variant="hero"
              size="icon"
              className="h-11 w-11 rounded-full"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              👀 방장만 메시지를 보낼 수 있어요
            </p>
          </div>
        )}
      </div>

      {/* Exit Dialog with Rating */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              즐거운 미팅 되셨나요? 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              상대 팀과의 미팅은 어떠셨나요?<br />
              솔직한 후기를 남겨주세요!
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            {/* Optional Feedback */}
            <Textarea
              placeholder="간단한 후기를 남겨주세요 (선택)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {feedback.length}/200
            </p>
          </div>
          
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button variant="hero" onClick={handleExit} className="w-full">
              후기 남기고 나가기
            </Button>
            <Button variant="ghost" onClick={() => setShowExitDialog(false)} className="w-full">
              계속 대화하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
