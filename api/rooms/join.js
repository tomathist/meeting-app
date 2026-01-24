import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ovqpaougmmguszwdhngh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cXBhb3VnbW1ndXN6d2RobmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjAxNjIsImV4cCI6MjA4NDgzNjE2Mn0.0VcuL1Qg3xPUdfW5BOKbPD32Y-Wa8MGK-6ZHXTANgX4'
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { roomId, userId } = body;

  if (!roomId || !userId) {
    return res.status(400).json({ error: "Missing roomId or userId" });
  }

  // 방 정보 확인
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.member_count >= room.max_members) {
    return res.status(400).json({ error: "Room is full" });
  }

  // 멤버 추가
  const { error: joinError } = await supabase
    .from('room_members')
    .insert({ room_id: roomId, user_id: userId });

  if (joinError) {
    return res.status(500).json({ error: joinError.message });
  }

  // 멤버 수 업데이트
  await supabase
    .from('rooms')
    .update({ member_count: room.member_count + 1 })
    .eq('id', roomId);

  return res.status(200).json({ success: true });
}
