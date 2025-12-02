import { createClient } from "@/lib/supabase/server"
import { NewsForm } from "@/components/news-form"
import { notFound } from "next/navigation"

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: news, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error || !news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Редактировать новость</h1>
        <p className="text-slate-600 mt-2">Обновить информацию о новости</p>
      </div>

      <NewsForm news={news} />
    </div>
  )
}
