"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid3X3 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

type CellState = "X" | "O" | null
type GameState = CellState[]

export default function ClassicTicTacToe() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "local"
  const { theme } = useTheme()

  const [gameState, setGameState] = useState<GameState>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [gameHistory, setGameHistory] = useState<GameState[]>([Array(9).fill(null)])

  const checkWinner = (board: GameState): "X" | "O" | "draw" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "draw"
    }

    return null
  }

  const handleCellClick = (index: number) => {
    if (gameState[index] || winner) return

    const newGameState = [...gameState]
    newGameState[index] = currentPlayer
    setGameState(newGameState)
    setGameHistory([...gameHistory, newGameState])

    const gameWinner = checkWinner(newGameState)
    if (gameWinner) {
      setWinner(gameWinner)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const restartGame = () => {
    setGameState(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setGameHistory([Array(9).fill(null)])
  }

  const undoMove = () => {
    if (gameHistory.length > 1) {
      const newHistory = gameHistory.slice(0, -1)
      const previousState = newHistory[newHistory.length - 1]
      setGameHistory(newHistory)
      setGameState(previousState)
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
      setWinner(null)
    }
  }

  const getStatusText = () => {
    if (winner === "draw") return "It's a draw!"
    if (winner) return `Player ${winner} wins!`
    return `Player ${currentPlayer}'s Turn`
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
                <Grid3X3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Classic Tic Tac Toe</h1>
                <p className="text-sm text-muted-foreground">3x3 timeless strategy • {mode.toUpperCase()} Mode</p>
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
        <div className="w-full max-w-md">
          <div
            className={`grid grid-cols-3 gap-2 p-4 bg-card rounded-xl border border-border ${theme === "arcade" ? "pulse-glow" : ""}`}
          >
            {gameState.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`
                  aspect-square bg-background border-2 border-border rounded-lg
                  flex items-center justify-center text-4xl font-bold
                  hover:bg-muted transition-all duration-200
                  ${!cell && !winner ? "hover:scale-105 cursor-pointer" : "cursor-default"}
                  ${cell === "X" ? "text-blue-500" : cell === "O" ? "text-red-500" : ""}
                  ${theme === "arcade" && cell ? "glow" : ""}
                `}
                disabled={!!cell || !!winner}
              >
                {cell}
              </button>
            ))}
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
              <Button variant="secondary" onClick={undoMove} disabled={gameHistory.length <= 1}>
                Undo
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
