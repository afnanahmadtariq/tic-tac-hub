"use client"

import GameLobby, { type DifficultyOption } from "@/components/game-lobby"

const difficultyOptions: DifficultyOption[] = [
  { value: "easy", label: "Easy - Beginner friendly" },
  { value: "medium", label: "Medium - Balanced challenge" },
  { value: "hard", label: "Hard - Strategic opponent" },
  { value: "expert", label: "Expert - Quixo grandmaster" },
]

const displayStyle = "flat"

export default function QuixoLobby() {
  return (
    <GameLobby
      slug="quixo"
      headerTitle="Quixo – Pre-Game Lobby"
      headerSubtitle="Configure your cube-sliding strategy game"
      cpuDifficultyOptions={difficultyOptions}
      buildExtraParams={() => ({ display: displayStyle })}
    />
  )
}
