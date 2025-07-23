"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, Search } from "lucide-react"
import { menuAPI, categoriesAPI } from "@/lib/api"
import { toast } from "sonner"

interface MenuItem {
  _id: string
  name: string
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
  sortOrder: number
}

interface Category {
  _id: string
  name: string
  slug: string
}

// Define the maximum file size in bytes (5MB)
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    sizes: {
      quarter: 0,
      half: 0,
      full: 0,
      normal: 0,
      schezwan: 0,
    },
    isAvailable: true,
    isVegetarian: false,
    sortOrder: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [menuResponse, categoriesResponse] = await Promise.all([menuAPI.getAll(), categoriesAPI.getAll()])
      setMenuItems(menuResponse.data || [])
      setCategories(categoriesResponse.data || [])
    } catch (error: any) {
      toast.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Please fill in Name and Category.")
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("price", formData.price.toString())
      formDataToSend.append("sizes", JSON.stringify(formData.sizes))
      formDataToSend.append("isAvailable", formData.isAvailable.toString())
      formDataToSend.append("isVegetarian", formData.isVegetarian.toString())
      formDataToSend.append("sortOrder", formData.sortOrder.toString())

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      await menuAPI.create(formDataToSend)
      toast.success("Menu item created successfully")
      resetForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to create menu item")
    }
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    if (!formData.name || !formData.category) {
      toast.error("Please fill in Name and Category.")
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("price", formData.price.toString())
      formDataToSend.append("sizes", JSON.stringify(formData.sizes))
      formDataToSend.append("isAvailable", formData.isAvailable.toString())
      formDataToSend.append("isVegetarian", formData.isVegetarian.toString())
      formDataToSend.append("sortOrder", formData.sortOrder.toString())

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      await menuAPI.update(editingItem._id, formDataToSend)
      toast.success("Menu item updated successfully")
      resetForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to update menu item")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return

    try {
      await menuAPI.delete(id)
      toast.success("Menu item deleted successfully")
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete menu item")
    }
  }

  const startEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category._id,
      price: item.price,
      sizes: item.sizes || {
        quarter: 0,
        half: 0,
        full: 0,
        normal: 0,
        schezwan: 0,
      },
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      sortOrder: item.sortOrder,
    })
    setImageFile(null) // Reset image when starting to edit
  }

  const resetForm = () => {
    setEditingItem(null)
    setIsCreating(false)
    setImageFile(null) // Clear the selected image file
    setFormData({
      name: "",
      category: "",
      price: 0,
      sizes: {
        quarter: 0,
        half: 0,
        full: 0,
        normal: 0,
        schezwan: 0,
      },
      isAvailable: true,
      isVegetarian: false,
      sortOrder: 0,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`Image file is too large. Maximum size is 5MB.`);
        // Clear the input if the file is too large to prevent re-selection of the same file
        e.target.value = '';
        setImageFile(null); // Ensure imageFile is null if it's too large
      } else {
        setImageFile(file);
      }
    } else {
      setImageFile(null); // Handle case where user cancels file selection
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === "all" || item.category?._id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32 lg:h-64">
        <div className="animate-spin rounded-full h-16 w-16 lg:h-32 lg:w-32 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1 lg:mb-2">Menu Items</h1>
          <p className="text-sm lg:text-base text-gray-400">Manage your restaurant menu</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Filters - Responsive */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
        <CardContent className="p-3 lg:p-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/50 border-amber-400/50 text-white text-sm lg:text-base"
                />
              </div>
            </div>
            <div className="w-full lg:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form - Responsive */}
      {(isCreating || editingItem) && (
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-amber-400">
              {isCreating ? "Create New Menu Item" : "Edit Menu Item"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-300 text-sm lg:text-base">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base"
                  placeholder="Menu item name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-amber-300 text-sm lg:text-base">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-amber-300 text-sm lg:text-base">
                  Base Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Sizes - Responsive Grid */}
            <div className="space-y-2">
              <Label className="text-amber-300 text-sm lg:text-base">Sizes & Pricing</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                {Object.entries(formData.sizes).map(([size, price]) => (
                  <div key={size} className="space-y-1">
                    <Label className="text-xs text-gray-400 capitalize">{size}</Label>
                    <Input
                      type="number"
                      value={price === undefined || price === null ? 0 : price} // Handle potential undefined/null values
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sizes: {
                            ...formData.sizes,
                            [size]: Number.parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="bg-black/50 border-amber-400/50 text-white text-sm"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-amber-300 text-sm lg:text-base">
                Image
              </Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange} // Use the new handler
                  className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base flex-1"
                />
                {editingItem?.image?.url && !imageFile && ( // Show existing image only if no new file is selected
                  <img
                    src={editingItem.image.url || "/placeholder.svg"}
                    alt="Current"
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                )}
                {imageFile && ( // Show preview of the new selected file
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                )}
              </div>
            </div>

            {/* Switches - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label htmlFor="isAvailable" className="text-amber-300 text-sm lg:text-base">
                  Available
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVegetarian"
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked })}
                />
                <Label htmlFor="isVegetarian" className="text-amber-300 text-sm lg:text-base">
                  Vegetarian
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-amber-300 text-sm lg:text-base">
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number.parseInt(e.target.value) || 0 })}
                  className="bg-black/50 border-amber-400/50 text-white text-sm lg:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={isCreating ? handleCreate : handleUpdate}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white flex-1 sm:flex-none"
                disabled={!formData.name || !formData.category} // Basic validation: require name and category
              >
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? "Create" : "Update"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-gray-500 text-gray-300 flex-1 sm:flex-none"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredItems.map((item) => (
          // This conditional render ensures that only items with a category are displayed
          item.category && (
            <Card key={item._id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base lg:text-lg text-amber-400 truncate">{item.name}</CardTitle>
                    <p className="text-xs lg:text-sm text-gray-400 truncate">{item.category.name}</p>
                  </div>
                  <div className="flex space-x-1 lg:space-x-2 flex-shrink-0 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(item)}
                      className="border-amber-400/50 text-amber-400 p-1 lg:p-2"
                    >
                      <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item._id)}
                      className="border-red-400/50 text-red-400 p-1 lg:p-2"
                    >
                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                {item.image?.url && (
                  <img
                    src={item.image.url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-24 lg:h-32 object-cover rounded mb-3 lg:mb-4"
                  />
                )}
  
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <span className="text-gray-400">Base Price:</span>
                    <span className="text-amber-400 font-semibold">₹{item.price}</span>
                  </div>
  
                  {item.sizes && Object.values(item.sizes).some((price) => price !== undefined && price !== null && price > 0) && (
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs lg:text-sm">Sizes:</span>
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(item.sizes).map(
                          ([size, price]) =>
                            price !== undefined && price !== null && price > 0 && (
                              <div key={size} className="flex justify-between text-xs">
                                <span className="text-gray-300 capitalize truncate">{size}:</span>
                                <span className="text-amber-400">₹{price}</span>
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}
  
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span className={item.isAvailable ? "text-green-400" : "text-red-400"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
  
                  <div className="flex flex-wrap gap-1 lg:gap-2 text-xs">
                    {item.isVegetarian && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">Veg</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !isCreating && !editingItem && (
        <div className="text-center py-8 lg:py-12">
          <div className="text-4xl lg:text-6xl mb-4">🍽️</div>
          <p className="text-gray-400 text-sm lg:text-base">No menu items found. Click "Add Menu Item" to get started.</p>
        </div>
      )}
    </div>
  )
}