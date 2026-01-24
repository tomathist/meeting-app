import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Users, MapPin, Search, Clock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Room {
  id: string;
  name: string;
  gender: string;
  member_count: number;
  max_members: number;
  area: string;
  school: string;
}

export default function Discover() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appliedRoomIds, setAppliedRoomIds] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      fetchAppliedRooms(userData.id);
    }
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedRooms = async (userId: string) => {
    const { data } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', userId);
    
    if (data) {
      setAppliedRoomIds(new Set(data.map(d => d.room_id)));
    }
  };

  const handleApply = async (roomId: string) => {
    if (!user || appliedRoomIds.has(roomId)) return;
    
    setApplying(roomId);
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId: user.id }),
      });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }
      
      setAppliedRoomIds(prev => new Set([...prev, roomId]));
      
    } catch (e) {
      alert('신청 실패');
    } finally {
      setApplying(null);
    }
  };

  const oppositeGender = user?.gender === 'male' ? 'female' : 'male';
  const filteredRooms = rooms.filter(r => 
    r.gender === oppositeGender && !appliedRoomIds.has(r.id)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">미팅 찾기</h1>
          <p className="text-muted-foreground text-sm">
            {user?.name ? `${user.name}님, ` : ''}새로운 인연을 만나보세요
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">로딩 중...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">아직 대기 중인 방이 없어요</p>
            <Button onClick={() => navigate('/rooms/create')}>
              <Plus className="w-4 h-4 mr-2" />
              방 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRooms.map((room, i) => {
              const isApplying = applying === room.id;
              const isFull = room.member_count >= room.max_members;
              
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-4 shadow-card"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        {room.area || '지역 미정'}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {room.member_count}/{room.max_members}명
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">
                      🎓 {room.school || '학교 미정'}
                    </span>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="hero"
                    onClick={() => handleApply(room.id)}
                    disabled={isFull || isApplying}
                  >
                    {isApplying ? '신청 중...' : isFull ? '마감' : '매칭 신청'}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center text-primary">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">발견</span>
          </button>
          <button 
            className="flex flex-col items-center text-muted-foreground"
            onClick={() => navigate('/pending')}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">대기</span>
          </button>
          <button 
            className="flex flex-col items-center text-muted-foreground"
            onClick={() => navigate('/rooms')}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs mt-1">내 방</span>
          </button>
          <button 
            className="flex flex-col items-center text-muted-foreground"
            onClick={() => navigate('/profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">프로필</span>
          </button>
        </div>
      </div>
    </div>
  );
}
