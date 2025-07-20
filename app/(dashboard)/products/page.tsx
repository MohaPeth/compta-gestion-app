"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Package, Eye, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/hooks/use-products"
import { ProductModal } from "@/components/modals/product-modal"
import { ProductPreviewModal } from "@/components/modals/product-preview-modal"
import type { Product } from "@/hooks/use-products"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts()

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return a.price - b.price
        case "category":
          return a.category.localeCompare(b.category)
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, categoryFilter, sortBy])

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))]
    return uniqueCategories.sort()
  }, [products])

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsPreviewOpen(true)
  }

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      try {
        await deleteProduct(product.id)
        toast({
          title: "Produit supprimé",
          description: `${product.name} a été supprimé avec succès`,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit",
          variant: "destructive",
        })
      }
    }
  }

  const handleSaveProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, productData)
    } else {
      await createProduct(productData)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Développement: "bg-blue-100 text-blue-800",
      Conseil: "bg-green-100 text-green-800",
      Formation: "bg-purple-100 text-purple-800",
      Support: "bg-orange-100 text-orange-800",
      Design: "bg-pink-100 text-pink-800",
      Autre: "bg-gray-100 text-gray-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Produits & Services</h1>
        <p className="text-gray-600">Gérez votre catalogue de produits et services</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un produit ou service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="category">Catégorie</SelectItem>
              <SelectItem value="created">Date de création</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                    <Badge className={`mt-1 ${getCategoryColor(product.category)}`}>{product.category}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Prix unitaire</p>
                    <p className="text-xl font-bold text-gray-900">€{product.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">par {product.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">TVA</p>
                    <p className="font-medium text-gray-900">{product.taxRate}%</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleViewProduct(product)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleEditProduct(product)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="bg-white">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm || categoryFilter !== "all" ? "Aucun produit trouvé" : "Aucun produit dans votre catalogue"}
            </p>
            <p className="text-gray-400 mt-2">
              {searchTerm || categoryFilter !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par ajouter votre premier produit"}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <Button className="mt-4" onClick={handleCreateProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier produit
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
        isLoading={isLoading}
      />

      <ProductPreviewModal open={isPreviewOpen} onOpenChange={setIsPreviewOpen} product={selectedProduct} />
    </div>
  )
}
