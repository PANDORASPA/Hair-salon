// Supabase Client
// 等你有credentials後，係呢度填入

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

// 如果未set，既話會用null
export const supabase = (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper functions
export const isSupabaseConfigured = () => supabase !== null

// 讀取數據
export async function getData(table) {
  if (!supabase) return null
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw error
  return data
}

// 新增數據
export async function insertData(table, items) {
  if (!supabase) return null
  const { data, error } = await supabase.from(table).insert(items)
  if (error) throw error
  return data
}

// 更新數據
export async function updateData(table, id, updates) {
  if (!supabase) return null
  const { data, error } = await supabase.from(table).update(updates).eq('id', id)
  if (error) throw error
  return data
}

// 刪除數據
export async function deleteData(table, id) {
  if (!supabase) return null
  const { data, error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  return data
}
