import type { RoundRequest } from "../types/round-request"
import { mockRoundRequests } from "./mock-data"

const STORAGE_KEY = "golf-round-requests"
const INIT_KEY = "golf-initialized"

// 初期化チェック（モックデータを一度だけLocalStorageに保存）
const initializeStorage = () => {
  if (typeof window === "undefined") return

  const isInitialized = localStorage.getItem(INIT_KEY)
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRoundRequests))
    localStorage.setItem(INIT_KEY, "true")
  }
}

export const saveRoundRequest = (request: Omit<RoundRequest, "id" | "createdAt">) => {
  initializeStorage()

  const existingRequests = getStoredRequests() // モックデータを含まない保存データのみ取得
  const newRequest: RoundRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }

  const updatedRequests = [...existingRequests, newRequest]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests))
  return newRequest
}

// 全てのリクエストを取得（初期化済みの場合はLocalStorageから、未初期化の場合はモックデータ）
export const getRoundRequests = (): RoundRequest[] => {
  if (typeof window === "undefined") {
    return mockRoundRequests
  }

  initializeStorage()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  return []
}

// LocalStorageのデータをクリア
export const clearRoundRequests = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(INIT_KEY)

  // 確実に削除されたことを確認
  console.log("データを削除しました")
  console.log("STORAGE_KEY存在確認:", localStorage.getItem(STORAGE_KEY))
  console.log("INIT_KEY存在確認:", localStorage.getItem(INIT_KEY))
}

// デバッグ用：モックデータのみを取得
export const getMockRequests = (): RoundRequest[] => {
  return mockRoundRequests
}

// デバッグ用：保存されたデータのみを取得（モックデータを含まない）
export const getStoredRequests = (): RoundRequest[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const isInitialized = localStorage.getItem(INIT_KEY)

    if (stored && isInitialized) {
      const parsedRequests = JSON.parse(stored)

      // モックデータのIDリスト
      const mockIds = mockRoundRequests.map((mock) => mock.id)

      // モックデータを除外した保存データのみを返す
      return parsedRequests.filter((req: RoundRequest) => !mockIds.includes(req.id))
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  return []
}
