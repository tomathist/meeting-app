import { describe, it, expect } from 'vitest'

// 전화번호 포맷 함수
const formatPhone = (value: string) => {
  const numbers = value.replace(/[^\d]/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

describe('formatPhone', () => {
  it('should format 3 digits', () => {
    expect(formatPhone('010')).toBe('010')
  })

  it('should format 7 digits', () => {
    expect(formatPhone('0101234')).toBe('010-1234')
  })

  it('should format 11 digits', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678')
  })

  it('should remove non-digits', () => {
    expect(formatPhone('010-1234-5678')).toBe('010-1234-5678')
  })
})
