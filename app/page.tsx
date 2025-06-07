"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  date: string
  time: string
  status: "Scheduled" | "Live" | "Completed"
  competition: string
  venue?: string
}

const mockMatches: Match[] = [
  {
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
  },
  {
    id: "2",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    date: "2025-01-08",
    time: "17:30",
    status: "Scheduled",
    competition: "Premier League",
    venue: "Old Trafford",
  },
  {
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
  },
  {
    id: "4",
    homeTeam: "Newcastle",
    awayTeam: "Brighton",
    date: "2025-01-09",
    time: "20:00",
    status: "Scheduled",
    competition: "Premier League",
    venue: "St. James' Park",
  },
  {
    id: "5",
    homeTeam: "Aston Villa",
    awayTeam: "West Ham",
    homeScore: 1,
    awayScore: 1,
    date: "2025-01-05",
    time: "14:00",
    status: "Completed",
    competition: "Premier League",
    venue: "Villa Park",
  },
]

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>(mockMatches)
  const [filteredMatches, setFilteredMatches] = useState<Match[]>(mockMatches)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteMatches")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    let filtered = matches

    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((match) => match.status.toLowerCase() === statusFilter)
    }

    if (dateFilter !== "all") {
      const today = new Date().toISOString().split("T")[0]
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((match) => match.date === today)
          break
        case "tomorrow":
          filtered = filtered.filter((match) => match.date === tomorrow)
          break
        case "week":
          const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
          filtered = filtered.filter((match) => match.date >= today && match.date <= weekFromNow)
          break
      }
    }

    setFilteredMatches(filtered)
  }, [matches, searchTerm, statusFilter, dateFilter])

  const toggleFavorite = (matchId: string) => {
    const newFavorites = favorites.includes(matchId)
      ? favorites.filter((id) => id !== matchId)
      : [...favorites, matchId]

    setFavorites(newFavorites)
    localStorage.setItem("favoriteMatches", JSON.stringify(newFavorites))
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
        <h1 className="text-4xl font-bold mb-2">Match Schedule</h1>
        <p className="text-muted-foreground">Stay updated with the latest football matches and results</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge className={getStatusColor(match.status)}>{match.status}</Badge>
                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(match.id)} className="p-1">
                  <Star
                    className={`h-4 w-4 ${favorites.includes(match.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
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

                {match.venue && <div className="text-sm text-muted-foreground">{match.venue}</div>}

                <Button className="w-full mt-4" onClick={() => router.push(`/match/${match.id}`)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No matches found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
