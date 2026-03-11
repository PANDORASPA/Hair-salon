import { createClient } from '@supabase/supabase-js'

// Get values - prefer env vars, fallback to hardcoded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://khjjvjufwbmqymgzhbkl.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoampqdXZmd2JtcXl5bXpoYmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NzIwMDAsImV4cCI6MjA1NzI0ODAwMH0.W4p5M3NQr0j-5QJy2N8aH7YvK3L0zXG8R6Yp2nqz8Y'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key loaded:', supabaseAnonKey ? 'YES' : 'NO')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
