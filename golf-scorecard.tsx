"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trophy, Target } from "lucide-react"

interface Hole {
  number: number
  par: number
  score: number
  distance: number
}

export default function GolfScorecard() {
  const [holes, setHoles] = useState<Hole[]>([
    { number: 1, par: 4, score: 0, distance: 380 },
    { number: 2, par: 3, score: 0, distance: 165 },
    { number: 3, par: 5, score: 0, distance: 520 },
    { number: 4, par: 4, score: 0, distance: 410 },
    { number: 5, par: 3, score: 0, distance: 180 },
    { number: 6, par: 4, score: 0, distance: 395 },
    { number: 7, par: 5, score: 0, distance: 545 },
    { number: 8, par: 4, score: 0, distance: 425 },
    { number: 9, par: 3, score: 0, distance: 155 },
  ])

  const [playerName, setPlayerName] = useState("プレイヤー")

  const updateScore = (holeIndex: number, change: number) => {
    setHoles((prev) =>
      prev.map((hole, index) => (index === holeIndex ? { ...hole, score: Math.max(0, hole.score + change) } : hole)),
    )
  }

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0)
  const totalScore = holes.reduce((sum, hole) => sum + hole.score, 0)
  const scoreToPar = totalScore - totalPar

  const getScoreColor = (score: number, par: number) => {
    const diff = score - par
    if (score === 0) return "text-gray-400"
    if (diff < 0) return "text-green-600"
    if (diff === 0) return "text-blue-600"
    if (diff === 1) return "text-orange-500"
    return "text-red-600"
  }

  const getScoreBadge = (score: number, par: number) => {
    const diff = score - par
    if (score === 0) return null
    if (diff === -2)
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          イーグル
        </Badge>
      )
    if (diff === -1)
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          バーディー
        </Badge>
      )
    if (diff === 0)
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          パー
        </Badge>
      )
    if (diff === 1)
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          ボギー
        </Badge>
      )
    if (diff >= 2)
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          ダブルボギー+
        </Badge>
      )
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                ゴルフスコアカード
              </CardTitle>
              <CardDescription>フロント9ホール</CardDescription>
            </div>
            <div className="text-right">
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-right font-semibold"
                placeholder="プレイヤー名"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* ヘッダー */}
            <div className="grid grid-cols-6 gap-2 font-semibold text-sm border-b pb-2">
              <div>ホール</div>
              <div className="text-center">パー</div>
              <div className="text-center">距離(Y)</div>
              <div className="text-center">スコア</div>
              <div className="text-center">操作</div>
              <div className="text-center">結果</div>
            </div>

            {/* ホール情報 */}
            {holes.map((hole, index) => (
              <div key={hole.number} className="grid grid-cols-6 gap-2 items-center py-2 border-b">
                <div className="font-semibold">{hole.number}</div>
                <div className="text-center">{hole.par}</div>
                <div className="text-center text-sm text-gray-600">{hole.distance}</div>
                <div className={`text-center font-bold text-lg ${getScoreColor(hole.score, hole.par)}`}>
                  {hole.score || "-"}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateScore(index, -1)}
                    disabled={hole.score === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateScore(index, 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-center">{getScoreBadge(hole.score, hole.par)}</div>
              </div>
            ))}

            {/* 合計 */}
            <div className="grid grid-cols-6 gap-2 items-center py-3 border-t-2 font-bold bg-gray-50 rounded">
              <div>合計</div>
              <div className="text-center">{totalPar}</div>
              <div className="text-center">-</div>
              <div className="text-center text-lg">{totalScore || "-"}</div>
              <div className="text-center">-</div>
              <div className="text-center">
                {totalScore > 0 && (
                  <Badge variant={scoreToPar <= 0 ? "default" : "destructive"} className="text-sm">
                    <Target className="h-3 w-3 mr-1" />
                    {scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      {totalScore > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ラウンド統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
                <div className="text-sm text-gray-600">総スコア</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar}
                </div>
                <div className="text-sm text-gray-600">パーとの差</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(totalScore / holes.filter((h) => h.score > 0).length || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">平均スコア</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{holes.filter((h) => h.score > 0).length}</div>
                <div className="text-sm text-gray-600">プレイ済み</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
