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

  const existingRequests = getRoundRequests()
  const newRequest: RoundRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }

  const updatedRequests = [...existingRequests, newRequest]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests))
  return newRequest
}

export const getRoundRequests = (): RoundRequest[] => {
  if (typeof window === "undefined") {
    return mockRoundRequests
  }

  initializeStorage()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsedRequests = JSON.parse(stored)
      return parsedRequests
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  return []
}

export const clearRoundRequests = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(INIT_KEY)
}

// デバッグ用：モックデータのみを取得
export const getMockRequests = (): RoundRequest[] => {
  return mockRoundRequests
}

// デバッグ用：保存されたデータのみを取得
export const getStoredRequests = (): RoundRequest[] => {
  if (typeof window === "undefined") return []

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
