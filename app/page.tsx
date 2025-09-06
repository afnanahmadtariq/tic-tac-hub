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
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"

export default function GameHub() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()

  const games = [
    {
      id: "classic",
      title: "Classic Tic Tac Toe",
      description: "3x3 timeless strategy",
      icon: Grid3X3,
      difficulty: "Easy",
      players: "2 Players",
    },
    {
      id: "ultimate",
      title: "Ultimate Tic Tac Toe",
      description: "9 boards inside one big board",
      icon: Gamepad2,
      difficulty: "Hard",
      players: "2 Players",
    },
    {
      id: "decay",
      title: "Decay Tic Tac Toe",
      description: "Oldest moves fade after X turns",
      icon: Zap,
      difficulty: "Medium",
      players: "2 Players",
    },
    {
      id: "quixo",
      title: "Quixo",
      description: "Slide and align cubes in 5x5",
      icon: Target,
      difficulty: "Hard",
      players: "2 Players",
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
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 bg-primary rounded-lg flex items-center justify-center ${theme === "arcade" ? "glow" : ""}`}
            >
              🎮
            </div>
            <div>
              <h1 className="text-xl font-bold text-balance">GameHub</h1>
              <p className="text-xs text-muted-foreground">Board Games</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Theme Switcher Footer */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="sidebar-theme" className="text-sm">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="sidebar-theme" className="w-full">
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
      </aside>

      <main className="flex-1 overflow-auto">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {games.map((game) => {
                  const IconComponent = game.icon
                  return (
                    <Card
                      key={game.id}
                      className={`group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${theme === "arcade" ? "pulse-glow" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors ${theme === "arcade" ? "glow" : ""}`}
                            >
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{game.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {game.difficulty}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {game.players}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-pretty">{game.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Link href={`/${game.id}/lobby`} className="flex-1">
                            <Button size="sm" className="w-full">
                              Local
                            </Button>
                          </Link>
                          <Link href={`/${game.id}/lobby`} className="flex-1">
                            <Button size="sm" variant="secondary" className="w-full">
                              CPU
                            </Button>
                          </Link>
                          <Link href={`/${game.id}/lobby`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full bg-transparent">
                              Online
                            </Button>
                          </Link>
                        </div>
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
