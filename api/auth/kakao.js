import axios from "axios";
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
    const code = body?.code;

    if (!code) {
      return res.status(400).json({ error: "Missing code" });
    }

    const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

    if (!KAKAO_REST_KEY || !KAKAO_CLIENT_SECRET || !REDIRECT_URI) {
      return res.status(500).json({ error: "Server env missing" });
    }

    // 카카오 토큰 받기
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: KAKAO_REST_KEY,
      client_secret: KAKAO_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    });

    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      tokenParams,
      { headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // 카카오 유저 정보 받기
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const kakaoUser = userResponse.data;
    const nickname = kakaoUser.properties?.nickname || kakaoUser.kakao_account?.profile?.nickname || "";
    const profileImage = kakaoUser.properties?.profile_image || kakaoUser.kakao_account?.profile?.profile_image_url || "";

    // Supabase에서 유저 찾기 또는 생성
    let { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('kakao_id', kakaoUser.id)
      .single();

    if (!existingUser) {
      // 새 유저 생성
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          kakao_id: kakaoUser.id,
          nickname,
          profile_image: profileImage,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: "Failed to create user", detail: error });
      }
      existingUser = newUser;
    }

    return res.status(200).json({
      id: existingUser.id,
      kakao_id: kakaoUser.id,
      nickname,
      profileImage,
      isNewUser: !existingUser.name, // 프로필 설정 안했으면 true
    });

  } catch (e) {
    const detail = e?.response?.data || e?.message || String(e);
    console.error("Kakao auth error:", detail);
    return res.status(500).json({ error: "Login failed", detail });
  }
}
