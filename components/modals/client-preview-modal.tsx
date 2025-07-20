"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { User, Calendar, Mail, Phone, MapPin, FileText, Building } from "lucide-react"
import type { Client } from "@/hooks/use-clients"

interface ClientPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onCreateInvoice?: () => void
}

export function ClientPreviewModal({ open, onOpenChange, client, onCreateInvoice }: ClientPreviewModalProps) {
  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil client
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
              {client.contactName && <p className="text-gray-600 mt-1">Contact: {client.contactName}</p>}
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {client.totalInvoices} facture{client.totalInvoices > 1 ? "s" : ""}
            </Badge>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Informations de contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="whitespace-pre-line">{client.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Business Information */}
          {(client.siret || client.vatNumber) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informations légales</h3>
                <div className="space-y-2">
                  {client.siret && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>SIRET: {client.siret}</span>
                    </div>
                  )}
                  {client.vatNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>TVA: {client.vatNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Statistics */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total facturé</p>
                <p className="text-xl font-bold text-gray-900">€{client.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Nombre de factures</p>
                <p className="text-xl font-bold text-gray-900">{client.totalInvoices}</p>
              </div>
            </div>
            {client.lastInvoice && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Dernière facture: {new Date(client.lastInvoice).toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {client.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{client.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Créé le {new Date(client.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            {client.updatedAt !== client.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Modifié le {new Date(client.updatedAt).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onCreateInvoice} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Voir l'historique
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
