"use client"

import { useState, useEffect } from "react"
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
import { useInvoices } from "@/hooks/use-invoices"
import { useProducts } from "@/hooks/use-products"
import { InvoicePreviewModal } from "@/components/modals/invoice-preview-modal"
import type { Invoice, InvoiceItem } from "@/hooks/use-invoices"
import { useSearchParams } from "next/navigation"

export default function CreateInvoicePage() {
  const [items, setItems] = useState<InvoiceItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    number: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Paiement à 30 jours. Merci de votre confiance.",
  })
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)

  const { toast } = useToast()
  const router = useRouter()
  const { createInvoice } = useInvoices()
  const { products } = useProducts()

  const searchParams = useSearchParams()
  const preSelectedClientId = searchParams.get("client")

  // Update the useEffect to handle pre-selected client
  useEffect(() => {
    if (preSelectedClientId) {
      const clientName =
        preSelectedClientId === "1"
          ? "Acme Corp"
          : preSelectedClientId === "2"
            ? "Tech Solutions"
            : preSelectedClientId === "3"
              ? "Design Studio"
              : preSelectedClientId === "4"
                ? "Marketing Agency"
                : ""

      if (clientName) {
        setFormData((prev) => ({
          ...prev,
          clientId: preSelectedClientId,
          clientName,
        }))
      }
    }
  }, [preSelectedClientId])

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

  const addProductToItems = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const newItem: InvoiceItem = {
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

    const invoice: Invoice = {
      id: "preview",
      number: formData.number,
      clientId: formData.clientId,
      clientName: formData.clientName || "Client sélectionné",
      date: formData.date,
      dueDate: formData.dueDate,
      status: "draft",
      items,
      subtotal,
      taxAmount,
      total,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setPreviewInvoice(invoice)
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

    const invoiceData = {
      number: formData.number,
      clientId: formData.clientId,
      clientName: formData.clientName,
      date: formData.date,
      dueDate: formData.dueDate,
      status: action === "send" ? ("pending" as const) : ("draft" as const),
      items,
      subtotal,
      taxAmount,
      total,
      notes: formData.notes,
    }

    try {
      await createInvoice(invoiceData)
      toast({
        title: action === "save" ? "Facture sauvegardée" : "Facture envoyée",
        description:
          action === "save" ? "La facture a été sauvegardée avec succès" : "La facture a été envoyée au client",
      })
      router.push("/invoices")
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
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
        </div>
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
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => {
                      const clientName =
                        value === "acme"
                          ? "Acme Corp"
                          : value === "tech"
                            ? "Tech Solutions"
                            : value === "design"
                              ? "Design Studio"
                              : value === "marketing"
                                ? "Marketing Agency"
                                : ""
                      setFormData((prev) => ({ ...prev, clientId: value, clientName }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acme">Acme Corp</SelectItem>
                      <SelectItem value="tech">Tech Solutions</SelectItem>
                      <SelectItem value="design">Design Studio</SelectItem>
                      <SelectItem value="marketing">Marketing Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoice-number">Numéro de facture</Label>
                  <Input
                    id="invoice-number"
                    value={formData.number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice-date">Date de facture</Label>
                  <Input
                    id="invoice-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Date d'échéance</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
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

          {/* Notes */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Notes et conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Notes additionnelles, conditions de paiement..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              />
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

      {/* Preview Modal */}
      <InvoicePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        invoice={previewInvoice}
        onDownload={() => {
          toast({
            title: "Téléchargement",
            description: "Le PDF sera bientôt disponible",
          })
        }}
        onSend={() => {
          toast({
            title: "Envoi",
            description: "La facture sera envoyée par email",
          })
        }}
      />
    </div>
  )
}
