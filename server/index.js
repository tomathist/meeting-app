const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

const KAKAO_REST_KEY = '6dccd46f5aaa4dc3018b4bde48461306'
const KAKAO_CLIENT_SECRET = 'CZcPZa10ITKZXOJfy97tM4VvbDXYBgyx'
const REDIRECT_URI = 'http://localhost:5173/oauth/kakao'

app.post('/auth/kakao', async (req, res) => {
  const { code } = req.body
  
  try {
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_KEY,
          client_secret: KAKAO_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code,
        },
      }
    )
    
    const accessToken = tokenResponse.data.access_token
    
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    const kakaoUser = userResponse.data
    
    res.json({
      id: kakaoUser.id,
      nickname: kakaoUser.properties?.nickname,
      profileImage: kakaoUser.properties?.profile_image,
    })
  } catch (error) {
    console.error('카카오 로그인 에러:', error.response?.data || error.message)
    res.status(500).json({ error: '로그인 실패' })
  }
})

app.listen(3001, () => {
  console.log('서버 실행 중: http://localhost:3001')
})