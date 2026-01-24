import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ovqpaougmmguszwdhngh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cXBhb3VnbW1ndXN6d2RobmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjAxNjIsImV4cCI6MjA4NDgzNjE2Mn0.0VcuL1Qg3xPUdfW5BOKbPD32Y-Wa8MGK-6ZHXTANgX4'
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    // 방 목록 조회
    const { gender, status = 'waiting' } = req.query;
    
    let query = supabase
      .from('rooms')
      .select(`
        *,
        host:users!rooms_host_id_fkey(nickname, profile_image),
        room_members(user_id, users(nickname, profile_image))
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (gender) {
      query = query.eq('gender', gender);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    // 방 생성
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, hostId, gender, maxMembers = 4, area, school } = body;

    if (!name || !hostId || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 방 생성
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({ name, host_id: hostId, gender, max_members: maxMembers, area, school })
      .select()
      .single();

    if (roomError) {
      return res.status(500).json({ error: roomError.message });
    }

    // 호스트를 멤버로 추가
    await supabase
      .from('room_members')
      .insert({ room_id: room.id, user_id: hostId });

    return res.status(200).json(room);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
