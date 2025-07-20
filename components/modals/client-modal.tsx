"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Client } from "@/hooks/use-clients"

interface ClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSave: (
    clientData: Omit<Client, "id" | "totalInvoices" | "totalAmount" | "createdAt" | "updatedAt">,
  ) => Promise<void>
  isLoading: boolean
}

export function ClientModal({ open, onOpenChange, client, onSave, isLoading }: ClientModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    siret: "",
    vatNumber: "",
    notes: "",
    lastInvoice: "",
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        contactName: client.contactName || "",
        email: client.email,
        phone: client.phone || "",
        address: client.address || "",
        siret: client.siret || "",
        vatNumber: client.vatNumber || "",
        notes: client.notes || "",
        lastInvoice: client.lastInvoice || "",
      })
    } else {
      setFormData({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        siret: "",
        vatNumber: "",
        notes: "",
        lastInvoice: "",
      })
    }
  }, [client, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'entreprise est requis",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: "Erreur",
        description: "L'email est requis",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave(formData)
      toast({
        title: client ? "Client mis à jour" : "Client créé",
        description: client ? "Le client a été mis à jour avec succès" : "Le client a été créé avec succès",
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? "Modifier le client" : "Nouveau client"}</DialogTitle>
          <DialogDescription>
            {client ? "Modifiez les informations du client" : "Ajoutez un nouveau client à votre base de données"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de l'entreprise *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactName">Nom du contact</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                placeholder="Jean Dupont"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="contact@acme.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="123 Rue de la Paix&#10;75001 Paris&#10;France"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => setFormData((prev) => ({ ...prev, siret: e.target.value }))}
                placeholder="12345678901234"
              />
            </div>
            <div>
              <Label htmlFor="vatNumber">Numéro de TVA</Label>
              <Input
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, vatNumber: e.target.value }))}
                placeholder="FR12345678901"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes additionnelles sur le client..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Sauvegarde..." : client ? "Mettre à jour" : "Créer le client"}
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
