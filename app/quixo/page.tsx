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
  const [animatingCubes, setAnimatingCubes] = useState<Set<number>>(new Set())

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

  const getValidPushDirections = (index: number): Set<"up" | "down" | "left" | "right"> => {
    const row = Math.floor(index / 5)
    const col = index % 5
    const directions = new Set<"up" | "down" | "left" | "right">()

    // Can push from opposite edges in BOTH row and column
    // This gives us up to 3 directions (or 2 for corners)
    
    // Row-based pushes (left/right)
    if (col === 0) {
      // Removed from left, can push from right (into left direction)
      directions.add("left")
    }
    if (col === 4) {
      // Removed from right, can push from left (into right direction)
      directions.add("right")
    }
    
    // Column-based pushes (up/down)
    if (row === 0) {
      // Removed from top, can push from bottom (into up direction)
      directions.add("up")
    }
    if (row === 4) {
      // Removed from bottom, can push from top (into down direction)
      directions.add("down")
    }
    
    // Non-corner edge cubes will have 3 directions
    // Corner cubes will have 2 directions
    // Center can push into same row from opposite column ends
    if (row !== 0 && row !== 4 && (col === 0 || col === 4)) {
      // Top and bottom if on left or right edge (not corner)
      directions.add("up")
      directions.add("down")
    }
    if (col !== 0 && col !== 4 && (row === 0 || row === 4)) {
      // Left and right if on top or bottom edge (not corner)
      directions.add("left")
      directions.add("right")
    }

    return directions
  }

  const handlePush = async (direction: "up" | "down" | "left" | "right") => {
    if (selectedCube === null || winner) return

    const validDirections = getValidPushDirections(selectedCube)
    if (!validDirections.has(direction)) return

    const row = Math.floor(selectedCube / 5)
    const col = selectedCube % 5

    // Determine which cubes will animate
    const cubesToAnimate = new Set<number>()
    
    if (direction === "left") {
      // Shifting row left
      for (let c = col; c <= 4; c++) {
        cubesToAnimate.add(row * 5 + c)
      }
    } else if (direction === "right") {
      // Shifting row right
      for (let c = 0; c <= col; c++) {
        cubesToAnimate.add(row * 5 + c)
      }
    } else if (direction === "up") {
      // Shifting column up
      for (let r = row; r <= 4; r++) {
        cubesToAnimate.add(r * 5 + col)
      }
    } else if (direction === "down") {
      // Shifting column down
      for (let r = 0; r <= row; r++) {
        cubesToAnimate.add(r * 5 + col)
      }
    }

    setAnimatingCubes(cubesToAnimate)

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300))

    const newGameState = [...gameState]

    // Push logic: cube is removed from one edge and inserted from the opposite edge
    if (direction === "left") {
      // Shifting row left
      for (let c = col; c < 4; c++) {
        newGameState[row * 5 + c] = newGameState[row * 5 + c + 1]
      }
      newGameState[row * 5 + 4] = currentPlayer
    } else if (direction === "right") {
      // Shifting row right
      for (let c = col; c > 0; c--) {
        newGameState[row * 5 + c] = newGameState[row * 5 + c - 1]
      }
      newGameState[row * 5] = currentPlayer
    } else if (direction === "up") {
      // Shifting column up
      for (let r = row; r < 4; r++) {
        newGameState[r * 5 + col] = newGameState[(r + 1) * 5 + col]
      }
      newGameState[20 + col] = currentPlayer
    } else if (direction === "down") {
      // Shifting column down
      for (let r = row; r > 0; r--) {
        newGameState[r * 5 + col] = newGameState[(r - 1) * 5 + col]
      }
      newGameState[col] = currentPlayer
    }

    setGameState(newGameState)
    setAnimatingCubes(new Set())
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
    setAnimatingCubes(new Set())
  }

  const getStatusText = () => {
    if (winner === "draw") return "It's a draw!"
    if (winner) return `Player ${winner} wins!`
    if (selectedCube !== null) {
      const validDirs = getValidPushDirections(selectedCube)
      const dirText = Array.from(validDirs).join(", ")
      return `Push ${dirText} (Player ${currentPlayer})`
    }
    return `Select a blank or your cube from the outer ring (Player ${currentPlayer})`
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
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
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
        <div className="w-full max-w-3xl">
          <div className="relative">
            {/* Push Controls - Top Edge */}
            {selectedCube !== null && (() => {
              const validDirections = getValidPushDirections(selectedCube)
              const row = Math.floor(selectedCube / 5)
              const col = selectedCube % 5
              
              return (
                <>
                  {/* Top Push Buttons - Pushes DOWN (cube removed from bottom) */}
                  {validDirections.has("down") && (
                    <div className="absolute -top-12 left-0 right-0 flex justify-center">
                      <div className="flex gap-2 px-4">
                        {[0, 1, 2, 3, 4].map((c) => (
                          <Button
                            key={`top-${c}`}
                            size="sm"
                            onClick={() => handlePush("down")}
                            variant="default"
                            className={`w-[calc((100%-2rem)/5)] transition-all ${c === col ? "opacity-100 animate-pulse" : "opacity-0 pointer-events-none"}`}
                          >
                            ↓
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Push Buttons - Pushes UP (cube removed from top) */}
                  {validDirections.has("up") && (
                    <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
                      <div className="flex gap-2 px-4">
                        {[0, 1, 2, 3, 4].map((c) => (
                          <Button
                            key={`bottom-${c}`}
                            size="sm"
                            onClick={() => handlePush("up")}
                            variant="default"
                            className={`w-[calc((100%-2rem)/5)] transition-all ${c === col ? "opacity-100 animate-pulse" : "opacity-0 pointer-events-none"}`}
                          >
                            ↑
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Left Push Buttons - Pushes RIGHT (cube removed from right) */}
                  {validDirections.has("right") && (
                    <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-center">
                      <div className="flex flex-col gap-2 py-4">
                        {[0, 1, 2, 3, 4].map((r) => (
                          <Button
                            key={`left-${r}`}
                            size="sm"
                            onClick={() => handlePush("right")}
                            variant="default"
                            className={`h-[calc((100%-2rem)/5)] transition-all ${r === row ? "opacity-100 animate-pulse" : "opacity-0 pointer-events-none"}`}
                          >
                            →
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Right Push Buttons - Pushes LEFT (cube removed from left) */}
                  {validDirections.has("left") && (
                    <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-center">
                      <div className="flex flex-col gap-2 py-4">
                        {[0, 1, 2, 3, 4].map((r) => (
                          <Button
                            key={`right-${r}`}
                            size="sm"
                            onClick={() => handlePush("left")}
                            variant="default"
                            className={`h-[calc((100%-2rem)/5)] transition-all ${r === row ? "opacity-100 animate-pulse" : "opacity-0 pointer-events-none"}`}
                          >
                            ←
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            })()}

            {/* Game Grid */}
            <div className="grid grid-cols-5 gap-2 p-4 bg-card rounded-xl border border-border">
              {gameState.map((cube, index) => {
                const isEdge = isEdgeCube(index)
                const isSelectable = canSelectCube(index) && !winner
                const isAnimating = animatingCubes.has(index)
                
                return (
                  <button
                    key={index}
                    onClick={() => handleCubeClick(index)}
                    className={`
                      aspect-square border-2 rounded-lg
                      flex items-center justify-center text-2xl font-bold
                      transition-all duration-300 ease-out
                      ${selectedCube === index ? "border-primary bg-primary/20 scale-105 shadow-lg" : "border-border"}
                      ${isSelectable ? "hover:bg-muted hover:scale-105 cursor-pointer" : "cursor-default"}
                      ${
                        cube === "X"
                          ? "text-blue-500 bg-blue-500/10"
                          : cube === "O"
                            ? "text-red-500 bg-red-500/10"
                            : "bg-background"
                      }
                      ${theme === "arcade" && cube !== "neutral" ? "glow" : ""}
                      ${!isEdge ? "opacity-50" : ""}
                      ${isEdge && cube === "neutral" ? "ring-1 ring-border/50" : ""}
                      ${isAnimating ? "animate-pulse scale-95" : ""}
                    `}
                    disabled={!!winner || isAnimating}
                    style={{
                      transform: selectedCube === index ? "scale(1.05)" : isAnimating ? "scale(0.95)" : "scale(1)",
                    }}
                  >
                    <span className={`transition-all duration-200 ${isAnimating ? "opacity-50" : ""}`}>
                      {getCubeDisplay(cube)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
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
