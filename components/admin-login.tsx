"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Lock } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Login attempt:", credentials)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
      </div>

      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Star className="w-8 h-8 text-amber-400 fill-current mr-2" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Admin Panel
            </CardTitle>
            <Star className="w-8 h-8 text-amber-400 fill-current ml-2" />
          </div>
          <p className="text-amber-300">Hotel Silver Star</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-amber-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="bg-black/50 border-amber-400/50 text-white focus:border-amber-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="bg-black/50 border-amber-400/50 text-white focus:border-amber-400"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
