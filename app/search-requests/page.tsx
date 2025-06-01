"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Search, Calendar, MapPin, Users, Mail, Car, User } from "lucide-react"
import Link from "next/link"
import type { RoundRequest } from "../../types/round-request"
import { getRoundRequests } from "../../lib/storage"

export default function SearchRequestsPage() {
  const [allRequests, setAllRequests] = useState<RoundRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RoundRequest[]>([])
  const [searchFilters, setSearchFilters] = useState({
    preferredArea: [] as string[],
    courseType: "",
    playStyle: [] as string[],
    hasCompanion: "",
    shuttleService: "",
    dateFrom: "",
  })

  // 初期表示で全件表示
  useEffect(() => {
    const requests = getRoundRequests()
    setAllRequests(requests)
    setFilteredRequests(requests)
  }, [])

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

  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setSearchFilters((prev) => ({ ...prev, preferredArea: [...prev.preferredArea, area] }))
    } else {
      setSearchFilters((prev) => ({ ...prev, preferredArea: prev.preferredArea.filter((a) => a !== area) }))
    }
  }

  const handlePlayStyleChange = (style: string, checked: boolean) => {
    if (checked) {
      setSearchFilters((prev) => ({ ...prev, playStyle: [...prev.playStyle, style] }))
    } else {
      setSearchFilters((prev) => ({ ...prev, playStyle: prev.playStyle.filter((s) => s !== style) }))
    }
  }

  const handleSearch = () => {
    // 保存されている全データから検索（毎回getRoundRequestsを呼ばない）
    let filtered = [...allRequests]

    // エリアフィルター
    if (searchFilters.preferredArea.length > 0) {
      filtered = filtered.filter((req) => req.preferredArea.some((area) => searchFilters.preferredArea.includes(area)))
    }

    // コース種別フィルター
    if (searchFilters.courseType && searchFilters.courseType !== "") {
      filtered = filtered.filter((req) => req.courseType === searchFilters.courseType)
    }

    // プレースタイルフィルター
    if (searchFilters.playStyle.length > 0) {
      filtered = filtered.filter((req) => req.playStyle.some((style) => searchFilters.playStyle.includes(style)))
    }

    // 同伴者フィルター
    if (searchFilters.hasCompanion && searchFilters.hasCompanion !== "") {
      const hasCompanionBool = searchFilters.hasCompanion === "有り"
      filtered = filtered.filter((req) => req.hasCompanion === hasCompanionBool)
    }

    // 送迎フィルター
    if (searchFilters.shuttleService && searchFilters.shuttleService !== "") {
      const shuttleBool = searchFilters.shuttleService === "希望する"
      filtered = filtered.filter((req) => req.shuttleService === shuttleBool)
    }

    // 日付フィルター
    if (searchFilters.dateFrom && searchFilters.dateFrom !== "") {
      filtered = filtered.filter((req) => {
        if (req.playDateSpecified && req.playDateSpecified !== "") {
          return req.playDateSpecified >= searchFilters.dateFrom
        }
        return true // 日付指定なしの場合は含める
      })
    }

    console.log("検索条件:", searchFilters)
    console.log("検索対象データ数:", allRequests.length)
    console.log("フィルター後の結果数:", filtered.length)
    console.log("フィルター後の結果:", filtered)

    setFilteredRequests(filtered)
  }

  const resetFilters = () => {
    setSearchFilters({
      preferredArea: [],
      courseType: "",
      playStyle: [],
      hasCompanion: "",
      shuttleService: "",
      dateFrom: "",
    })
    // 最新のデータを取得してリセット
    const requests = getRoundRequests()
    setAllRequests(requests)
    setFilteredRequests(requests)
  }

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
          <h1 className="text-3xl font-bold text-gray-800">ラウンドリクエスト検索</h1>
          <p className="text-gray-600 mt-2">あなたにぴったりのゴルフ仲間を見つけましょう</p>
        </div>

        {/* 検索フィルター */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              検索条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 日付検索 */}
              <div>
                <Label htmlFor="dateFrom">プレー日（以降）</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              {/* 行きたいエリア */}
              <div>
                <Label className="text-base font-medium">行きたいエリア</Label>
                <div className="max-h-40 overflow-y-auto mt-2 space-y-2">
                  {areas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={searchFilters.preferredArea.includes(area)}
                        onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                      />
                      <Label htmlFor={area} className="text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* コース種別 */}
              <div>
                <Label className="text-base font-medium">コース種別</Label>
                <RadioGroup
                  value={searchFilters.courseType}
                  onValueChange={(value) => {
                    // 同じ値をクリックした場合はクリア
                    if (value === searchFilters.courseType) {
                      setSearchFilters((prev) => ({ ...prev, courseType: "" }))
                    } else {
                      setSearchFilters((prev) => ({ ...prev, courseType: value }))
                    }
                  }}
                  className="mt-2"
                >
                  {courseTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`course-${type}`} />
                      <Label htmlFor={`course-${type}`} className="text-sm cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* プレースタイル */}
              <div>
                <Label className="text-base font-medium">プレースタイル</Label>
                <div className="mt-2 space-y-2">
                  {playStyles.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={style}
                        checked={searchFilters.playStyle.includes(style)}
                        onCheckedChange={(checked) => handlePlayStyleChange(style, checked as boolean)}
                      />
                      <Label htmlFor={style} className="text-sm">
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 同伴者 */}
              <div>
                <Label className="text-base font-medium">同伴者</Label>
                <RadioGroup
                  value={searchFilters.hasCompanion}
                  onValueChange={(value) => {
                    // 同じ値をクリックした場合はクリア
                    if (value === searchFilters.hasCompanion) {
                      setSearchFilters((prev) => ({ ...prev, hasCompanion: "" }))
                    } else {
                      setSearchFilters((prev) => ({ ...prev, hasCompanion: value }))
                    }
                  }}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="有り" id="companion-yes" />
                    <Label htmlFor="companion-yes" className="text-sm cursor-pointer">
                      有り
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="無し" id="companion-no" />
                    <Label htmlFor="companion-no" className="text-sm cursor-pointer">
                      無し
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 送迎 */}
              <div>
                <Label className="text-base font-medium">送迎</Label>
                <RadioGroup
                  value={searchFilters.shuttleService}
                  onValueChange={(value) => {
                    // 同じ値をクリックした場合はクリア
                    if (value === searchFilters.shuttleService) {
                      setSearchFilters((prev) => ({ ...prev, shuttleService: "" }))
                    } else {
                      setSearchFilters((prev) => ({ ...prev, shuttleService: value }))
                    }
                  }}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="希望する" id="shuttle-yes" />
                    <Label htmlFor="shuttle-yes" className="text-sm cursor-pointer">
                      希望する
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="希望しない" id="shuttle-no" />
                    <Label htmlFor="shuttle-no" className="text-sm cursor-pointer">
                      希望しない
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                検索する
              </Button>
              <Button onClick={resetFilters} variant="outline">
                リセット
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 検索結果 */}
        <div>
          <div className="mb-4">
            <p className="text-gray-600">{filteredRequests.length}件のリクエストが見つかりました</p>
          </div>

          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Dialog key={request.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{request.nickname}さんのリクエスト</h3>
                        <Badge variant="outline">{request.courseType}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{request.playDateSpecified || request.playDateFlexible || "日程調整中"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{request.preferredArea.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>同伴者: {request.hasCompanion ? "あり" : "なし"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Car className="h-4 w-4" />
                          <span>送迎: {request.shuttleService ? "希望する" : "希望しない"}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 line-clamp-2">{request.requirements}</p>

                      <div className="flex gap-2 mt-4 flex-wrap">
                        {request.playStyle.map((style) => (
                          <Badge key={style} variant="secondary">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{request.nickname}さんのラウンドリクエスト</DialogTitle>
                    <DialogDescription>詳細情報</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* 基本情報 */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        基本情報
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">ニックネーム：</span>
                          <span className="font-medium">{request.nickname}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">プレー日：</span>
                          <span className="font-medium">
                            {request.playDateSpecified || request.playDateFlexible || "調整中"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">希望エリア：</span>
                          <span className="font-medium">{request.preferredArea.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">コース種別：</span>
                          <span className="font-medium">{request.courseType}</span>
                        </div>
                      </div>
                    </div>

                    {/* 参加者情報 */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        参加者情報
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">同伴者：</span>
                          <span className="font-medium">{request.hasCompanion ? "あり" : "なし"}</span>
                        </div>
                        {request.hasCompanion && request.companionNickname && (
                          <div>
                            <span className="text-gray-600">同伴者ニックネーム：</span>
                            <span className="font-medium">{request.companionNickname}</span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-gray-600">プレースタイル：</span>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {request.playStyle.map((style) => (
                              <Badge key={style} variant="secondary">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* その他の情報 */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        その他の情報
                      </h4>
                      <div>
                        <span className="text-gray-600">送迎：</span>
                        <span className="font-medium">{request.shuttleService ? "希望する" : "希望しない"}</span>
                      </div>
                    </div>

                    {/* 要望事項 */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3">要望事項</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{request.requirements}</p>
                    </div>

                    {/* 連絡先 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        連絡先
                      </h4>
                      <p className="text-gray-700">参加希望の方は以下のメールアドレスまでご連絡ください：</p>
                      <p className="font-medium text-blue-600">{request.contact}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}

            {filteredRequests.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg">条件に合うリクエストが見つかりませんでした</p>
                  <p className="text-gray-400 mt-2">検索条件を変更してお試しください</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
