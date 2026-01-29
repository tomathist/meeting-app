import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/onboarding')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
  })

  test('should display login page with all options', async ({ page }) => {
    await page.goto('/onboarding')
    
    await expect(page.locator('text=미팅')).toBeVisible()
    await expect(page.locator('text=카카오로 시작하기')).toBeVisible()
    await expect(page.locator('text=네이버로 시작하기')).toBeVisible()
    await expect(page.locator('text=전화번호로 시작하기')).toBeVisible()
  })

  test('should navigate to phone login page', async ({ page }) => {
    await page.goto('/onboarding')
    
    await page.click('text=전화번호로 시작하기')
    
    await expect(page).toHaveURL('/onboarding/phone')
    await expect(page.locator('text=전화번호를 입력해주세요')).toBeVisible()
  })

  test('should validate phone number format', async ({ page }) => {
    await page.goto('/onboarding/phone')
    
    const input = page.locator('input[type="tel"]')
    await input.fill('01012345678')
    
    await expect(input).toHaveValue('010-1234-5678')
  })

  test('should disable button for invalid phone number', async ({ page }) => {
    await page.goto('/onboarding/phone')
    
    const input = page.locator('input[type="tel"]')
    const button = page.locator('button:has-text("인증번호 받기")')
    
    await input.fill('010123')
    await expect(button).toBeDisabled()
    
    await input.fill('01012345678')
    await expect(button).toBeEnabled()
  })

  test('should go back to login page', async ({ page }) => {
    await page.goto('/onboarding/phone')
    
    await page.click('button:has(svg)')  // 뒤로가기 버튼
    
    await expect(page).toHaveURL('/onboarding')
  })
})
