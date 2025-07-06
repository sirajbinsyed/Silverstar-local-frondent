"use client"

import { useState, useEffect } from "react"
import { Star, Sparkles, Coffee, UtensilsCrossed } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { categoriesAPI, menuAPI } from "@/lib/api"
import { toast } from "sonner"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  icon: string
  color: string
  isActive: boolean
  sortOrder: number
}

interface MenuItem {
  _id: string
  name: string
  description?: string
  category: {
    _id: string
    name: string
  }
  price: number
  sizes?: {
    quarter?: number
    half?: number
    full?: number
    normal?: number
    schezwan?: number
  }
  image?: {
    url: string
    publicId: string
  }
  isAvailable: boolean
  isVegetarian: boolean
  isSpicy: boolean
  preparationTime: number
  sortOrder: number
}

const iconComponents: Record<string, React.ComponentType<any>> = {
  coffee: Coffee,
  utensils: UtensilsCrossed,
  star: Star,
  // Add more icons as needed
}

export default function SilverStarMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [menuResponse, categoriesResponse] = await Promise.all([
          menuAPI.getAll(),
          categoriesAPI.getAll()
        ])

        const itemsByCategory: Record<string, MenuItem[]> = {}
        menuResponse.data.forEach((item: MenuItem) => {
          const categoryId = item.category._id
          if (!itemsByCategory[categoryId]) {
            itemsByCategory[categoryId] = []
          }
          itemsByCategory[categoryId].push(item)
        })

        setMenuItems(itemsByCategory)
        setCategories(categoriesResponse.data)

        if (categoriesResponse.data.length > 0) {
          setActiveCategory(categoriesResponse.data[0]._id)
        }
      } catch (error: any) {
        toast.error("Failed to fetch data")
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
        setIsLoaded(true)
      }
    }

    fetchData()
  }, [])

  const StarField = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <Star className="w-1 h-1 text-amber-400 fill-current" />
        </div>
      ))}
    </div>
  )

  const FloatingSparkles = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <Sparkles className="w-2 h-2 text-amber-300 fill-current opacity-60" />
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin">
          <Star className="w-12 h-12 text-amber-400 fill-current" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,215,0,0.05)_60deg,transparent_120deg)]" />
      </div>

      <StarField />
      <FloatingSparkles />

      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <div
          className={`transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex justify-center items-center mb-4">
            <Star
              className="w-8 h-8 text-amber-400 fill-current mr-2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent animate-pulse">
              HOTEL SILVER STAR
            </h1>
            <Star
              className="w-8 h-8 text-amber-400 fill-current ml-2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <p className="text-xl md:text-2xl text-amber-300 font-light tracking-wider">DELICIOUS MENU</p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4 animate-pulse" />
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="relative z-10 px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl mx-auto">
          {categories.map((category) => {
            const IconComponent = iconComponents[category.icon] || Star
            return (
              <Button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                variant={activeCategory === category._id ? "default" : "outline"}
                className={`
                  relative overflow-hidden group transition-all duration-300 transform hover:scale-105
                  text-xs sm:text-sm px-2 sm:px-4 py-1 h-8 sm:h-9
                  ${activeCategory === category._id
                    ? `bg-gradient-to-r ${category.color} text-black font-bold shadow-lg shadow-amber-500/25`
                    : "bg-black/50 border-amber-400/50 text-amber-300 hover:bg-amber-400/10"
                  }
                `}
              >
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {category.name}
                {activeCategory === category._id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Menu Items */}
      <main className="relative z-10 px-2 sm:px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {categories.find((cat) => cat._id === activeCategory)?.name} Menu
            </h2>

            {/* Updated grid for 3 cards on mobile */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {menuItems[activeCategory]?.map((item) => (
                <Card
                  key={item._id}
                  className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30 hover:border-amber-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10 backdrop-blur-sm"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.name}
                          className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-40 bg-gray-800 flex items-center justify-center">
                          <UtensilsCrossed className="w-8 h-8 text-amber-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-1 right-1">
                        <Badge className="bg-amber-400 text-black font-bold text-xxs sm:text-xs">
                          ₹{item.sizes ?
                            item.sizes.quarter || item.sizes.normal || item.sizes.full || item.price
                            : item.price}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-2 sm:p-3">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-amber-300 mb-1 group-hover:text-amber-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="text-[16px] sm:text-[18px] md:text-[20px] text-amber-400 font-bold mb-1">
  {item.sizes?.quarter ? '' : `₹${item.price}`}
</div>

                      {item.sizes ? (
                        <div className="space-y-1">
                          {Object.entries(item.sizes)
                            .filter(([_, price]) => price && price > 0) // Only include sizes with price > 0
                            .map(([size, price]) => (
                              <div key={size} className="flex justify-between text-xxs sm:text-xs">
                                <span className="text-gray-300 capitalize">{size}</span>
                                <span className="text-amber-400 font-semibold">₹{price}</span>
                              </div>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 sm:py-8 px-4 border-t border-amber-400/30">
        <div className="flex justify-center items-center mb-2 sm:mb-4">
          <Star className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 fill-current mr-2" />
          <p className="text-sm sm:text-lg text-amber-300 font-semibold">PATTAMBI ROAD, CHERPULASSERY</p>
          <Star className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 fill-current ml-2" />
        </div>
        <p className="text-xs sm:text-sm text-amber-400 font-bold">📞 0466-2281 030 | 9656 093 805</p>
      </footer>
    </div>
  )
}