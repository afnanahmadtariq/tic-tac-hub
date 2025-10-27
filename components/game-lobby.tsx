"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LucideIcon, ArrowLeft, Bot, Globe, Grid3X3, HelpCircle, Shuffle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type DifficultyOption = {
  value: string
  label: string
}

type ColorConfig = {
  text: string
  button: string
  buttonHover: string
  iconBg: string
  icon?: string
}

type Defaults = {
  playerXName?: string
  playerOName?: string
  playerName?: string
  difficulty?: string
  randomizeStart?: boolean
  playerStarts?: boolean
  roomCode?: string
}

type BaseLocalState = {
  playerXName: string
  playerOName: string
  randomizeStart: boolean
  startingPlayer: "X" | "O" | "random"
}

type BaseCpuState = {
  playerName: string
  difficulty: string
  playerStarts: boolean
}

type BaseOnlineState = {
  roomCode: string
}

type BuildExtraParamsContext = {
  local: BaseLocalState
  cpu: BaseCpuState
  online: BaseOnlineState
}

type BuildExtraParams = (
  mode: "local" | "cpu" | "online",
  context: BuildExtraParamsContext,
) => Record<string, string | number | boolean | undefined>

type ContextOverrides = {
  local?: Partial<BaseLocalState>
  cpu?: Partial<BaseCpuState>
  online?: Partial<BaseOnlineState>
}

type CardCopy = {
  title?: string
  description?: string
  buttonLabel?: string
}

type OnlineCopy = {
  createTitle?: string
  createDescription?: string
  createButtonLabel?: string
  waitingLabel?: string
  codeHelpText?: string
  joinTitle?: string
  joinDescription?: string
  joinPlaceholder?: string
  joinButtonLabel?: string
}

type GameLobbyProps = {
  slug: string
  headerTitle: string
  headerSubtitle: string
  cpuDifficultyOptions: DifficultyOption[]
  headerIcon?: LucideIcon
  additionalSettings?: ReactNode
  defaults?: Defaults
  buildExtraParams?: BuildExtraParams
  localCard?: CardCopy
  cpuCard?: CardCopy
  onlineCopy?: OnlineCopy
  helpCtaLabel?: string
}

const defaultLocalCard: Required<CardCopy> = {
  title: "Local Multiplayer",
  description: "Play with a friend on the same device",
  buttonLabel: "Start Local Game",
}

const defaultCpuCard: Required<CardCopy> = {
  title: "Play Against CPU",
  description: "Challenge the computer at different difficulty levels",
  buttonLabel: "Start CPU Game",
}

const defaultOnlineCopy: Required<OnlineCopy> = {
  createTitle: "Create Room",
  createDescription: "Start a new game and invite friends",
  createButtonLabel: "Create New Room",
  waitingLabel: "Waiting for opponent...",
  codeHelpText: "Share this code:",
  joinTitle: "Join Room",
  joinDescription: "Enter a room code to join a game",
  joinPlaceholder: "Enter 6-digit code",
  joinButtonLabel: "Join Room",
}

const DEFAULT_PLAYER_X = "Player X"
const DEFAULT_PLAYER_O = "Player O"
const DEFAULT_PLAYER = "Player"
const DEFAULT_DIFFICULTY = "medium"

