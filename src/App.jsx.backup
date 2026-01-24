import { useState, useEffect } from 'react'

const KAKAO_JS_KEY = '4b9fc07ba0cd8cd40c3df53fbb602a12'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // ✅ 카카오에서 돌아온 code 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) return

    console.log('CODE FROM URL:', code)
    handleKakaoCode(code)
  }, [])

  // ✅ 서버로 code 보내서 사용자 정보 받기
  async function handleKakaoCode(code) {
    setLoading(true)

    try {
      const res = await fetch('/api/auth/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()
      console.log('AUTH RESULT:', data)

      setUser(data)
    } catch (err) {
      console.error('Login failed:', err)
    } finally {
      setLoading(false)
      // ✅ 모든 처리 끝난 뒤 URL 정리
      window.history.replaceState({}, '', '/')
    }
  }

  // ✅ 카카오 로그인 시작
  const handleKakaoLogin = () => {
    const redirectUri = import.meta.env.PROD
      ? 'https://meeting-app-sepia.vercel.app'
      : 'http://localhost:5173'

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_JS_KEY}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code`

    window.location.href = kakaoAuthUrl
  }

  // 🔄 로딩 중
  if (loading) {
    return <div>로그인 중...</div>
  }

  // ✅ 로그인 성공 상태
  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>미팅 앱</h1>

        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필"
            width="100"
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}
          >
            👤
          </div>
        )}

        <p>환영합니다, {user.nickname || '사용자'}님!</p>
        <button onClick={() => setUser(null)}>로그아웃</button>
      </div>
    )
  }

  // ❌ 로그인 전 상태
  return (
    <div style={{ padding: 20 }}>
      <h1>미팅 앱</h1>
      <button onClick={handleKakaoLogin}>카카오로 로그인</button>
    </div>
  )
}

export default App
