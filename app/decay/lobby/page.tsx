"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Grid3X3, ArrowLeft, HelpCircle, Users, Bot, Globe, Shuffle, Timer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export default function DecayLobby() {
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
  const [moveLifespan, setMoveLifespan] = useState([7])

  const startLocalGame = () => {
    const startingPlayer = randomizeStart ? (Math.random() > 0.5 ? "X" : "O") : "X"
    router.push(
      `/decay?mode=local&playerX=${encodeURIComponent(playerXName)}&playerO=${encodeURIComponent(playerOName)}&start=${startingPlayer}&lifespan=${moveLifespan[0]}`,
    )
  }

  const startCPUGame = () => {
    router.push(
      `/decay?mode=cpu&player=${encodeURIComponent(playerName)}&difficulty=${difficulty}&playerStarts=${playerStarts}&lifespan=${moveLifespan[0]}`,
    )
  }

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedCode(code)
    setIsCreatingRoom(true)
  }

  const joinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/decay?mode=online&room=${roomCode.trim()}&lifespan=${moveLifespan[0]}`)
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
                className={`w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center ${theme === "arcade" ? "glow" : ""}`}
              >
                <Grid3X3 className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Decaying Tic Tac Toe – Pre-Game Lobby</h1>
                <p className="text-sm text-muted-foreground">Configure your time-limited strategy game</p>
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
              <CardTitle className="text-purple-500 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Decay Settings
              </CardTitle>
              <CardDescription>Customize how long moves stay on the board</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moveLifespan">Move Lifespan: {moveLifespan[0]} turns</Label>
                  <Slider
                    id="moveLifespan"
                    min={3}
                    max={12}
                    step={1}
                    value={moveLifespan}
                    onValueChange={setMoveLifespan}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Moves will disappear after {moveLifespan[0]} turns. Lower values create faster, more dynamic
                    gameplay.
                  </p>
                </div>
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
                  <CardTitle className="text-purple-500">Local Multiplayer</CardTitle>
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

                  <Button onClick={startLocalGame} className="w-full bg-purple-500 hover:bg-purple-600" size="lg">
                    Start Local Game
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CPU Mode */}
            <TabsContent value="cpu" className="space-y-6">
              <Card className={`${theme === "arcade" ? "glow-card" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-purple-500">Play Against CPU</CardTitle>
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
                        <SelectItem value="expert">Expert - Decay master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="playerStarts">You start first</Label>
                    <Switch id="playerStarts" checked={playerStarts} onCheckedChange={setPlayerStarts} />
                  </div>

                  <Button onClick={startCPUGame} className="w-full bg-purple-500 hover:bg-purple-600" size="lg">
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
                    <CardTitle className="text-purple-500">Create Room</CardTitle>
                    <CardDescription>Start a new game and invite friends</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isCreatingRoom ? (
                      <Button onClick={createRoom} className="w-full bg-purple-500 hover:bg-purple-600">
                        Create New Room
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Share this code:</p>
                          <p className="text-2xl font-mono font-bold text-purple-500">{generatedCode}</p>
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
                    <CardTitle className="text-purple-500">Join Room</CardTitle>
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
                      className="w-full bg-purple-500 hover:bg-purple-600"
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
