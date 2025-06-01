export interface RoundRequest {
  id: string
  nickname: string
  playDateSpecified?: string
  playDateFlexible?: string
  preferredArea: string[]
  courseType: string
  hasCompanion: boolean
  companionNickname?: string
  playStyle: string[]
  shuttleService: boolean
  requirements: string
  createdAt: string
  contact: string
}

export interface SearchFilters {
  preferredArea?: string
  courseType?: string
  playStyle?: string
  hasCompanion?: boolean
  shuttleService?: boolean
}
