import { supabase } from '@/lib/supabase'

export async function getWelcomeWords() {
  const { data, error } = await supabase
    .from('home')
    .select('words')
    .limit(1)
    .single()

  if (error) throw error
  return data as { words: string } | null
}
