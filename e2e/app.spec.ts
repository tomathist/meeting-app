import { test, expect } from '@playwright/test'

test.describe('Main App Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // 완료된 유저로 로그인
    await page.goto('/onboarding')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        phone: '01012345678',
        name: '테스트유저',
        gender: 'male',
        area: '서울 강남',
        school: '테스트대학교'
      }))
    })
  })

  test('should redirect to discover page', async ({ page }) => {
    await page.goto('/onboarding')
    
    await expect(page).toHaveURL('/discover')
  })

  test('should display bottom navigation', async ({ page }) => {
    await page.goto('/discover')
    
    await expect(page.locator('text=발견')).toBeVisible()
    await expect(page.locator('text=대기')).toBeVisible()
    await expect(page.locator('text=내 방')).toBeVisible()
    await expect(page.locator('text=프로필')).toBeVisible()
  })

  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/discover')
    
    await page.click('text=내 방')
    await expect(page).toHaveURL('/rooms')
    
    await page.click('text=프로필')
    await expect(page).toHaveURL('/profile')
    
    await page.click('text=발견')
    await expect(page).toHaveURL('/discover')
  })

  test('should navigate to create room', async ({ page }) => {
    await page.goto('/rooms')
    
    await page.click('text=방 만들기')
    
    await expect(page).toHaveURL('/rooms/create')
  })

  test('should logout from profile', async ({ page }) => {
    await page.goto('/profile')
    
    page.on('dialog', dialog => dialog.dismiss())  // 취소하면 로그아웃 안됨
    await page.click('text=로그아웃')
    
    await expect(page).toHaveURL('/profile')
  })
})
