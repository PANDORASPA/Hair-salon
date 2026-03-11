import { createClient } from '@supabase/supabase-js'

console.log('=== Supabase Client Init ===')
console.log('URL from env:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key from env:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
