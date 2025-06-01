import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, Plus, GuitarIcon as Golf } from "lucide-react"
import DebugPanel from "../components/debug-panel"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Golf className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">ゴルフマッチング</h1>
          </div>
          <p className="text-xl text-gray-600">一緒にゴルフを楽しむ仲間を見つけよう</p>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* ラウンドリクエスト作成 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Plus className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">ラウンドリクエスト作成</CardTitle>
                <CardDescription>一緒にゴルフを楽しむ仲間を募集しましょう</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/create-request">
                  <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">リクエストを作成する</Button>
                </Link>
              </CardContent>
            </Card>

            {/* ラウンドリクエスト検索 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">ラウンドリクエスト検索</CardTitle>
                <CardDescription>あなたにぴったりのゴルフ仲間を見つけましょう</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/search-requests">
                  <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">リクエストを探す</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 特徴 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">サービスの特徴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">簡単マッチング</h3>
                  <p className="text-gray-600">条件に合うゴルフ仲間を簡単に見つけられます</p>
                </div>
                <div className="text-center">
                  <Golf className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">レベル別検索</h3>
                  <p className="text-gray-600">スキルレベルに応じた仲間を探せます</p>
                </div>
                <div className="text-center">
                  <Search className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">詳細検索</h3>
                  <p className="text-gray-600">日程、場所、人数など詳細な条件で検索可能</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* デバッグパネル */}
          <DebugPanel />
        </div>
      </div>
    </div>
  )
}
