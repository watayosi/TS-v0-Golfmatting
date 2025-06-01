"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRoundRequests, clearRoundRequests, getMockRequests, getStoredRequests } from "../lib/storage"
import { Trash2, RefreshCw, Database, HardDrive } from "lucide-react"

export default function DebugPanel() {
  const [allRequests, setAllRequests] = useState(getRoundRequests())
  const [mockRequests, setMockRequests] = useState(getMockRequests())
  const [storedRequests, setStoredRequests] = useState(getStoredRequests())

  const handleRefresh = () => {
    setAllRequests(getRoundRequests())
    setMockRequests(getMockRequests())
    setStoredRequests(getStoredRequests())
  }

  const handleClear = () => {
    if (confirm("保存されたリクエストをすべて削除しますか？（モックデータも含む）")) {
      clearRoundRequests()
      handleRefresh()
      alert("削除しました")
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
        </div>

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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