export function GameLobby({
  slug,
  headerTitle,
  headerSubtitle,
  cpuDifficultyOptions,
  headerIcon: HeaderIcon = Grid3X3,
  additionalSettings,
  defaults,
  buildExtraParams,
  localCard,
  cpuCard,
  onlineCopy,
  helpCtaLabel = "How to Play",
}: GameLobbyProps) {
  const router = useRouter()
  const { theme } = useTheme()

  const localCardCopy = { ...defaultLocalCard, ...localCard }
  const cpuCardCopy = { ...defaultCpuCard, ...cpuCard }
  const onlineCopyResolved = { ...defaultOnlineCopy, ...onlineCopy }

  const color: ColorConfig = {
    text: "text-primary",
    button: "bg-primary",
    buttonHover: "hover:bg-primary/90",
    iconBg: "bg-primary/10",
    icon: "text-primary",
  }

  const [playerXName, setPlayerXName] = useState(defaults?.playerXName ?? DEFAULT_PLAYER_X)
  const [playerOName, setPlayerOName] = useState(defaults?.playerOName ?? DEFAULT_PLAYER_O)
  const [randomizeStart, setRandomizeStart] = useState(defaults?.randomizeStart ?? false)

  const fallbackDifficulty = cpuDifficultyOptions[0]?.value ?? DEFAULT_DIFFICULTY
  const [playerName, setPlayerName] = useState(defaults?.playerName ?? DEFAULT_PLAYER)
  const [difficulty, setDifficulty] = useState(defaults?.difficulty ?? fallbackDifficulty)
  const [playerStarts, setPlayerStarts] = useState(defaults?.playerStarts ?? true)

  const [roomCode, setRoomCode] = useState(defaults?.roomCode ?? "")
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")

  const getContext = (overrides?: ContextOverrides): BuildExtraParamsContext => ({
    local: {
      playerXName,
      playerOName,
      randomizeStart,
      startingPlayer: randomizeStart ? "random" : "X",
      ...overrides?.local,
    },
    cpu: {
      playerName,
      difficulty,
      playerStarts,
      ...overrides?.cpu,
    },
    online: {
      roomCode,
      ...overrides?.online,
    },
  })

  const createSearchParams = (
    mode: "local" | "cpu" | "online",
    base: Record<string, string>,
    overrides?: ContextOverrides,
  ) => {
    const extra = buildExtraParams?.(mode, getContext(overrides)) ?? {}
    const params = new URLSearchParams(base)
    Object.entries(extra).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return
      params.set(key, String(value))
    })
    return params
  }

  const startLocalGame = () => {
    const startingPlayer = randomizeStart ? (Math.random() > 0.5 ? "X" : "O") : "X"
    const params = createSearchParams(
      "local",
      {
        mode: "local",
        playerX: playerXName,
        playerO: playerOName,
        start: startingPlayer,
      },
      { local: { startingPlayer } },
    )
    router.push(`/${slug}?${params.toString()}`)
  }

  const startCPUGame = () => {
    const params = createSearchParams("cpu", {
      mode: "cpu",
      player: playerName,
      difficulty,
      playerStarts: String(playerStarts),
    })
    router.push(`/${slug}?${params.toString()}`)
  }

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedCode(code)
    setIsCreatingRoom(true)
  }

  const joinRoom = () => {
    const trimmedCode = roomCode.trim()
    if (!trimmedCode) return
    const params = createSearchParams("online", {
      mode: "online",
      room: trimmedCode,
    })
    router.push(`/${slug}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  color.iconBg,
                  theme === "arcade" && "glow",
                )}
              >
                <HeaderIcon className={cn("w-6 h-6", color.icon ?? color.text)} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">{headerTitle}</h1>
                <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
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

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="max-w-2xl mx-auto space-y-6">
          {additionalSettings}

          <Tabs defaultValue="local" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
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

            <TabsContent value="local" className="space-y-6">
              <Card className={cn(theme === "arcade" && "glow-card")}>
                <CardHeader>
                  <CardTitle className={color.text}>{localCardCopy.title}</CardTitle>
                  <CardDescription>{localCardCopy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="playerX">Player X Name</Label>
                      <Input
                        id="playerX"
                        value={playerXName}
                        onChange={(event) => setPlayerXName(event.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="playerO">Player O Name</Label>
                      <Input
                        id="playerO"
                        value={playerOName}
                        onChange={(event) => setPlayerOName(event.target.value)}
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

                  <Button
                    onClick={startLocalGame}
                    className={cn("w-full", color.button, color.buttonHover)}
                    size="lg"
                  >
                    {localCardCopy.buttonLabel}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cpu" className="space-y-6">
              <Card className={cn(theme === "arcade" && "glow-card")}>
                <CardHeader>
                  <CardTitle className={color.text}>{cpuCardCopy.title}</CardTitle>
                  <CardDescription>{cpuCardCopy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Your Name</Label>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(event) => setPlayerName(event.target.value)}
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
                        {cpuDifficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="playerStarts">You start first</Label>
                    <Switch id="playerStarts" checked={playerStarts} onCheckedChange={setPlayerStarts} />
                  </div>

                  <Button
                    onClick={startCPUGame}
                    className={cn("w-full", color.button, color.buttonHover)}
                    size="lg"
                  >
                    {cpuCardCopy.buttonLabel}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="online" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className={cn(theme === "arcade" && "glow-card")}>
                  <CardHeader>
                    <CardTitle className={color.text}>{onlineCopyResolved.createTitle}</CardTitle>
                    <CardDescription>{onlineCopyResolved.createDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isCreatingRoom ? (
                      <Button
                        onClick={createRoom}
                        className={cn("w-full", color.button, color.buttonHover)}
                      >
                        {onlineCopyResolved.createButtonLabel}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{onlineCopyResolved.codeHelpText}</p>
                          <p className={cn("text-2xl font-mono font-bold", color.text)}>{generatedCode}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="animate-pulse text-sm text-muted-foreground">
                            {onlineCopyResolved.waitingLabel}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className={cn(theme === "arcade" && "glow-card")}>
                  <CardHeader>
                    <CardTitle className={color.text}>{onlineCopyResolved.joinTitle}</CardTitle>
                    <CardDescription>{onlineCopyResolved.joinDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomCode">Room Code</Label>
                      <Input
                        id="roomCode"
                        value={roomCode}
                        onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                        placeholder={onlineCopyResolved.joinPlaceholder}
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={joinRoom}
                      className={cn("w-full", color.button, color.buttonHover)}
                      disabled={roomCode.trim().length !== 6}
                    >
                      {onlineCopyResolved.joinButtonLabel}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <HelpCircle className="w-4 h-4 mr-2" />
              {helpCtaLabel}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export type { DifficultyOption, GameLobbyProps }

export default GameLobby
