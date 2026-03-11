import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khjjvjufwbmqymgzhbkl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoampqdXZmd2JtcXl5bXpoYmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NzIwMDAsImV4cCI6MjA1NzI0ODAwMH0.W4p5M3NQr0j-5QJy2N8aH7YvK3L0zXG8R6Yp2nqz8Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
