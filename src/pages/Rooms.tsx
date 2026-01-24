import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Users, MapPin, Search, Clock, User } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  gender: string;
  member_count: number;
  max_members: number;
  area: string;
  school: string;
  status: string;
}

export default function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const user = JSON.parse(stored);
      
      const res = await fetch(`/api/rooms?gender=${user.gender}`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">내 방</h1>
          <Button onClick={() => navigate('/rooms/create')} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            방 만들기
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">로딩 중...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">아직 방이 없어요</p>
            <Button onClick={() => navigate('/rooms/create')}>
              <Plus className="w-4 h-4 mr-2" />
              방 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-card border border-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      {room.area || '지역 미정'}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    room.status === 'waiting' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : room.status === 'matched'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {room.status === 'waiting' ? '대기 중' : room.status === 'matched' ? '매칭됨' : room.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>👥 {room.member_count}/{room.max_members}명</span>
                  <span>🎓 {room.school || '학교 미정'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex justify-around py-3">
          <button 
            className="flex flex-col items-center text-muted-foreground"
            onClick={() => navigate('/discover')}
          >
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
          <button className="flex flex-col items-center text-primary">
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
