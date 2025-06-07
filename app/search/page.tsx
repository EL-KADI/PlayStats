"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, Star, MapPin, Calendar } from "lucide-react"

interface SearchResult {
  id: string
  name: string
  type: "team"
  league: string
  founded: string
  stadium: string
  color: string
  description: string
}

const teamColors = ["#DC2626", "#1D4ED8", "#059669", "#7C3AED", "#EA580C", "#0891B2"]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const searchAPI = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setHasSearched(true)

    try {
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await response.json()

      if (data.teams && data.teams.length > 0) {
        const searchResults: SearchResult[] = data.teams.map((team: any) => ({
          id: team.idTeam,
          name: team.strTeam,
          type: "team" as const,
          league: team.strLeague || "Unknown League",
          founded: team.intFormedYear || "Unknown",
          stadium: team.strStadium || "Unknown Stadium",
          color: teamColors[Math.floor(Math.random() * teamColors.length)],
          description: team.strDescriptionEN || "No description available",
        }))
        setResults(searchResults)
      } else {
        setResults([])
        setError(
          `No results found for "${query}". Try searching for popular teams like Arsenal, Barcelona, or Manchester United.`,
        )
      }
    } catch (err) {
      setError("Failed to search. Please check your connection and try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchAPI(searchTerm)
  }

  const addToFavorites = (teamId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteTeams") || "[]")
    if (!favorites.includes(teamId)) {
      const newFavorites = [...favorites, teamId]
      localStorage.setItem("favoriteTeams", JSON.stringify(newFavorites))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search Teams</h1>
        <p className="text-muted-foreground">Search for teams from around the world using TheSportsDB API</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for teams (e.g., Arsenal, Barcelona, Real Madrid)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !searchTerm.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Search for Teams</h3>
          <p className="text-muted-foreground mb-4">
            Use the search bar above to find teams from leagues around the world
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Arsenal")}>
              Arsenal
            </Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Barcelona")}>
              Barcelona
            </Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Real Madrid")}>
              Real Madrid
            </Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Manchester United")}>
              Manchester United
            </Badge>
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm("Liverpool")}>
              Liverpool
            </Badge>
          </div>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No teams found for your search</p>
          <p className="text-sm text-muted-foreground mt-2">Try searching with different keywords</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary">{team.league}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => addToFavorites(team.id)} className="p-1">
                    <Star className="h-4 w-4" />
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

                  <div className="text-sm font-medium text-blue-600">{team.league}</div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{team.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Search Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Try searching for popular team names like "Arsenal", "Barcelona", or "Real Madrid"</li>
          <li>• Search works best with exact or partial team names</li>
          <li>• Results are powered by TheSportsDB API and include teams from various leagues</li>
          <li>• Click the star icon to add teams to your favorites</li>
        </ul>
      </div>
    </div>
  )
}
