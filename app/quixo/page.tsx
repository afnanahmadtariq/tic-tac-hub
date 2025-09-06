"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

type CubeState = "X" | "O" | "neutral"
type GameState = CubeState[]

export default function Quixo() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "local"
  const { theme } = useTheme()

  const [gameState, setGameState] = useState<GameState>(Array(25).fill("neutral"))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [selectedCube, setSelectedCube] = useState<number | null>(null)

  const checkWinner = (board: GameState): "X" | "O" | "draw" | null => {
    const lines = [
      // Rows
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      // Columns
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      // Diagonals
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ]

    for (const line of lines) {
      const values = line.map((i) => board[i])
      if (values.every((v) => v === "X")) return "X"
      if (values.every((v) => v === "O")) return "O"
    }

    return null
  }

  const isEdgeCube = (index: number): boolean => {
    const row = Math.floor(index / 5)
    const col = index % 5
    return row === 0 || row === 4 || col === 0 || col === 4
  }

  const canSelectCube = (index: number): boolean => {
    if (!isEdgeCube(index)) return false
    const cube = gameState[index]
    return cube === "neutral" || cube === currentPlayer
  }

  const handleCubeClick = (index: number) => {
    if (winner) return

    if (selectedCube === null) {
      if (canSelectCube(index)) {
        setSelectedCube(index)
      }
    } else {
      if (index === selectedCube) {
        setSelectedCube(null)
      } else if (canSelectCube(index)) {
        setSelectedCube(index)
      }
    }
  }

  const handlePush = (direction: "up" | "down" | "left" | "right") => {
    if (selectedCube === null || winner) return

    const newGameState = [...gameState]
    const row = Math.floor(selectedCube / 5)
    const col = selectedCube % 5

    // Set the selected cube to current player
    newGameState[selectedCube] = currentPlayer

    // Simulate pushing logic (simplified)
    // In a real implementation, you'd shift the entire row/column

    setGameState(newGameState)
    setSelectedCube(null)

    const gameWinner = checkWinner(newGameState)
    if (gameWinner) {
      setWinner(gameWinner)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const restartGame = () => {
    setGameState(Array(25).fill("neutral"))
    setCurrentPlayer("X")
    setWinner(null)
    setSelectedCube(null)
  }

  const getStatusText = () => {
    if (winner === "draw") return "It's a draw!"
    if (winner) return `Player ${winner} wins!`
    if (selectedCube !== null) return `Push the cube from an edge (${currentPlayer})`
    return `Select a cube and push it from an edge (${currentPlayer})`
  }

  const getCubeDisplay = (cube: CubeState) => {
    if (cube === "neutral") return ""
    return cube
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center ${theme === "arcade" ? "glow" : ""}`}
              >
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Quixo</h1>
                <p className="text-sm text-muted-foreground">
                  Slide and align cubes in 5x5 • {mode.toUpperCase()} Mode
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="secondary">Back to Hub</Button>
              </Link>
              <Button onClick={restartGame}>Restart</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div
            className={`grid grid-cols-5 gap-2 p-4 bg-card rounded-xl border border-border ${theme === "arcade" ? "pulse-glow" : ""}`}
          >
            {gameState.map((cube, index) => (
              <button
                key={index}
                onClick={() => handleCubeClick(index)}
                className={`
                  aspect-square border-2 rounded-lg
                  flex items-center justify-center text-2xl font-bold
                  transition-all duration-200
                  ${selectedCube === index ? "border-primary bg-primary/20 scale-105" : "border-border"}
                  ${canSelectCube(index) && !winner ? "hover:bg-muted cursor-pointer" : "cursor-default"}
                  ${
                    cube === "X"
                      ? "text-blue-500 bg-blue-500/10"
                      : cube === "O"
                        ? "text-red-500 bg-red-500/10"
                        : "bg-background"
                  }
                  ${theme === "arcade" && cube !== "neutral" ? "glow" : ""}
                  ${!isEdgeCube(index) ? "opacity-60" : ""}
                `}
                disabled={!!winner}
              >
                {getCubeDisplay(cube)}
              </button>
            ))}
          </div>

          {/* Push Controls */}
          {selectedCube !== null && (
            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-3 gap-2">
                <div></div>
                <Button size="sm" onClick={() => handlePush("up")}>
                  ↑
                </Button>
                <div></div>
                <Button size="sm" onClick={() => handlePush("left")}>
                  ←
                </Button>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Push</span>
                </div>
                <Button size="sm" onClick={() => handlePush("right")}>
                  →
                </Button>
                <div></div>
                <Button size="sm" onClick={() => handlePush("down")}>
                  ↓
                </Button>
                <div></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-semibold">{getStatusText()}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" disabled>
                Undo
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
