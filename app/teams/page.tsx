"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, MapPin, Calendar, Trophy } from "lucide-react"

interface Team {
  id: string
  name: string
  founded: string
  stadium: string
  league: string
  description: string
  color: string
  recentMatches: Array<{
    opponent: string
    result: string
    date: string
  }>
}

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Arsenal",
    founded: "1886",
    stadium: "Emirates Stadium",
    league: "Premier League",
    color: "#DC2626",
    description: "Arsenal Football Club is a professional football club based in Islington, London, England.",
    recentMatches: [
      { opponent: "Chelsea", result: "W 2-1", date: "2025-01-07" },
      { opponent: "Liverpool", result: "D 1-1", date: "2025-01-04" },
      { opponent: "Man City", result: "L 0-2", date: "2025-01-01" },
      { opponent: "Tottenham", result: "W 3-1", date: "2024-12-28" },
      { opponent: "Brighton", result: "W 2-0", date: "2024-12-25" },
    ],
  },
  {
    id: "2",
    name: "Chelsea",
    founded: "1905",
    stadium: "Stamford Bridge",
    league: "Premier League",
    color: "#1D4ED8",
    description: "Chelsea Football Club is a professional football club based in Fulham, West London, England.",
    recentMatches: [
      { opponent: "Arsenal", result: "L 1-2", date: "2025-01-07" },
      { opponent: "Newcastle", result: "W 3-0", date: "2025-01-04" },
      { opponent: "Aston Villa", result: "W 2-1", date: "2025-01-01" },
      { opponent: "West Ham", result: "D 2-2", date: "2024-12-28" },
      { opponent: "Everton", result: "W 4-0", date: "2024-12-25" },
    ],
  },
  {
    id: "3",
    name: "Manchester United",
    founded: "1878",
    stadium: "Old Trafford",
    league: "Premier League",
    color: "#DC2626",
    description:
      "Manchester United Football Club is a professional football club based in Old Trafford, Greater Manchester, England.",
    recentMatches: [
      { opponent: "Liverpool", result: "D 0-0", date: "2025-01-08" },
      { opponent: "Man City", result: "L 1-3", date: "2025-01-05" },
      { opponent: "Tottenham", result: "W 2-1", date: "2025-01-02" },
      { opponent: "Arsenal", result: "L 0-1", date: "2024-12-29" },
      { opponent: "Chelsea", result: "W 3-2", date: "2024-12-26" },
    ],
  },
  {
    id: "4",
    name: "Liverpool",
    founded: "1892",
    stadium: "Anfield",
    league: "Premier League",
    color: "#DC2626",
    description: "Liverpool Football Club is a professional football club based in Liverpool, England.",
    recentMatches: [
      { opponent: "Man United", result: "D 0-0", date: "2025-01-08" },
      { opponent: "Arsenal", result: "D 1-1", date: "2025-01-04" },
      { opponent: "Chelsea", result: "W 2-0", date: "2025-01-01" },
      { opponent: "Newcastle", result: "W 3-1", date: "2024-12-28" },
      { opponent: "Brighton", result: "W 1-0", date: "2024-12-25" },
    ],
  },
  {
    id: "5",
    name: "Manchester City",
    founded: "1880",
    stadium: "Etihad Stadium",
    league: "Premier League",
    color: "#0EA5E9",
    description: "Manchester City Football Club is a professional football club based in Manchester, England.",
    recentMatches: [
      { opponent: "Tottenham", result: "W 3-0", date: "2025-01-06" },
      { opponent: "Man United", result: "W 3-1", date: "2025-01-05" },
      { opponent: "Arsenal", result: "W 2-0", date: "2025-01-01" },
      { opponent: "Liverpool", result: "L 1-2", date: "2024-12-28" },
      { opponent: "Chelsea", result: "D 1-1", date: "2024-12-25" },
    ],
  },
  {
    id: "6",
    name: "Tottenham",
    founded: "1882",
    stadium: "Tottenham Hotspur Stadium",
    league: "Premier League",
    color: "#1E40AF",
    description: "Tottenham Hotspur Football Club is a professional football club based in North London, England.",
    recentMatches: [
      { opponent: "Man City", result: "L 0-3", date: "2025-01-06" },
      { opponent: "Man United", result: "L 1-2", date: "2025-01-02" },
      { opponent: "Arsenal", result: "L 1-3", date: "2024-12-28" },
      { opponent: "Chelsea", result: "W 2-1", date: "2024-12-25" },
      { opponent: "Liverpool", result: "D 1-1", date: "2024-12-22" },
    ],
  },
]

const teamColors = ["#DC2626", "#1D4ED8", "#059669", "#7C3AED", "#EA580C", "#0891B2"]

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [filteredTeams, setFilteredTeams] = useState<Team[]>(mockTeams)
  const [searchTerm, setSearchTerm] = useState("")
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteTeams")
    if (savedFavorites) {
      setFavoriteTeams(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.league.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredTeams(filtered)
    } else {
      setFilteredTeams(teams)
    }
  }, [teams, searchTerm])

  const toggleFavoriteTeam = (teamId: string) => {
    const newFavorites = favoriteTeams.includes(teamId)
      ? favoriteTeams.filter((id) => id !== teamId)
      : [...favoriteTeams, teamId]

    setFavoriteTeams(newFavorites)
    localStorage.setItem("favoriteTeams", JSON.stringify(newFavorites))
  }

  const searchTeamAPI = async (teamName: string) => {
    if (!teamName.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`,
      )
      const data = await response.json()

      if (data.teams && data.teams.length > 0) {
        const apiTeam = data.teams[0]
        const randomColor = teamColors[Math.floor(Math.random() * teamColors.length)]
        const newTeam: Team = {
          id: apiTeam.idTeam,
          name: apiTeam.strTeam,
          founded: apiTeam.intFormedYear || "Unknown",
          stadium: apiTeam.strStadium || "Unknown",
          league: apiTeam.strLeague || "Unknown",
          color: randomColor,
          description: apiTeam.strDescriptionEN || "No description available",
          recentMatches: [],
        }

        const existingTeam = teams.find((t) => t.id === newTeam.id)
        if (!existingTeam) {
          setTeams((prev) => [...prev, newTeam])
        }
      }
    } catch (error) {
      console.error("Error fetching team data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      searchTeamAPI(searchTerm)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Teams</h1>
        <p className="text-muted-foreground">Discover teams and their profiles</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for teams (e.g., Arsenal, Barcelona)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary">{team.league}</Badge>
                <Button variant="ghost" size="sm" onClick={() => toggleFavoriteTeam(team.id)} className="p-1">
                  <Star
                    className={`h-4 w-4 ${favoriteTeams.includes(team.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
                </Button>
              </div>
              <div className="mx-auto mb-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.charAt(0)}
                </div>
              </div>
              <CardTitle className="text-xl">{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Founded: {team.founded}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{team.stadium}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>{team.league}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{team.description}</p>

                {team.recentMatches.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Recent Matches</h4>
                    <div className="space-y-1">
                      {team.recentMatches.slice(0, 3).map((match, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>vs {match.opponent}</span>
                          <Badge
                            variant={
                              match.result.startsWith("W")
                                ? "default"
                                : match.result.startsWith("D")
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {match.result}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No teams found</p>
          <p className="text-sm text-muted-foreground mt-2">Try searching for a team using the search bar above</p>
        </div>
      )}
    </div>
  )
}
