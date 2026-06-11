import { supabase } from '@/lib/supabase'

export interface ContentItem {
  id: string
  title: string
  description: string | null
  type: string | null
  cover_color: string | null
  sort_order: number | null
  img: string | null
  url: string | null
  created_at: string | null
}

export type ContentInput = Omit<ContentItem, 'id' | 'created_at'>

export async function getAllContent() {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data as ContentItem[]
}

export async function getContentByType(type: string) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('type', type)
    .order('sort_order')

  if (error) throw error
  return data as ContentItem[]
}

export async function createContent(input: ContentInput) {
  const { data, error } = await supabase
    .from('content')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as ContentItem
}

export async function updateContent(id: string, input: Partial<ContentInput>) {
  const { data, error } = await supabase
    .from('content')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ContentItem
}

export async function deleteContent(id: string) {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id)

  if (error) throw error
}
