"use client"

import GameLobby, { type DifficultyOption } from "@/components/game-lobby"

const difficultyOptions: DifficultyOption[] = [
  { value: "easy", label: "Easy - Beginner friendly" },
  { value: "medium", label: "Medium - Balanced challenge" },
  { value: "hard", label: "Hard - Strategic opponent" },
  { value: "expert", label: "Expert - Master strategist" },
]

const gridSize = "3"

export default function UltimateLobby() {
  return (
    <GameLobby
      slug="ultimate"
      headerTitle="Ultimate Tic Tac Toe – Pre-Game Lobby"
      headerSubtitle="Configure your ultimate strategy game"
      cpuDifficultyOptions={difficultyOptions}
      buildExtraParams={() => ({ gridSize })}
    />
  )
}
