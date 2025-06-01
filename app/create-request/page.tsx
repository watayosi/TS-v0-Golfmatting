"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, User, Calendar, MapPin, Settings } from "lucide-react"
import Link from "next/link"
import { saveRoundRequest } from "../../lib/storage"

export default function CreateRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nickname: "",
    playDateSpecified: "",
    playDateFlexible: "",
    preferredArea: [] as string[],
    courseType: "",
    hasCompanion: false,
    companionNickname: "",
    playStyle: [] as string[],
    shuttleService: false,
    requirements: "",
    contact: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // バリデーション
    if (!formData.nickname || !formData.contact) {
      alert("ニックネームと連絡先は必須です")
      return
    }

    if (formData.preferredArea.length === 0) {
      alert("行きたいエリアを選択してください")
      return
    }

    if (!formData.courseType) {
      alert("コース種別を選択してください")
      return
    }

    if (formData.playStyle.length === 0) {
      alert("プレースタイルを選択してください")
      return
    }

    try {
      // リクエストを保存（webhook送信も含む）
      const savedRequest = await saveRoundRequest(formData)
      console.log("リクエスト作成完了:", savedRequest)

      // 成功メッセージ
      alert("ラウンドリクエストを作成しました！Makeにも送信されました。")

      // 検索画面に遷移
      router.push("/search-requests")
    } catch (error) {
      console.error("保存エラー:", error)
      alert("保存中にエラーが発生しました")
    }
  }

  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, preferredArea: [...prev.preferredArea, area] }))
    } else {
      setFormData((prev) => ({ ...prev, preferredArea: prev.preferredArea.filter((a) => a !== area) }))
    }
  }

  const handlePlayStyleChange = (style: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, playStyle: [...prev.playStyle, style] }))
    } else {
      setFormData((prev) => ({ ...prev, playStyle: prev.playStyle.filter((s) => s !== style) }))
    }
  }

  const areas = [
    "北海道",
    "東北（青森、岩手、秋田、宮城、山形、福島、新潟）",
    "北関東（茨城、栃木、群馬、埼玉、山梨、長野）",
    "南関東（埼玉、千葉、東京、神奈川）",
    "東海（静岡、岐阜、愛知、三重）",
    "北陸（富山、石川、福井）",
    "近畿（滋賀、京都、奈良、和歌山、大阪、兵庫）",
    "中国（鳥取、島根、岡山、広島、山口）",
  ]

  const courseTypes = ["指定しない", "山岳", "丘陵", "シーサイド", "林間", "高原", "河川"]

  const playStyles = ["スループレー", "2サムOK", "3サムOK", "4サム希望", "キャディ付"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              トップページに戻る
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">ラウンドリクエスト作成</h1>
          <p className="text-gray-600 mt-2">一緒にゴルフを楽しむ仲間を募集しましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                基本情報
              </CardTitle>
              <CardDescription>あなたの基本情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nickname">ニックネーム *</Label>
                <Input
                  id="nickname"
                  placeholder="例：ゴルフ太郎"
                  value={formData.nickname}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact">連絡先（メールアドレス） *</Label>
                <Input
                  id="contact"
                  type="email"
                  placeholder="例：golf@example.com"
                  value={formData.contact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* プレー日程 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                プレー日程
              </CardTitle>
              <CardDescription>希望するプレー日を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="playDateSpecified">プレー日（指定の場合）</Label>
                <Input
                  id="playDateSpecified"
                  type="date"
                  value={formData.playDateSpecified}
                  onChange={(e) => setFormData((prev) => ({ ...prev, playDateSpecified: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="playDateFlexible">プレー日（指定が無い場合）</Label>
                <Input
                  id="playDateFlexible"
                  placeholder="例：週末希望、平日午前中など"
                  value={formData.playDateFlexible}
                  onChange={(e) => setFormData((prev) => ({ ...prev, playDateFlexible: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* エリア・コース */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                エリア・コース情報
              </CardTitle>
              <CardDescription>希望するエリアとコースタイプを選択してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">行きたいエリア *</Label>
                <div className="grid gap-3 mt-3">
                  {areas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={formData.preferredArea.includes(area)}
                        onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                      />
                      <Label htmlFor={area} className="text-sm leading-relaxed">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">コース種別 *</Label>
                <RadioGroup
                  value={formData.courseType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, courseType: value }))}
                  className="mt-3"
                >
                  {courseTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* 同伴者・プレースタイル */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                同伴者・プレースタイル
              </CardTitle>
              <CardDescription>同伴者の有無とプレースタイルを設定してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">同伴者 *</Label>
                <RadioGroup
                  value={formData.hasCompanion ? "有り" : "無し"}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, hasCompanion: value === "有り" }))}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="有り" id="companion-yes" />
                    <Label htmlFor="companion-yes">有り</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="無し" id="companion-no" />
                    <Label htmlFor="companion-no">無し</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.hasCompanion && (
                <div>
                  <Label htmlFor="companionNickname">同伴者有りの場合のニックネーム</Label>
                  <Input
                    id="companionNickname"
                    placeholder="例：ゴルフ花子"
                    value={formData.companionNickname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companionNickname: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label className="text-base font-medium">プレースタイル *</Label>
                <div className="grid gap-3 mt-3">
                  {playStyles.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={style}
                        checked={formData.playStyle.includes(style)}
                        onCheckedChange={(checked) => handlePlayStyleChange(style, checked as boolean)}
                      />
                      <Label htmlFor={style}>{style}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">送迎</Label>
                <RadioGroup
                  value={formData.shuttleService ? "希望する" : "希望しない"}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, shuttleService: value === "希望する" }))}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="希望する" id="shuttle-yes" />
                    <Label htmlFor="shuttle-yes">希望する</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="希望しない" id="shuttle-no" />
                    <Label htmlFor="shuttle-no">希望しない</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="requirements">要望事項</Label>
                <Textarea
                  id="requirements"
                  placeholder="一緒にゴルフを楽しみたい方へのメッセージや要望をお書きください"
                  value={formData.requirements}
                  onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
            ラウンドリクエストを作成する
          </Button>
        </form>
      </div>
    </div>
  )
}
