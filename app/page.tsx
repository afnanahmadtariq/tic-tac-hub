"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Users, Settings, Home, Gamepad2, Zap, Grid3X3, Target } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"
import Squares from "@/components/ui/sqaures"

export default function GameHub() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()

  const getSquaresColors = (theme: string) => {
    switch (theme) {
      case "light":
        return { borderColor: "#ccc", hoverFillColor: "#ddd" }
      case "arcade":
        return { borderColor: "#00ff00", hoverFillColor: "#00aa00" }
      case "wooden":
        return { borderColor: "#8B4513", hoverFillColor: "#A0522D" }
      default: // dark
        return { borderColor: "#333", hoverFillColor: "#444" }
    }
  }

  const squaresColors = getSquaresColors(theme)

  const games = [
    {
      id: "classic",
      title: "Classic Tic Tac Toe",
      description: "3x3 timeless strategy",
      icon: Grid3X3,
      difficulty: "Easy",
      players: "2 Players",
      boardSize: "3x3 Grid",
      avgTime: "2-5 minutes",
      specialRules: "First to get 3 in a row wins",
    },
    {
      id: "ultimate",
      title: "Ultimate Tic Tac Toe",
      description: "9 boards inside one big board",
      icon: Gamepad2,
      difficulty: "Hard",
      players: "2 Players",
      boardSize: "9x9 Meta Grid",
      avgTime: "15-30 minutes",
      specialRules: "Win smaller boards to control larger ones",
    },
    {
      id: "decay",
      title: "Decay Tic Tac Toe",
      description: "Oldest moves fade after X turns",
      icon: Zap,
      difficulty: "Medium",
      players: "2 Players",
      boardSize: "3x3 Grid",
      avgTime: "5-10 minutes",
      specialRules: "Moves disappear after 5 turns",
    },
    {
      id: "quixo",
      title: "Quixo",
      description: "Slide and align cubes in 5x5",
      icon: Target,
      difficulty: "Hard",
      players: "2 Players",
      boardSize: "5x5 Grid",
      avgTime: "10-20 minutes",
      specialRules: "Slide cubes to create lines of 5",
    },
  ]

  const leaderboardData = [
    { player: "GameMaster", game: "Classic", wins: 127, losses: 23, elo: 1847 },
    { player: "TicTacPro", game: "Ultimate", wins: 89, losses: 34, elo: 1723 },
    { player: "StrategyKing", game: "Quixo", wins: 156, losses: 67, elo: 1689 },
    { player: "QuickThink", game: "Decay", wins: 78, losses: 45, elo: 1567 },
    { player: "BoardLord", game: "Classic", wins: 234, losses: 123, elo: 1534 },
  ]

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "friends", label: "Friends", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor={squaresColors.borderColor}
          squareSize={40}
          hoverFillColor={squaresColors.hoverFillColor}
        />
      </div>
      <header className="bg-card border-b border-border relative z-10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <Image src="/logo.png" alt="GameHub" width={36} height={36} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-balance">Tic Tac Hub</h1>
              <p className="text-xs text-muted-foreground">Play Board Games Online</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Theme Switcher */}
          <div className="flex items-center gap-2">
            <Label htmlFor="theme" className="text-sm">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="arcade">Arcade</SelectItem>
                <SelectItem value="wooden">Wooden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <main className="overflow-auto relative z-10">
        <div className="p-8">
          {/* Home Section */}
          {activeSection === "home" && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-balance">Choose Your Game</h2>
                <p className="text-muted-foreground text-pretty">
                  Challenge friends, play against AI, or practice locally
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => {
                  const IconComponent = game.icon
                  return (
                    <Card
                      key={game.id}
                      className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                          >
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl mb-2">{game.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {game.difficulty}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {game.players}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-pretty mt-3 text-sm leading-relaxed">
                          {game.description}
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Board Size:</span>
                            <span className="font-medium">{game.boardSize}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Avg. Time:</span>
                            <span className="font-medium">{game.avgTime}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Special Rules:</span>
                            <p className="font-medium mt-1 leading-tight">{game.specialRules}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Link href={`/${game.id}/lobby`} className="block">
                          <Button size="sm" className="w-full group-hover:bg-primary/90 transition-colors">
                            Play Now
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Leaderboard Section */}
          {activeSection === "leaderboard" && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-balance">Leaderboard</h2>
                <p className="text-muted-foreground">Top players across all games</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Global Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead className="text-center">Wins</TableHead>
                        <TableHead className="text-center">Losses</TableHead>
                        <TableHead className="text-center">ELO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((player, index) => (
                        <TableRow key={player.player}>
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell className="font-medium">{player.player}</TableCell>
                          <TableCell>{player.game}</TableCell>
                          <TableCell className="text-center text-green-400">{player.wins}</TableCell>
                          <TableCell className="text-center text-red-400">{player.losses}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{player.elo}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Friends Section */}
          {activeSection === "friends" && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-balance">Friends</h2>
                <p className="text-muted-foreground">Connect with other players</p>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Users className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Friends Yet</h3>
                  <p className="text-muted-foreground text-center mb-6 text-pretty">
                    Add friends to challenge them to games and track your progress together
                  </p>
                  <Button>Add Friends</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-balance">Settings</h2>
                <p className="text-muted-foreground">Customize your gaming experience</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="arcade">Arcade</SelectItem>
                          <SelectItem value="wooden">Wooden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audio & Visual</CardTitle>
                    <CardDescription>Control sounds and animations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sound">Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">Play sounds for moves and wins</p>
                      </div>
                      <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="animations">Animations</Label>
                        <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                      </div>
                      <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center pt-6">
                <Button size="lg">Save Settings</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
