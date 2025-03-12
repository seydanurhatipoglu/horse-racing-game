export type Color = `#${string}`

export type Horse = {
  name: string
  condition: number
  color: Color
}

export type HorseList = Horse[]

export type RacerInfo = {
  position: number
  horse: Horse
}

export interface RaceState {
  positions: number[]
  startTime: number | null
  pausedAt: number | null
  elapsedTime: number
  isFinished: boolean
}
