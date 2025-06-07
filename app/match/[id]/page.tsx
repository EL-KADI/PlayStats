"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Star, Goal, Users, Activity } from "lucide-react"

interface MatchEvent {
  id: string
  type: "goal" | "yellow_card" | "red_card" | "substitution"
  player: string
  team: string
  minute: number
  assist?: string
}

interface MatchStats {
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  shotsOnTarget: { home: number; away: number }
  fouls: { home: number; away: number }
  corners: { home: number; away: number }
  yellowCards: { home: number; away: number }
}

interface MatchDetail {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  time: string
  status: string
  competition: string
  venue: string
  events: MatchEvent[]
  stats: MatchStats
}

const mockMatchDetails: Record<string, MatchDetail> = {
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
    venue: "Emirates Stadium",
    events: [
      { id: "1", type: "goal", player: "Saka", team: "Arsenal", minute: 23, assist: "Ødegaard" },
      { id: "2", type: "yellow_card", player: "Silva", team: "Chelsea", minute: 34 },
      { id: "3", type: "goal", player: "Sterling", team: "Chelsea", minute: 56 },
      { id: "4", type: "goal", player: "Jesus", team: "Arsenal", minute: 72, assist: "Martinelli" },
      { id: "5", type: "substitution", player: "Havertz → Mudryk", team: "Chelsea", minute: 78 },
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 14, away: 8 },
      shotsOnTarget: { home: 6, away: 4 },
      fouls: { home: 12, away: 16 },
      corners: { home: 7, away: 3 },
      yellowCards: { home: 2, away: 4 },
    },
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
    venue: "Old Trafford",
    events: [
      { id: "1", type: "goal", player: "Rashford", team: "Manchester United", minute: 34, assist: "Bruno" },
      { id: "2", type: "yellow_card", player: "Casemiro", team: "Manchester United", minute: 45 },
      { id: "3", type: "goal", player: "Salah", team: "Liverpool", minute: 67 },
      { id: "4", type: "yellow_card", player: "Van Dijk", team: "Liverpool", minute: 78 },
    ],
    stats: {
      possession: { home: 45, away: 55 },
      shots: { home: 10, away: 12 },
      shotsOnTarget: { home: 4, away: 5 },
      fouls: { home: 14, away: 11 },
      corners: { home: 5, away: 8 },
      yellowCards: { home: 3, away: 2 },
    },
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
    venue: "Etihad Stadium",
    events: [
      { id: "1", type: "goal", player: "Haaland", team: "Manchester City", minute: 15, assist: "De Bruyne" },
      { id: "2", type: "goal", player: "Foden", team: "Manchester City", minute: 34 },
      { id: "3", type: "yellow_card", player: "Romero", team: "Tottenham", minute: 56 },
      { id: "4", type: "goal", player: "Haaland", team: "Manchester City", minute: 78, assist: "Grealish" },
    ],
    stats: {
      possession: { home: 68, away: 32 },
      shots: { home: 18, away: 6 },
      shotsOnTarget: { home: 8, away: 2 },
      fouls: { home: 8, away: 15 },
      corners: { home: 9, away: 2 },
      yellowCards: { home: 1, away: 3 },
    },
  },
}

export default function MatchDetailPage() {
  const params = useParams()
  const matchId = params.id as string
  const [match, setMatch] = useState<MatchDetail | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const matchData = mockMatchDetails[matchId]
    if (matchData) {
      setMatch(matchData)
    }

    const favorites = JSON.parse(localStorage.getItem("favoriteMatches") || "[]")
    setIsFavorite(favorites.includes(matchId))
  }, [matchId])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteMatches") || "[]")
    const newFavorites = isFavorite ? favorites.filter((id: string) => id !== matchId) : [...favorites, matchId]

    localStorage.setItem("favoriteMatches", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Match not found</h1>
          <p className="text-muted-foreground mb-4">The requested match could not be found.</p>
          <Link href="/">
            <Button>Back to Matches</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statsData = [
    { name: "Shots", home: match.stats.shots.home, away: match.stats.shots.away },
    { name: "On Target", home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away },
    { name: "Fouls", home: match.stats.fouls.home, away: match.stats.fouls.away },
    { name: "Corners", home: match.stats.corners.home, away: match.stats.corners.away },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Goal className="h-4 w-4 text-green-600" />
      case "yellow_card":
        return <div className="w-3 h-4 bg-yellow-400 rounded-sm" />
      case "red_card":
        return <div className="w-3 h-4 bg-red-500 rounded-sm" />
      case "substitution":
        return <Users className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {match.homeTeam} vs {match.awayTeam}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(match.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {match.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {match.venue}
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={toggleFavorite}>
            <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Badge className="bg-green-500">{match.status}</Badge>
          <Badge variant="secondary">{match.competition}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Final Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  {match.homeScore} - {match.awayScore}
                </div>
                <div className="text-xl text-muted-foreground">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {match.events.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 min-w-16">
                      <span className="font-bold text-sm">{event.minute}'</span>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.player}</div>
                      {event.assist && <div className="text-sm text-muted-foreground">Assist: {event.assist}</div>}
                    </div>
                    <Badge variant="outline">{event.team}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {statsData.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stat.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {stat.home} - {stat.away}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-blue-600">{match.homeTeam}</div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(stat.home / Math.max(stat.home, stat.away)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-red-600">{match.awayTeam}</div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(stat.away / Math.max(stat.home, stat.away)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Possession</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{match.homeTeam}</span>
                  <span className="font-bold text-blue-600">{match.stats.possession.home}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${match.stats.possession.home}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{match.awayTeam}</span>
                  <span className="font-bold text-red-600">{match.stats.possession.away}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-red-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${match.stats.possession.away}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Shots</span>
                  <span className="font-bold">
                    {match.stats.shots.home} - {match.stats.shots.away}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shots on Target</span>
                  <span className="font-bold">
                    {match.stats.shotsOnTarget.home} - {match.stats.shotsOnTarget.away}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fouls</span>
                  <span className="font-bold">
                    {match.stats.fouls.home} - {match.stats.fouls.away}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Corners</span>
                  <span className="font-bold">
                    {match.stats.corners.home} - {match.stats.corners.away}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Yellow Cards</span>
                  <span className="font-bold">
                    {match.stats.yellowCards.home} - {match.stats.yellowCards.away}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goal Scorers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {match.events
                  .filter((event) => event.type === "goal")
                  .map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{goal.player}</div>
                        {goal.assist && <div className="text-sm text-muted-foreground">Assist: {goal.assist}</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{goal.minute}'</div>
                        <div className="text-sm text-muted-foreground">{goal.team}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
