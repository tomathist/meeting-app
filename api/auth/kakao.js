import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
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
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const nickname =
    kakaoUser.properties?.nickname ||
    kakaoUser.kakao_account?.profile?.nickname ||
    "";

    const profileImage =
    kakaoUser.properties?.profile_image ||
    kakaoUser.kakao_account?.profile?.profile_image_url ||
    "";

    return res.status(200).json({
    id: kakaoUser.id,
    nickname,
    profileImage,
    });

  } catch (e) {
    const detail = e?.response?.data || e?.message || String(e);
    console.error("Kakao auth error:", detail);
    return res.status(500).json({ error: "Login failed", detail });
  }
}
