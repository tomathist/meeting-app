import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ovqpaougmmguszwdhngh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cXBhb3VnbW1ndXN6d2RobmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjAxNjIsImV4cCI6MjA4NDgzNjE2Mn0.0VcuL1Qg3xPUdfW5BOKbPD32Y-Wa8MGK-6ZHXTANgX4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
