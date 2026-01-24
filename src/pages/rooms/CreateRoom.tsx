import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function CreateRoom() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    maxMembers: 4,
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleCreate = async () => {
    if (!user || !form.name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          hostId: user.id,
          gender: user.gender,
          maxMembers: form.maxMembers,
          area: user.area,
          school: user.school,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert('방 생성 실패: ' + data.error);
        return;
      }
      alert('방이 생성되었습니다!');
      navigate('/rooms');
    } catch (e) {
      alert('방 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">방 만들기</h1>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">방 이름</label>
          <Input
            placeholder="예: 홍대에서 저녁 먹을 사람!"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">인원 수</label>
          <div className="flex gap-2">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setForm({ ...form, maxMembers: n })}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  form.maxMembers === n
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {n}:{n}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {form.maxMembers}명의 {user?.gender === 'male' ? '남자' : '여자'}팀으로 방이 만들어집니다
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            disabled={!form.name.trim() || loading}
            onClick={handleCreate}
          >
            {loading ? '생성 중...' : '방 만들기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
