import { NewsForm } from "@/components/news-form"

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Создать новость</h1>
        <p className="text-slate-600 mt-2">Добавить новую новость или обновление</p>
      </div>

      <NewsForm />
    </div>
  )
}
