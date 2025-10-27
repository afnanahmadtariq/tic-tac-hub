"use client"

import { useMemo, useState } from "react"
import GameLobby, { type DifficultyOption } from "@/components/game-lobby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Timer } from "lucide-react"

const difficultyOptions: DifficultyOption[] = [
  { value: "easy", label: "Easy - Beginner friendly" },
  { value: "medium", label: "Medium - Balanced challenge" },
  { value: "hard", label: "Hard - Strategic opponent" },
  { value: "expert", label: "Expert - Decay master" },
]

export default function DecayLobby() {
  const { theme } = useTheme()
  const [moveLifespan, setMoveLifespan] = useState(7)

  const additionalSettings = useMemo(
    () => (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Decay Settings
          </CardTitle>
          <CardDescription>Customize how long moves stay on the board</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moveLifespan">Move Lifespan: {moveLifespan} turns</Label>
              <Slider
                id="moveLifespan"
                min={3}
                max={12}
                step={1}
                value={[moveLifespan]}
                onValueChange={(value) => setMoveLifespan(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Moves will disappear after {moveLifespan} turns. Lower values create faster, more dynamic gameplay.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    [moveLifespan, theme],
  )

  return (
    <GameLobby
      slug="decay"
      headerTitle="Decaying Tic Tac Toe – Pre-Game Lobby"
      headerSubtitle="Configure your time-limited strategy game"
      cpuDifficultyOptions={difficultyOptions}
      additionalSettings={additionalSettings}
      buildExtraParams={() => ({ lifespan: moveLifespan })}
    />
  )
}
