"use client"

import { useState } from "react"
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
import { useQuotes } from "@/hooks/use-quotes"
import { useProducts } from "@/hooks/use-products"
import { QuotePreviewModal } from "@/components/modals/quote-preview-modal"
import type { Quote, QuoteItem } from "@/hooks/use-quotes"

export default function CreateQuotePage() {
  const [items, setItems] = useState<QuoteItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    number: `DEV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Ce devis est valable 30 jours. Merci de votre confiance.",
  })
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null)

  const { toast } = useToast()
  const router = useRouter()
  const { createQuote } = useQuotes()
  const { products } = useProducts()

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

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
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

  const addProductToItems = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const newItem: QuoteItem = {
        id: Date.now().toString(),
        description: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price,
      }
      setItems([...items, newItem])
    }
  }

  const handlePreview = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxRate = 0.2
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    const quote: Quote = {
      id: "preview",
      number: formData.number,
      clientId: formData.clientId,
      clientName: formData.clientName || "Client sélectionné",
      date: formData.date,
      validUntil: formData.validUntil,
      status: "draft",
      items,
      subtotal,
      taxAmount,
      total,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setPreviewQuote(quote)
    setIsPreviewOpen(true)
  }

  const handleSave = async (action: "save" | "send") => {
    if (!formData.clientName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0 || items.every((item) => !item.description.trim())) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un article",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxRate = 0.2
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    const quoteData = {
      number: formData.number,
      clientId: formData.clientId,
      clientName: formData.clientName,
      date: formData.date,
      validUntil: formData.validUntil,
      status: action === "send" ? ("sent" as const) : ("draft" as const),
      items,
      subtotal,
      taxAmount,
      total,
      notes: formData.notes,
    }

    try {
      await createQuote(quoteData)
      toast({
        title: action === "save" ? "Devis sauvegardé" : "Devis envoyé",
        description: action === "save" ? "Le devis a été sauvegardé avec succès" : "Le devis a été envoyé au client",
      })
      router.push("/quotes")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer un devis</h1>
        <p className="text-gray-600">Remplissez les informations pour générer votre devis</p>
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
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => {
                      const clientName =
                        value === "marketing"
                          ? "Marketing Pro"
                          : value === "startup"
                            ? "Startup Inc"
                            : value === "creative"
                              ? "Creative Agency"
                              : value === "tech"
                                ? "Tech Startup"
                                : ""
                      setFormData((prev) => ({ ...prev, clientId: value, clientName }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing Pro</SelectItem>
                      <SelectItem value="startup">Startup Inc</SelectItem>
                      <SelectItem value="creative">Creative Agency</SelectItem>
                      <SelectItem value="tech">Tech Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quote-number">Numéro de devis</Label>
                  <Input
                    id="quote-number"
                    value={formData.number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-date">Date de devis</Label>
                  <Input
                    id="quote-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="valid-until">Valide jusqu'au</Label>
                  <Input
                    id="valid-until"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Articles / Services</CardTitle>
                <Select onValueChange={addProductToItems}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ajouter un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - €{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Notes et conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Notes additionnelles, conditions de validité..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
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
                  {isLoading ? "Sauvegarde..." : "Enregistrer"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handlePreview}>
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

      <QuotePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        quote={previewQuote}
        onDownload={() => {
          toast({
            title: "Téléchargement",
            description: "Le PDF sera bientôt disponible",
          })
        }}
        onSend={() => {
          toast({
            title: "Envoi",
            description: "Le devis sera envoyé par email",
          })
        }}
      />
    </div>
  )
}
