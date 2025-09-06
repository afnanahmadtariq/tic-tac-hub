"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

type CellState = "X" | "O" | null
type CellData = {
  value: CellState
  moveNumber: number | null
  expiresAfter: number
}
type GameState = CellData[]

export default function DecayTicTacToe() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "local"
  const { theme } = useTheme()

  const [gameState, setGameState] = useState<GameState>(
    Array(9)
      .fill(null)
      .map(() => ({ value: null, moveNumber: null, expiresAfter: 4 })),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [moveCount, setMoveCount] = useState(0)

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
      if (board[a].value && board[a].value === board[b].value && board[a].value === board[c].value) {
        return board[a].value
      }
    }

    if (board.every((cell) => cell.value !== null)) {
      return "draw"
    }

    return null
  }

  const handleCellClick = (index: number) => {
    if (gameState[index].value || winner) return

    const newMoveCount = moveCount + 1
    const newGameState = gameState.map((cell, i) => {
      if (i === index) {
        return { ...cell, value: currentPlayer, moveNumber: newMoveCount }
      }
      // Check if this move should expire
      if (cell.moveNumber && newMoveCount - cell.moveNumber >= cell.expiresAfter) {
        return { ...cell, value: null, moveNumber: null }
      }
      return cell
    })

    setGameState(newGameState)
    setMoveCount(newMoveCount)

    const gameWinner = checkWinner(newGameState)
    if (gameWinner) {
      setWinner(gameWinner)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const restartGame = () => {
    setGameState(
      Array(9)
        .fill(null)
        .map(() => ({ value: null, moveNumber: null, expiresAfter: 4 })),
    )
    setCurrentPlayer("X")
    setWinner(null)
    setMoveCount(0)
  }

  const getOldestMove = () => {
    const activeMoves = gameState.filter((cell) => cell.value && cell.moveNumber)
    if (activeMoves.length === 0) return null
    return Math.min(...activeMoves.map((cell) => cell.moveNumber!))
  }

  const getStatusText = () => {
    if (winner === "draw") return "It's a draw!"
    if (winner) return `Player ${winner} wins!`
    const oldestMove = getOldestMove()
    if (oldestMove && moveCount - oldestMove >= 3) {
      return `Player ${currentPlayer}'s Turn - Oldest move will disappear next!`
    }
    return `Player ${currentPlayer}'s Turn`
  }

  const getCellOpacity = (cell: CellData) => {
    if (!cell.value || !cell.moveNumber) return 1
    const age = moveCount - cell.moveNumber
    const maxAge = cell.expiresAfter - 1
    return Math.max(0.3, 1 - (age / maxAge) * 0.7)
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
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Decay Tic Tac Toe</h1>
                <p className="text-sm text-muted-foreground">Moves vanish after 4 turns • {mode.toUpperCase()} Mode</p>
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
                  ${!cell.value && !winner ? "hover:scale-105 cursor-pointer" : "cursor-default"}
                  ${cell.value === "X" ? "text-blue-500" : cell.value === "O" ? "text-red-500" : ""}
                  ${theme === "arcade" && cell.value ? "glow" : ""}
                `}
                style={{ opacity: getCellOpacity(cell) }}
                disabled={!!cell.value || !!winner}
              >
                {cell.value}
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
