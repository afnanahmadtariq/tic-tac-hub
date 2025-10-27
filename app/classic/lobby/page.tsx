"use client"

import GameLobby from "@/components/game-lobby"
import type { DifficultyOption } from "@/components/game-lobby"

const difficultyOptions: DifficultyOption[] = [
  { value: "easy", label: "Easy - Beginner friendly" },
  { value: "medium", label: "Medium - Balanced challenge" },
  { value: "hard", label: "Hard - Strategic opponent" },
  { value: "expert", label: "Expert - Unbeatable AI" },
]

export default function ClassicLobby() {
  return (
    <GameLobby
      slug="classic"
      headerTitle="Classic Tic Tac Toe – Pre-Game Lobby"
      headerSubtitle="Set up your game and get ready to play"
      cpuDifficultyOptions={difficultyOptions}
    />
  )
}
