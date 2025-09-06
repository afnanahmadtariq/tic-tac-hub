"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

type CellState = "X" | "O" | null
type BoardState = CellState[]
type UltimateGameState = BoardState[]

export default function UltimateTicTacToe() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "local"
  const { theme } = useTheme()

  const [gameState, setGameState] = useState<UltimateGameState>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [activeBoard, setActiveBoard] = useState<number | null>(null)
  const [boardWinners, setBoardWinners] = useState<(CellState | "draw")[]>(Array(9).fill(null))
  const [gameWinner, setGameWinner] = useState<"X" | "O" | "draw" | null>(null)

  const checkBoardWinner = (board: BoardState): "X" | "O" | "draw" | null => {
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

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (gameWinner || boardWinners[boardIndex] || gameState[boardIndex][cellIndex]) return
    if (activeBoard !== null && activeBoard !== boardIndex) return

    const newGameState = gameState.map((board, bIndex) =>
      bIndex === boardIndex ? board.map((cell, cIndex) => (cIndex === cellIndex ? currentPlayer : cell)) : board,
    )

    setGameState(newGameState)

    // Check if this board is won
    const boardWinner = checkBoardWinner(newGameState[boardIndex])
    if (boardWinner) {
      const newBoardWinners = [...boardWinners]
      newBoardWinners[boardIndex] = boardWinner
      setBoardWinners(newBoardWinners)

      // Check if game is won
      const ultimateWinner = checkBoardWinner(newBoardWinners as CellState[])
      if (ultimateWinner) {
        setGameWinner(ultimateWinner)
      }
    }

    // Set next active board
    const nextBoard = boardWinners[cellIndex] ? null : cellIndex
    setActiveBoard(nextBoard)

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  const restartGame = () => {
    setGameState(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(null)),
    )
    setCurrentPlayer("X")
    setActiveBoard(null)
    setBoardWinners(Array(9).fill(null))
    setGameWinner(null)
  }

  const getStatusText = () => {
    if (gameWinner === "draw") return "Ultimate draw!"
    if (gameWinner) return `Player ${gameWinner} wins the ultimate game!`
    if (activeBoard !== null) return `Player ${currentPlayer} must play in board ${activeBoard + 1}`
    return `Player ${currentPlayer} can play in any available board`
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
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Ultimate Tic Tac Toe</h1>
                <p className="text-sm text-muted-foreground">
                  9 boards inside one big board • {mode.toUpperCase()} Mode
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
        <div className="w-full max-w-2xl">
          <div
            className={`grid grid-cols-3 gap-4 p-6 bg-card rounded-xl border border-border ${theme === "arcade" ? "pulse-glow" : ""}`}
          >
            {gameState.map((board, boardIndex) => (
              <div
                key={boardIndex}
                className={`
                  grid grid-cols-3 gap-1 p-2 rounded-lg border-2 transition-all duration-200
                  ${activeBoard === boardIndex ? "border-primary bg-primary/5" : "border-border bg-background"}
                  ${boardWinners[boardIndex] ? "opacity-60" : ""}
                `}
              >
                {boardWinners[boardIndex] ? (
                  <div className="col-span-3 flex items-center justify-center h-20">
                    <span
                      className={`text-3xl font-bold ${
                        boardWinners[boardIndex] === "X"
                          ? "text-blue-500"
                          : boardWinners[boardIndex] === "O"
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {boardWinners[boardIndex] === "draw" ? "Draw" : boardWinners[boardIndex]}
                    </span>
                  </div>
                ) : (
                  board.map((cell, cellIndex) => (
                    <button
                      key={cellIndex}
                      onClick={() => handleCellClick(boardIndex, cellIndex)}
                      className={`
                        aspect-square bg-muted border border-border rounded
                        flex items-center justify-center text-sm font-bold
                        hover:bg-muted/80 transition-all duration-200
                        ${
                          !cell && !gameWinner && (activeBoard === null || activeBoard === boardIndex)
                            ? "hover:scale-105 cursor-pointer"
                            : "cursor-default"
                        }
                        ${cell === "X" ? "text-blue-500" : cell === "O" ? "text-red-500" : ""}
                        ${theme === "arcade" && cell ? "glow" : ""}
                      `}
                      disabled={!!cell || !!gameWinner || (activeBoard !== null && activeBoard !== boardIndex)}
                    >
                      {cell}
                    </button>
                  ))
                )}
              </div>
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
