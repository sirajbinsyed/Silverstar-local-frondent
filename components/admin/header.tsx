"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black border-b border-amber-400/30 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Title - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <h2 className="text-xl lg:text-2xl font-bold text-amber-400">Admin Panel</h2>
        </div>

        {/* Mobile title */}
        <div className="lg:hidden ml-12">
          <h2 className="text-lg font-bold text-amber-400">Admin</h2>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* User info - Responsive */}
          <div className="flex items-center text-amber-300">
            <User className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            <span className="text-xs lg:text-sm truncate max-w-32 lg:max-w-none">{user?.email}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10 text-xs lg:text-sm px-2 lg:px-3"
          >
            <LogOut className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
