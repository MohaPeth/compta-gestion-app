"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, User, Download, Send, ArrowRight } from "lucide-react"
import type { Quote } from "@/hooks/use-quotes"

interface QuotePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: Quote | null
  onDownload?: () => void
  onSend?: () => void
  onConvertToInvoice?: () => void
}

export function QuotePreviewModal({
  open,
  onOpenChange,
  quote,
  onDownload,
  onSend,
  onConvertToInvoice,
}: QuotePreviewModalProps) {
  if (!quote) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      accepted: { label: "Accepté", className: "bg-green-100 text-green-800" },
      sent: { label: "Envoyé", className: "bg-blue-100 text-blue-800" },
      draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
      expired: { label: "Expiré", className: "bg-red-100 text-red-800" },
      rejected: { label: "Refusé", className: "bg-red-100 text-red-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aperçu du devis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{quote.number}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{quote.clientName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(quote.date).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
            {getStatusBadge(quote.status)}
          </div>

          <Separator />

          {/* Quote Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informations devis</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date d'émission:</span>
                  <span>{new Date(quote.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valide jusqu'au:</span>
                  <span>{new Date(quote.validUntil).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
              <div className="text-sm">
                <p className="font-medium">{quote.clientName}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Articles / Services</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Qté</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Prix unit.</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">€{item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-medium">€{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total:</span>
                <span>€{quote.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA (20%):</span>
                <span>€{quote.taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>€{quote.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{quote.notes}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onDownload} variant="outline" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button onClick={onSend} variant="outline" className="flex-1 bg-transparent">
              <Send className="h-4 w-4 mr-2" />
              Envoyer par email
            </Button>
            {quote.status === "accepted" && onConvertToInvoice && (
              <Button onClick={onConvertToInvoice} className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                Convertir en facture
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
