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
  const { maleRoomId, femaleRoomId } = body;

  if (!maleRoomId || !femaleRoomId) {
    return res.status(400).json({ error: "Missing room IDs" });
  }

  // 매칭 생성
  const { data: match, error } = await supabase
    .from('matches')
    .insert({ male_room_id: maleRoomId, female_room_id: femaleRoomId, status: 'pending' })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 두 방 상태를 matched로 변경
  await supabase.from('rooms').update({ status: 'matched' }).eq('id', maleRoomId);
  await supabase.from('rooms').update({ status: 'matched' }).eq('id', femaleRoomId);

  return res.status(200).json(match);
}
