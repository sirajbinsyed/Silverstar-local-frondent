"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user, changePassword } = useAuth()
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      toast.success("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast.error(error.message || "Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const [now, setNow] = useState<Date | null>(null)

useEffect(() => {
  setNow(new Date())
}, [])


  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1 lg:mb-2">Settings</h1>
        <p className="text-sm lg:text-base text-gray-400">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Account Information - Responsive */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-amber-400">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <div className="space-y-2">
              <Label className="text-amber-300 text-sm lg:text-base">Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-amber-300 text-sm lg:text-base">Role</Label>
              <Input
                value={user?.role || ""}
                disabled
                className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Change Password - Responsive */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-amber-400">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-amber-300 text-sm lg:text-base">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="bg-black/50 border-amber-400/50 text-white pr-10 text-sm lg:text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-amber-400 hover:text-amber-300"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-amber-300 text-sm lg:text-base">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-black/50 border-amber-400/50 text-white pr-10 text-sm lg:text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-amber-400 hover:text-amber-300"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-amber-300 text-sm lg:text-base">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-black/50 border-amber-400/50 text-white pr-10 text-sm lg:text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-amber-400 hover:text-amber-300"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600 text-sm lg:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2 border-black mr-2"></div>
                    Changing Password...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                    Change Password
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* System Information - Responsive */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl text-amber-400">System Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div className="space-y-2">
              <Label className="text-amber-300 text-sm lg:text-base">Version</Label>
              <p className="text-gray-300 text-sm lg:text-base">1.0.0</p>
            </div>
            <div className="space-y-2">
              <Label className="text-amber-300 text-sm lg:text-base">Last Login</Label>
              <p className="text-gray-300 text-sm lg:text-base">{now ? now.toLocaleDateString() : "Loading..."}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-amber-300 text-sm lg:text-base">Server Status</Label>
              <p className="text-green-400 text-sm lg:text-base">Online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
