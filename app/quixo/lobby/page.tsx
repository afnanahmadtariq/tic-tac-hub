"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Grid3X3, ArrowLeft, HelpCircle, Users, Bot, Globe, Shuffle, Cable as Cube } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export default function QuixoLobby() {
  const router = useRouter()
  const { theme } = useTheme()

  // Local mode state
  const [playerXName, setPlayerXName] = useState("Player X")
  const [playerOName, setPlayerOName] = useState("Player O")
  const [randomizeStart, setRandomizeStart] = useState(false)

  // CPU mode state
  const [playerName, setPlayerName] = useState("Player")
  const [difficulty, setDifficulty] = useState("medium")
  const [playerStarts, setPlayerStarts] = useState(true)

  // Online mode state
  const [roomCode, setRoomCode] = useState("")
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")

  // Game-specific options
  const [displayStyle, setDisplayStyle] = useState("flat")

  const startLocalGame = () => {
    const startingPlayer = randomizeStart ? (Math.random() > 0.5 ? "X" : "O") : "X"
    router.push(
      `/quixo?mode=local&playerX=${encodeURIComponent(playerXName)}&playerO=${encodeURIComponent(playerOName)}&start=${startingPlayer}&display=${displayStyle}`,
    )
  }

  const startCPUGame = () => {
    router.push(
      `/quixo?mode=cpu&player=${encodeURIComponent(playerName)}&difficulty=${difficulty}&playerStarts=${playerStarts}&display=${displayStyle}`,
    )
  }

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedCode(code)
    setIsCreatingRoom(true)
  }

  const joinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/quixo?mode=online&room=${roomCode.trim()}&display=${displayStyle}`)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center ${theme === "arcade" ? "glow" : ""}`}
              >
                <Grid3X3 className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Quixo – Pre-Game Lobby</h1>
                <p className="text-sm text-muted-foreground">Configure your cube-sliding strategy game</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="secondary" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Lobby Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Game-Specific Options */}
          <Card className={`${theme === "arcade" ? "glow-card" : ""}`}>
            <CardHeader>
              <CardTitle className="text-amber-500 flex items-center gap-2">
                <Cube className="w-5 h-5" />
                Display Settings
              </CardTitle>
              <CardDescription>Choose how the game board appears</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="displayStyle">Cube Display Style</Label>
                <Select value={displayStyle} onValueChange={setDisplayStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select display style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Board - Classic 2D view</SelectItem>
                    <SelectItem value="3d">3D Illusion - Perspective cube effect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="local" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="local" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Local
              </TabsTrigger>
              <TabsTrigger value="cpu" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                CPU
              </TabsTrigger>
              <TabsTrigger value="online" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Online
              </TabsTrigger>
            </TabsList>

            {/* Local Mode */}
            <TabsContent value="local" className="space-y-6">
              <Card className={`${theme === "arcade" ? "glow-card" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-amber-500">Local Multiplayer</CardTitle>
                  <CardDescription>Play with a friend on the same device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="playerX">Player X Name</Label>
                      <Input
                        id="playerX"
                        value={playerXName}
                        onChange={(e) => setPlayerXName(e.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="playerO">Player O Name</Label>
                      <Input
                        id="playerO"
                        value={playerOName}
                        onChange={(e) => setPlayerOName(e.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="randomize">Randomize starting player</Label>
                    </div>
                    <Switch id="randomize" checked={randomizeStart} onCheckedChange={setRandomizeStart} />
                  </div>

                  <Button onClick={startLocalGame} className="w-full bg-amber-500 hover:bg-amber-600" size="lg">
                    Start Local Game
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CPU Mode */}
            <TabsContent value="cpu" className="space-y-6">
              <Card className={`${theme === "arcade" ? "glow-card" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-amber-500">Play Against CPU</CardTitle>
                  <CardDescription>Challenge the computer at different difficulty levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Your Name</Label>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy - Beginner friendly</SelectItem>
                        <SelectItem value="medium">Medium - Balanced challenge</SelectItem>
                        <SelectItem value="hard">Hard - Strategic opponent</SelectItem>
                        <SelectItem value="expert">Expert - Quixo grandmaster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="playerStarts">You start first</Label>
                    <Switch id="playerStarts" checked={playerStarts} onCheckedChange={setPlayerStarts} />
                  </div>

                  <Button onClick={startCPUGame} className="w-full bg-amber-500 hover:bg-amber-600" size="lg">
                    Start CPU Game
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Online Mode */}
            <TabsContent value="online" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className={`${theme === "arcade" ? "glow-card" : ""}`}>
                  <CardHeader>
                    <CardTitle className="text-amber-500">Create Room</CardTitle>
                    <CardDescription>Start a new game and invite friends</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isCreatingRoom ? (
                      <Button onClick={createRoom} className="w-full bg-amber-500 hover:bg-amber-600">
                        Create New Room
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Share this code:</p>
                          <p className="text-2xl font-mono font-bold text-amber-500">{generatedCode}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="animate-pulse text-sm text-muted-foreground">Waiting for opponent...</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className={`${theme === "arcade" ? "glow-card" : ""}`}>
                  <CardHeader>
                    <CardTitle className="text-amber-500">Join Room</CardTitle>
                    <CardDescription>Enter a room code to join a game</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomCode">Room Code</Label>
                      <Input
                        id="roomCode"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={joinRoom}
                      className="w-full bg-amber-500 hover:bg-amber-600"
                      disabled={roomCode.length !== 6}
                    >
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <HelpCircle className="w-4 h-4 mr-2" />
              How to Play
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
