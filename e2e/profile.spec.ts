import { test, expect } from '@playwright/test'

test.describe('Profile Setup Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // 가짜 유저로 로그인 상태 만들기
    await page.goto('/onboarding')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        phone: '01012345678',
        name: null
      }))
    })
  })

  test('should redirect to profile setup if name is missing', async ({ page }) => {
    await page.goto('/onboarding')
    
    await expect(page).toHaveURL('/onboarding/profile')
    await expect(page.locator('text=이름을 알려주세요')).toBeVisible()
  })

  test('should progress through profile steps', async ({ page }) => {
    await page.goto('/onboarding/profile')
    
    // Step 1: 이름
    await page.fill('input[placeholder="이름"]', '테스트유저')
    await page.click('button:has-text("다음")')
    
    // Step 2: 성별
    await expect(page.locator('text=성별을 선택해주세요')).toBeVisible()
    await page.click('text=남성')
    await page.click('button:has-text("다음")')
    
    // Step 3: 생년월일
    await expect(page.locator('text=생년월일을 입력해주세요')).toBeVisible()
  })

  test('should have exit button', async ({ page }) => {
    await page.goto('/onboarding/profile')
    
    // 로그아웃 버튼 클릭
    await page.click('button:has(svg.lucide-log-out)')
    
    // 확인 다이얼로그
    page.on('dialog', dialog => dialog.accept())
    
    await expect(page).toHaveURL('/onboarding')
  })
})
