"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, Euro } from "lucide-react"
import type { Product } from "@/hooks/use-products"

interface ProductPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function ProductPreviewModal({ open, onOpenChange, product }: ProductPreviewModalProps) {
  if (!product) return null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Aperçu du produit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
              <Badge className={getCategoryColor(product.category)}>{product.category}</Badge>
            </div>
            {product.description && <p className="text-gray-600">{product.description}</p>}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Prix unitaire</p>
                <div className="flex items-center gap-1 mt-1">
                  <Euro className="h-4 w-4 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Unité</p>
                <p className="text-gray-900 mt-1 capitalize">{product.unit}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de TVA</p>
                <p className="text-gray-900 mt-1">{product.taxRate}%</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Prix TTC</p>
                <p className="text-gray-900 mt-1 font-semibold">
                  €{(product.price * (1 + product.taxRate / 100)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {product.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Notes internes</p>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{product.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Créé le {new Date(product.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            {product.updatedAt !== product.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Modifié le {new Date(product.updatedAt).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
