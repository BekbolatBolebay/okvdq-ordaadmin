"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createNews(formData: {
  title: string
  subtitle: string | null
  content: string
  author: string
  category: string
  image_url: string | null
  published_date: string
  status: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to perform this action")
  }

  const { error } = await supabase.from("news").insert({
    ...formData,
    created_by: user.id,
  })

  if (error) throw error

  revalidatePath("/admin/news")
  return { success: true }
}

export async function updateNews(
  newsId: string,
  formData: {
    title: string
    subtitle: string | null
    content: string
    author: string
    category: string
    image_url: string | null
    published_date: string
    status: string
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to perform this action")
  }

  const { error } = await supabase
    .from("news")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", newsId)

  if (error) throw error

  revalidatePath("/admin/news")
  return { success: true }
}
