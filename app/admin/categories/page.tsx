"use client"

import { useState, useEffect } from "react"
// --- MODIFICATION: Import AlertDialog components ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import { categoriesAPI } from "@/lib/api"
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // --- MODIFICATION: State to manage the delete confirmation modal ---
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "UtensilsCrossed",
    color: "from-amber-400 to-orange-500",
    isActive: true,
    sortOrder: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      // Sort categories by sortOrder before setting state
      const sortedCategories = (response.data || []).sort((a, b) => a.sortOrder - b.sortOrder);
      setCategories(sortedCategories)
    } catch (error: any) {
      toast.error("Failed to fetch categories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await categoriesAPI.create(formData)
      toast.success("Category created successfully")
      setIsCreating(false)
      setFormData({
        name: "",
        description: "",
        icon: "UtensilsCrossed",
        color: "from-amber-400 to-orange-500",
        isActive: true,
        sortOrder: 0,
      })
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to create category")
    }
  }

  const handleUpdate = async () => {
    if (!editingCategory) return

    try {
      await categoriesAPI.update(editingCategory._id, formData)
      toast.success("Category updated successfully")
      setEditingCategory(null)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to update category")
    }
  }

  // --- MODIFICATION: Update handleDelete to close the modal ---
  const handleDelete = async (id: string) => {
    // The browser confirm is no longer needed
    // if (!confirm("Are you sure you want to delete this category?")) return

    try {
      await categoriesAPI.delete(id)
      toast.success("Category deleted successfully")
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category")
    } finally {
      // Ensure the modal closes after the operation
      setCategoryToDelete(null)
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setIsCreating(false) // Ensure create mode is off
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    })
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setIsCreating(false)
    setFormData({
      name: "",
      description: "",
      icon: "UtensilsCrossed",
      color: "from-amber-400 to-orange-500",
      isActive: true,
      sortOrder: 0,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32 lg:h-64">
        <div className="animate-spin rounded-full h-16 w-16 lg:h-32 lg:w-32 border-b-2 border-amber-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1 lg:mb-2">Categories</h1>
          <p className="text-sm lg:text-base text-gray-400">Manage menu categories</p>
        </div>
        <Button
          onClick={() => {
            setIsCreating(true)
            setEditingCategory(null) // Ensure edit mode is off
          }}
          className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingCategory) && (
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-amber-400">
              {isCreating ? "Create New Category" : "Edit Category"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Category name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="utensils">Utensils</option>
                    <option value="coffee">Coffee</option>
                    <option value="star">Star</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="from-amber-400 to-orange-500">Amber/Orange</option>
                    <option value="from-red-400 to-pink-500">Red/Pink</option>
                    <option value="from-blue-400 to-cyan-500">Blue/Cyan</option>
                    <option value="from-green-400 to-emerald-500">Green/Emerald</option>
                    <option value="from-purple-400 to-fuchsia-500">Purple/Fuchsia</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-400 focus:ring-amber-400 border-gray-700 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600"
                >
                  {isCreating ? "Create" : "Update"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((category) => (
          <Card key={category._id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30 flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm lg:text-base font-bold text-amber-400">{category.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white" onClick={() => startEdit(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {/* --- MODIFICATION: Trigger the modal instead of calling delete directly --- */}
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-red-500" onClick={() => setCategoryToDelete(category)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs lg:text-sm text-gray-400 min-h-[2.5rem]">{category.description}</p>
              </CardContent>
            </div>
            <CardContent>
                <div className="flex items-center pt-3 text-xs text-gray-500 border-t border-gray-700/50">
                    <span className={`bg-gradient-to-r ${category.color} px-2 py-1 rounded-full text-black font-medium text-xxs`}>
                    {category.icon}
                    </span>
                    <span className="ml-auto">
                    Order: {category.sortOrder}
                    </span>
                    <span className={`ml-3 font-semibold ${category.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- MODIFICATION: Add the AlertDialog component --- */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent className="bg-gray-900 border-red-500/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This is a master data category.
              <br />
              Deleting the <strong className="text-amber-400">"{categoryToDelete?.name}"</strong> category will also <strong className="text-red-500">permanently delete all menu items</strong> associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (categoryToDelete) {
                  handleDelete(categoryToDelete._id)
                }
              }}
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}