"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Calendar, Clock, Trash2 } from "lucide-react"
import Link from "next/link"

interface FavoriteMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  date: string
  time: string
  status: string
  competition: string
}

interface FavoriteTeam {
  id: string
  name: string
  league: string
  color: string
  stadium: string
}

const mockMatches: Record<string, FavoriteMatch> = {
  "1": {
    id: "1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    homeScore: 2,
    awayScore: 1,
    date: "2025-01-07",
    time: "15:00",
    status: "Completed",
    competition: "Premier League",
  },
  "2": {
    id: "2",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    homeScore: 1,
    awayScore: 1,
    date: "2025-01-08",
    time: "17:30",
    status: "Completed",
    competition: "Premier League",
  },
  "3": {
    id: "3",
    homeTeam: "Manchester City",
    awayTeam: "Tottenham",
    homeScore: 3,
    awayScore: 0,
    date: "2025-01-06",
    time: "12:30",
    status: "Completed",
    competition: "Premier League",
  },
}

const mockTeams: Record<string, FavoriteTeam> = {
  "1": {
    id: "1",
    name: "Arsenal",
    league: "Premier League",
    color: "#DC2626",
    stadium: "Emirates Stadium",
  },
  "2": {
    id: "2",
    name: "Chelsea",
    league: "Premier League",
    color: "#1D4ED8",
    stadium: "Stamford Bridge",
  },
  "3": {
    id: "3",
    name: "Manchester United",
    league: "Premier League",
    color: "#DC2626",
    stadium: "Old Trafford",
  },
  "4": {
    id: "4",
    name: "Liverpool",
    league: "Premier League",
    color: "#DC2626",
    stadium: "Anfield",
  },
  "5": {
    id: "5",
    name: "Manchester City",
    league: "Premier League",
    color: "#0EA5E9",
    stadium: "Etihad Stadium",
  },
  "6": {
    id: "6",
    name: "Tottenham",
    league: "Premier League",
    color: "#1E40AF",
    stadium: "Tottenham Hotspur Stadium",
  },
}

export default function FavoritesPage() {
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>([])
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([])

  useEffect(() => {
    const savedMatches = localStorage.getItem("favoriteMatches")
    const savedTeams = localStorage.getItem("favoriteTeams")

    if (savedMatches) {
      setFavoriteMatches(JSON.parse(savedMatches))
    }
    if (savedTeams) {
      setFavoriteTeams(JSON.parse(savedTeams))
    }
  }, [])

  const removeFavoriteMatch = (matchId: string) => {
    const newFavorites = favoriteMatches.filter((id) => id !== matchId)
    setFavoriteMatches(newFavorites)
    localStorage.setItem("favoriteMatches", JSON.stringify(newFavorites))
  }

  const removeFavoriteTeam = (teamId: string) => {
    const newFavorites = favoriteTeams.filter((id) => id !== teamId)
    setFavoriteTeams(newFavorites)
    localStorage.setItem("favoriteTeams", JSON.stringify(newFavorites))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-red-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Favorites</h1>
        <p className="text-muted-foreground">Your saved matches and teams</p>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Favorite Matches</TabsTrigger>
          <TabsTrigger value="teams">Favorite Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-6">
          {favoriteMatches.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorite matches yet</h3>
              <p className="text-muted-foreground">
                Start adding matches to your favorites by clicking the star icon on match cards
              </p>
              <Link href="/">
                <Button className="mt-4">Browse Matches</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteMatches.map((matchId) => {
                const match = mockMatches[matchId]
                if (!match) return null

                return (
                  <Card key={matchId} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className={getStatusColor(match.status)}>{match.status}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavoriteMatch(matchId)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">
                        {match.homeTeam} vs {match.awayTeam}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {match.status === "Completed" && (
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {match.homeScore} - {match.awayScore}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(match.date).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {match.time}
                        </div>

                        <div className="text-sm font-medium text-blue-600">{match.competition}</div>

                        <Link href={`/match/${match.id}`}>
                          <Button className="w-full mt-4">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          {favoriteTeams.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorite teams yet</h3>
              <p className="text-muted-foreground">
                Start adding teams to your favorites by clicking the star icon on team profiles
              </p>
              <Link href="/teams">
                <Button className="mt-4">Browse Teams</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTeams.map((teamId) => {
                const team = mockTeams[teamId]
                if (!team) return null

                return (
                  <Card key={teamId} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary">{team.league}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavoriteTeam(teamId)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mx-auto mb-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.name.charAt(0)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">{team.stadium}</p>
                        <p className="text-sm font-medium">{team.league}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
