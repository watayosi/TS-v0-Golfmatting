"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRoundRequests, clearRoundRequests, getMockRequests, getStoredRequests } from "../lib/storage"
import { Trash2, RefreshCw, Database, HardDrive, AlertTriangle } from "lucide-react"

export default function DebugPanel() {
  const [allRequests, setAllRequests] = useState<any[]>([])
  const [mockRequests, setMockRequests] = useState<any[]>([])
  const [storedRequests, setStoredRequests] = useState<any[]>([])
  const [message, setMessage] = useState("")

  // コンポーネントマウント時にデータを読み込む
  useEffect(() => {
    handleRefresh()
  }, [])

  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      setAllRequests(getRoundRequests())
      setMockRequests(getMockRequests())
      setStoredRequests(getStoredRequests())
      setMessage("")
    }
  }

  const handleClear = () => {
    if (confirm("保存されたリクエストをすべて削除しますか？（モックデータも含む）")) {
      try {
        clearRoundRequests()

        // 削除後に再読み込み
        setTimeout(() => {
          handleRefresh()
          setMessage("データを削除しました。ページを再読み込みすると初期データが再度表示されます。")
        }, 100)
      } catch (error) {
        console.error("削除エラー:", error)
        setMessage("削除中にエラーが発生しました")
      }
    }
  }

  const handleReload = () => {
    if (confirm("ページを再読み込みしますか？")) {
      window.location.reload()
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">デバッグパネル</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button onClick={handleClear} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            全削除
          </Button>
          <Button onClick={handleReload} variant="secondary" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            ページ再読み込み
          </Button>
        </div>

        {message && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {/* 全リクエスト */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              全リクエスト ({allRequests.length}件)
            </h4>
            <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
              {allRequests.map((req, index) => (
                <div key={req.id} className="text-xs mb-1">
                  {index + 1}. {req.nickname} - {req.playDateSpecified || req.playDateFlexible || "日程未定"}
                </div>
              ))}
              {allRequests.length === 0 && <div className="text-xs text-gray-500">データがありません</div>}
            </div>
          </div>

          {/* モックデータ */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              モックデータ ({mockRequests.length}件)
            </h4>
            <div className="max-h-32 overflow-y-auto bg-blue-50 p-2 rounded">
              {mockRequests.map((req, index) => (
                <div key={req.id} className="text-xs mb-1">
                  {index + 1}. {req.nickname} - {req.playDateSpecified || req.playDateFlexible || "日程未定"}
                </div>
              ))}
            </div>
          </div>

          {/* 保存されたデータ */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              保存データ ({storedRequests.length}件)
            </h4>
            <div className="max-h-32 overflow-y-auto bg-green-50 p-2 rounded">
              {storedRequests.map((req, index) => (
                <div key={req.id} className="text-xs mb-1">
                  {index + 1}. {req.nickname} - {req.playDateSpecified || req.playDateFlexible || "日程未定"}
                </div>
              ))}
              {storedRequests.length === 0 && <div className="text-xs text-gray-500">データがありません</div>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
