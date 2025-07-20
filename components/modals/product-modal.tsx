"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/hooks/use-products"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>
  isLoading: boolean
}

export function ProductModal({ open, onOpenChange, product, onSave, isLoading }: ProductModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    taxRate: 20,
    unit: "unit",
    notes: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        taxRate: product.taxRate,
        unit: product.unit,
        notes: product.notes || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        taxRate: 20,
        unit: "unit",
        notes: "",
      })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est requis",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave(formData)
      toast({
        title: product ? "Produit mis à jour" : "Produit créé",
        description: product ? "Le produit a été mis à jour avec succès" : "Le produit a été créé avec succès",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit à votre catalogue"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du produit/service *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Développement site web"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description détaillée du produit ou service..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix unitaire (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Développement">Développement</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Conseil">Conseil</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxRate">Taux de TVA (%)</Label>
              <Select
                value={formData.taxRate.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, taxRate: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exonéré)</SelectItem>
                  <SelectItem value="5.5">5,5% (Taux réduit)</SelectItem>
                  <SelectItem value="10">10% (Taux intermédiaire)</SelectItem>
                  <SelectItem value="20">20% (Taux normal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit">Unité</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">Unité</SelectItem>
                  <SelectItem value="heure">Heure</SelectItem>
                  <SelectItem value="jour">Jour</SelectItem>
                  <SelectItem value="mois">Mois</SelectItem>
                  <SelectItem value="projet">Projet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes internes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes pour usage interne..."
              rows={2}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Sauvegarde..." : product ? "Mettre à jour" : "Créer le produit"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
