"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { createNews, updateNews } from "@/app/actions/news"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface News {
  id: string
  title: string
  subtitle: string | null
  content: string
  author: string
  category: string
  image_url: string | null
  published_date: string
  status: string
}

export function NewsForm({ news }: { news?: News }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: news?.title || "",
    subtitle: news?.subtitle || "",
    content: news?.content || "",
    author: news?.author || "",
    category: news?.category || "Healthcare",
    image_url: news?.image_url || "",
    published_date: news?.published_date || new Date().toISOString().split("T")[0],
    status: news?.status || "draft",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // If a file is selected, upload it to Supabase Storage first
      if (selectedFile) {
        const MAX_BYTES = 5 * 1024 * 1024 // 5MB
        if (selectedFile.size > MAX_BYTES) throw new Error("Файл слишком большой — максимум 5 МБ")

        const fileExt = selectedFile.name.split(".").pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
        const filePath = `news/${fileName}`

        const { error: uploadError } = await supabase.storage.from("news").upload(filePath, selectedFile)
        if (uploadError) throw uploadError

        const { data: publicData } = await supabase.storage.from("news").getPublicUrl(filePath)
        // @ts-ignore
        formData.image_url = publicData?.publicUrl || formData.image_url
      }

      if (news) {
        // Update existing news
        await updateNews(news.id, formData)
      } else {
        // Create new news
        await createNews(formData)
      }

      router.push("/admin/news")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_date">Published Date *</Label>
              <Input
                id="published_date"
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_file">Изображение (до 5 МБ)</Label>
            <input
              id="image_file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setError(null)
                if (file) {
                  const MAX_BYTES = 5 * 1024 * 1024
                  if (file.size > MAX_BYTES) {
                    setSelectedFile(null)
                    setError("Файл слишком большой — максимум 5 МБ")
                    return
                  }
                }
                setSelectedFile(file)
              }}
            />
            <Label htmlFor="image_url">URL изображения (при необходимости)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/placeholder.svg?height=400&width=600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : news ? "Обновить статью" : "Создать статью"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
