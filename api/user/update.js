import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ovqpaougmmguszwdhngh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cXBhb3VnbW1ndXN6d2RobmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjAxNjIsImV4cCI6MjA4NDgzNjE2Mn0.0VcuL1Qg3xPUdfW5BOKbPD32Y-Wa8MGK-6ZHXTANgX4'
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { userId, name, gender, birthdate, area, school, department } = body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name, gender, birthdate, area, school, department })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: "Update failed", detail: error });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: e.message });
  }
}
