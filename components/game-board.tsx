"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Undo2, User, Bot, Globe } from "lucide-react"

interface GameBoardProps {
  gameType: string
  gameMode: "local" | "cpu" | "online"
  soundEnabled: boolean
  animationsEnabled: boolean
}

type Player = "X" | "O" | null
type GameState = "playing" | "won" | "draw"

export function GameBoard({ gameType, gameMode, soundEnabled, animationsEnabled }: GameBoardProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [gameState, setGameState] = useState<GameState>("playing")
  const [winner, setWinner] = useState<Player>(null)
  const [moveHistory, setMoveHistory] = useState<number[]>([])
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  const checkWinner = (board: Player[]): Player => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const makeMove = (index: number) => {
    if (board[index] || gameState !== "playing") return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)
    setMoveHistory([...moveHistory, index])

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      setGameState("won")
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }))
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameState("draw")
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setGameState("playing")
    setWinner(null)
    setMoveHistory([])
  }

  const undoMove = () => {
    if (moveHistory.length === 0) return

    const newHistory = [...moveHistory]
    const lastMove = newHistory.pop()!
    const newBoard = [...board]
    newBoard[lastMove] = null

    setBoard(newBoard)
    setMoveHistory(newHistory)
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    setGameState("playing")
    setWinner(null)
  }

  // CPU move logic for single player mode
  useEffect(() => {
    if (gameMode === "cpu" && currentPlayer === "O" && gameState === "playing") {
      const timer = setTimeout(() => {
        const availableMoves = board
          .map((cell, index) => (cell === null ? index : null))
          .filter((val) => val !== null) as number[]
        if (availableMoves.length > 0) {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
          makeMove(randomMove)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameState, gameMode, board])

  const getModeIcon = () => {
    switch (gameMode) {
      case "local":
        return <User className="w-4 h-4" />
      case "cpu":
        return <Bot className="w-4 h-4" />
      case "online":
        return <Globe className="w-4 h-4" />
    }
  }

  const getModeLabel = () => {
    switch (gameMode) {
      case "local":
        return "Local Play"
      case "cpu":
        return "vs Computer"
      case "online":
        return "Online Match"
    }
  }

  return (
    <div className="space-y-6">
      {/* Game Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            {getModeIcon()}
            {getModeLabel()}
          </Badge>
          {gameState === "playing" && (
            <Badge variant="outline">
              Current Player: <span className="ml-1 font-bold">{currentPlayer}</span>
            </Badge>
          )}
          {gameState === "won" && (
            <Badge className="bg-green-600">
              Winner: <span className="ml-1 font-bold">{winner}</span>
            </Badge>
          )}
          {gameState === "draw" && <Badge variant="secondary">Game Draw!</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undoMove} disabled={moveHistory.length === 0}>
            <Undo2 className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => makeMove(index)}
                    disabled={cell !== null || gameState !== "playing" || (gameMode === "cpu" && currentPlayer === "O")}
                    className={`
                      aspect-square bg-card border-2 border-border rounded-lg
                      flex items-center justify-center text-4xl font-bold
                      hover:bg-accent hover:border-accent-foreground/20 
                      transition-all duration-200 disabled:cursor-not-allowed
                      ${animationsEnabled ? "hover:scale-105" : ""}
                      ${cell === "X" ? "text-blue-400" : cell === "O" ? "text-red-400" : "text-muted-foreground"}
                    `}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-semibold">Player X</span>
                <Badge variant="secondary">{scores.X}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400 font-semibold">Player O</span>
                <Badge variant="secondary">{scores.O}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Draws</span>
                <Badge variant="outline">{scores.draws}</Badge>
              </div>
            </CardContent>
          </Card>

          {gameType !== "classic" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                {gameType === "ultimate" && (
                  <p>Play on 9 mini-boards. Your move determines which board your opponent plays on next.</p>
                )}
                {gameType === "decay" && <p>Your moves disappear after 4 turns. Plan carefully!</p>}
                {gameType === "quixo" && (
                  <p>Push cubes from the edges to create a line of 5. Only edge cubes can be moved.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
