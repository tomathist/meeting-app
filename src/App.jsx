import { useState, useEffect } from 'react'

const KAKAO_JS_KEY = '4b9fc07ba0cd8cd40c3df53fbb602a12'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    
    if (code) {
      // 코드를 서버로 보내서 사용자 정보 받기
      setLoading(true)
      fetch('/api/auth/kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          setUser(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
      
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const handleKakaoLogin = () => {
    const redirectUri = 'https://meeting-app-sepia.vercel.app/oauth/kakao'
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_JS_KEY}&redirect_uri=${redirectUri}&response_type=code`
    window.location.href = kakaoAuthUrl
  }

  if (loading) {
    return <div>로그인 중...</div>
  }

  if (user) {
    return (
      <div>
        <h1>미팅 앱</h1>
        <img src={user.profileImage} alt="프로필" width="100" />
        <p>환영합니다, {user.nickname}님!</p>
        <button onClick={() => setUser(null)}>로그아웃</button>
      </div>
    )
  }

  return (
    <div>
      <h1>미팅 앱</h1>
      <button onClick={handleKakaoLogin}>카카오로 로그인</button>
      <button>네이버로 로그인</button>
    </div>
  )
}

export default App