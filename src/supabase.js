import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please create a .env file with:')
  console.error('VITE_SUPABASE_URL=https://your-project-id.supabase.co')
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key-here')
  console.error('\nGet these from: Supabase Dashboard → Settings → API')
  throw new Error('Supabase configuration is missing. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
