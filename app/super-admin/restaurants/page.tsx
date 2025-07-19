"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Save, X, Search } from "lucide-react"
import { toast } from "sonner"
import { restaurantsAPI } from "@/lib/api" // Assume this is set up like menuAPI

interface Restaurant {
  _id: string
  restaurantName: string
  logoImage: string
  adminId: string
  locationLink: string
  websiteLink: string
  instagramLink: string
  facebookLink: string
  whatsappNumber: string
  phoneNumber: string
  validityOfPlan: string
  planId: string
}

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [formData, setFormData] = useState<Omit<Restaurant, "_id">>({
    restaurantName: "",
    logoImage: "",
    adminId: "",
    locationLink: "",
    websiteLink: "",
    instagramLink: "",
    facebookLink: "",
    whatsappNumber: "",
    phoneNumber: "",
    validityOfPlan: "",
    planId: ""
  })

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const res = await restaurantsAPI.getAll()
      setRestaurants(res.data || [])
    } catch {
      toast.error("Failed to fetch restaurants")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await restaurantsAPI.create(formData)
      toast.success("Restaurant created")
      resetForm()
      fetchRestaurants()
    } catch (err: any) {
      toast.error(err.message || "Failed to create restaurant")
    }
  }

  const handleUpdate = async () => {
    if (!editingRestaurant) return
    try {
      await restaurantsAPI.update(editingRestaurant._id, formData)
      toast.success("Restaurant updated")
      resetForm()
      fetchRestaurants()
    } catch (err: any) {
      toast.error(err.message || "Failed to update restaurant")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return
    try {
      await restaurantsAPI.delete(id)
      toast.success("Restaurant deleted")
      fetchRestaurants()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete restaurant")
    }
  }

  const startEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant)
    setFormData({ ...restaurant })
  }

  const resetForm = () => {
    setEditingRestaurant(null)
    setIsCreating(false)
    setFormData({
      restaurantName: "",
      logoImage: "",
      adminId: "",
      locationLink: "",
      websiteLink: "",
      instagramLink: "",
      facebookLink: "",
      whatsappNumber: "",
      phoneNumber: "",
      validityOfPlan: "",
      planId: ""
    })
  }

  const filteredRestaurants = restaurants.filter((r) =>
    r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">Restaurants</h1>
          <p className="text-gray-400 text-sm">Manage restaurants</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Restaurant
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/50 border-amber-400/50 text-white"
        />
      </div>

      {(isCreating || editingRestaurant) && (
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader>
            <CardTitle className="text-amber-400">{isCreating ? "Create Restaurant" : "Edit Restaurant"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="capitalize text-amber-300 text-sm">{key}</Label>
                <Input
                  value={value}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="bg-black/50 border-amber-400/50 text-white"
                />
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                onClick={isCreating ? handleCreate : handleUpdate}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white flex-1"
              >
                <Save className="w-4 h-4 mr-2" /> {isCreating ? "Create" : "Update"}
              </Button>
              <Button onClick={resetForm} variant="outline" className="flex-1 border-gray-500 text-gray-300">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant._id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-amber-400">{restaurant.restaurantName}</CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => startEdit(restaurant)} variant="outline" className="text-amber-400">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleDelete(restaurant._id)} variant="outline" className="text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {restaurant.logoImage && (
                <img src={restaurant.logoImage} alt={restaurant.restaurantName} className="w-full h-24 object-cover rounded" />
              )}
              <p className="text-gray-400 text-xs">Phone: {restaurant.phoneNumber}</p>
              <p className="text-gray-400 text-xs">Whatsapp: {restaurant.whatsappNumber}</p>
              <p className="text-gray-400 text-xs">Plan Validity: {restaurant.validityOfPlan}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && !isCreating && !editingRestaurant && (
        <div className="text-center text-gray-400 py-8">No restaurants found.</div>
      )}
    </div>
  )
}
