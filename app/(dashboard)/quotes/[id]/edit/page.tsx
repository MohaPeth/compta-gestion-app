"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, Send, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", description: "Consultation stratégique", quantity: 1, unitPrice: 1500, total: 1500 },
    { id: "2", description: "Développement MVP", quantity: 1, unitPrice: 3500, total: 3500 },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const updateItem = (itemId: string, field: keyof QuoteItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
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

  const handleSave = async (action: "save" | "send") => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: action === "save" ? "Devis mis à jour" : "Devis envoyé",
      description: action === "save" ? "Le devis a été mis à jour avec succès" : "Le devis a été envoyé au client",
    })

    setIsLoading(false)
    router.push("/quotes")
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 0.2
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/quotes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Modifier le devis {id}</h1>
        <p className="text-gray-600">Modifiez les informations de votre devis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select defaultValue="marketing">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing Pro</SelectItem>
                      <SelectItem value="startup">Startup Inc</SelectItem>
                      <SelectItem value="creative">Creative Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quote-number">Numéro de devis</Label>
                  <Input id="quote-number" defaultValue={id} disabled />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-date">Date de devis</Label>
                  <Input id="quote-date" type="date" defaultValue="2024-01-16" />
                </div>
                <div>
                  <Label htmlFor="valid-until">Valide jusqu'au</Label>
                  <Input id="valid-until" type="date" defaultValue="2024-02-16" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Articles / Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
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

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Notes et conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Notes additionnelles, conditions de validité..."
                rows={4}
                defaultValue="Ce devis est valable 30 jours. Merci de votre confiance."
              />
            </CardContent>
          </Card>
        </div>

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
                <Button className="w-full" onClick={() => handleSave("save")} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Sauvegarde..." : "Mettre à jour"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleSave("send")}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Envoi..." : "Envoyer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
