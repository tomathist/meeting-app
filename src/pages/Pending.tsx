import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, MapPin, Search, Plus, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PendingRoom {
  id: string;
  room_id: string;
  joined_at: string;
  rooms: {
    id: string;
    name: string;
    gender: string;
    member_count: number;
    max_members: number;
    area: string;
    school: string;
    status: string;
  };
}

export default function Pending() {
  const navigate = useNavigate();
  const [pendingRooms, setPendingRooms] = useState<PendingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      fetchPendingRooms(userData.id);
    }
  }, []);

  const fetchPendingRooms = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('room_members')
        .select(`
          id,
          room_id,
          joined_at,
          rooms (
            id,
            name,
            gender,
            member_count,
            max_members,
            area,
            school,
            status
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching pending rooms:', error);
        return;
      }

      // 상대 성별 방만 필터링 (내가 신청한 방)
      const stored = localStorage.getItem('user');
      if (stored) {
        const userData = JSON.parse(stored);
        const oppositeGender = userData.gender === 'male' ? 'female' : 'male';
        const filtered = (data || []).filter(
          (item: any) => item.rooms?.gender === oppositeGender
        );
        setPendingRooms(filtered);
      }
    } catch (e) {
      console.error('Failed to fetch pending rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  const cancelApplication = async (roomMemberId: string, roomId: string) => {
    if (!confirm('신청을 취소하시겠습니까?')) return;

    try {
      // room_members에서 삭제
      await supabase
        .from('room_members')
        .delete()
        .eq('id', roomMemberId);

      // room member_count 감소
      const room = pendingRooms.find(p => p.id === roomMemberId)?.rooms;
      if (room) {
        await supabase
          .from('rooms')
          .update({ member_count: Math.max(0, room.member_count - 1) })
          .eq('id', roomId);
      }

      // 목록에서 제거
      setPendingRooms(prev => prev.filter(p => p.id !== roomMemberId));
      alert('신청이 취소되었습니다');
    } catch (e) {
      alert('취소 실패');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">대기 중</h1>
          <p className="text-muted-foreground text-sm">
            매칭 신청한 방 목록
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">로딩 중...</div>
        ) : pendingRooms.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">신청한 방이 없어요</p>
            <button 
              onClick={() => navigate('/discover')}
              className="text-primary underline"
            >
              매칭 찾으러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRooms.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{item.rooms.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      {item.rooms.area || '지역 미정'}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.rooms.status === 'waiting' 
                      ? 'bg-yellow-100 text-yellow-700'
                      : item.rooms.status === 'matched'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.rooms.status === 'waiting' ? '⏳ 대기 중' : 
                     item.rooms.status === 'matched' ? '✅ 매칭됨' : item.rooms.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>👥 {item.rooms.member_count}/{item.rooms.max_members}명</span>
                  <span>🎓 {item.rooms.school || '학교 미정'}</span>
                </div>

                <button
                  onClick={() => cancelApplication(item.id, item.room_id)}
                  className="w-full py-2 border border-red-300 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                >
                  신청 취소
                </button>
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
          <button className="flex flex-col items-center text-primary">
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
