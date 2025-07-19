"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, Tags, TrendingUp, Users, Building2 } from "lucide-react"
import { menuAPI, categoriesAPI } from "@/lib/api"
import Link from "next/link"

interface Stats {
  totalMenuItems: number
  totalCategories: number
  availableItems: number
  unavailableItems: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMenuItems: 0,
    totalCategories: 0,
    availableItems: 0,
    unavailableItems: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [menuResponse, categoriesResponse] = await Promise.all([menuAPI.getAll(), categoriesAPI.getAll()])

        const menuItems = menuResponse.data || []
        const categories = categoriesResponse.data || []

        setStats({
          totalMenuItems: menuItems.length,
          totalCategories: categories.length,
          availableItems: menuItems.filter((item: any) => item.isAvailable).length,
          unavailableItems: menuItems.filter((item: any) => !item.isAvailable).length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tags,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
    },
    {
      title: "Available Items",
      value: stats.availableItems,
      icon: TrendingUp,
      color: "text-amber-400",
      bgColor: "bg-amber-400/20",
    },
    {
      title: "Unavailable Items",
      value: stats.unavailableItems,
      icon: Users,
      color: "text-red-400",
      bgColor: "bg-red-400/20",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32 lg:h-64">
        <div className="animate-spin rounded-full h-16 w-16 lg:h-32 lg:w-32 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1 lg:mb-2">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-400">Welcome to Silver Star Hotel Admin Panel</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2 p-3 lg:p-6">
              <CardTitle className="text-xs lg:text-sm font-medium text-gray-300 leading-tight">{stat.title}</CardTitle>
              <div className={`p-1 lg:p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-3 w-3 lg:h-4 lg:w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-0">
              <div className={`text-lg lg:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-amber-400">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              <Link
                href="/admin/menu-items"
                className="p-3 lg:p-4 bg-amber-400/10 border border-amber-400/30 rounded-lg hover:bg-amber-400/20 transition-colors text-center"
              >
                <UtensilsCrossed className="h-6 w-6 lg:h-8 lg:w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs lg:text-sm text-amber-300">Manage Menu</p>
              </Link>

              <Link
                href="/admin/categories"
                className="p-3 lg:p-4 bg-amber-400/10 border border-amber-400/30 rounded-lg hover:bg-amber-400/20 transition-colors text-center"
              >
                <Tags className="h-6 w-6 lg:h-8 lg:w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs lg:text-sm text-amber-300">Manage Categories</p>
              </Link>

              <Link
                href="/super-admin/restaurants"
                className="p-3 lg:p-4 bg-amber-400/10 border border-amber-400/30 rounded-lg hover:bg-amber-400/20 transition-colors text-center"
              >
                <Building2 className="h-6 w-6 lg:h-8 lg:w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs lg:text-sm text-amber-300">Manage Restaurants</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-amber-400">System Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm lg:text-base text-gray-300">API Status</span>
                <span className="text-sm lg:text-base text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm lg:text-base text-gray-300">Database</span>
                <span className="text-sm lg:text-base text-green-400">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm lg:text-base text-gray-300">Last Updated</span>
                <span className="text-sm lg:text-base text-gray-400">
                  {now ? now.toLocaleDateString() : "Loading..."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
