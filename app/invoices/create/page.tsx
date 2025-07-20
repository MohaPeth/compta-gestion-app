"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, Send, Eye } from "lucide-react"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function CreateInvoicePage() {
  const [items, setItems] = useState<InvoiceItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 0.2 // 20% TVA
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer une facture</h1>
          <p className="text-gray-600">Remplissez les informations pour générer votre facture</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acme">Acme Corp</SelectItem>
                        <SelectItem value="tech">Tech Solutions</SelectItem>
                        <SelectItem value="design">Design Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="invoice-number">Numéro de facture</Label>
                    <Input id="invoice-number" placeholder="INV-001" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice-date">Date de facture</Label>
                    <Input id="invoice-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="due-date">Date d'échéance</Label>
                    <Input id="due-date" type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Articles / Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <Label>Description</Label>
                        <Input
                          placeholder="Description du service..."
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Prix unitaire</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Total</Label>
                        <Input value={`€${item.total.toFixed(2)}`} disabled className="bg-gray-50" />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addItem} className="mt-4 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Notes et conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Notes additionnelles, conditions de paiement..." rows={4} />
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="bg-white sticky top-8">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">€{taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>

                <div className="space-y-2 pt-4">
                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
