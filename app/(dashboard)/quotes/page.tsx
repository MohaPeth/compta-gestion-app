"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash2, Download, Send, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useQuotes } from "@/hooks/use-quotes"
import { useInvoices } from "@/hooks/use-invoices"
import { QuotePreviewModal } from "@/components/modals/quote-preview-modal"
import type { Quote } from "@/hooks/use-quotes"

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { toast } = useToast()

  const { quotes, isLoading, deleteQuote, convertToInvoice } = useQuotes()
  const { createInvoice } = useInvoices()

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

  const handleAction = async (action: string, quote: Quote) => {
    switch (action) {
      case "view":
        setSelectedQuote(quote)
        setIsPreviewOpen(true)
        break
      case "delete":
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le devis ${quote.number} ?`)) {
          try {
            await deleteQuote(quote.id)
            toast({
              title: "Devis supprimé",
              description: `Le devis ${quote.number} a été supprimé avec succès`,
            })
          } catch (error) {
            toast({
              title: "Erreur",
              description: "Impossible de supprimer le devis",
              variant: "destructive",
            })
          }
        }
        break
      case "convert":
        try {
          const invoiceData = await convertToInvoice(quote.id)
          if (invoiceData) {
            await createInvoice(invoiceData)
            toast({
              title: "Conversion réussie",
              description: `Le devis ${quote.number} a été converti en facture`,
            })
          }
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible de convertir le devis",
            variant: "destructive",
          })
        }
        break
      default:
        toast({
          title: "Action effectuée",
          description: `${action} pour le devis ${quote.number}`,
        })
    }
  }

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.number.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Devis</h1>
        <p className="text-gray-600">Gérez tous vos devis en un seul endroit</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par client ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button asChild>
            <Link href="/quotes/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau devis
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Liste des devis ({filteredQuotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Numéro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Montant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valide jusqu'au</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{quote.number}</td>
                    <td className="py-4 px-4 text-gray-700">{quote.clientName}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">€{quote.total.toLocaleString()}</td>
                    <td className="py-4 px-4">{getStatusBadge(quote.status)}</td>
                    <td className="py-4 px-4 text-gray-600">{new Date(quote.date).toLocaleDateString("fr-FR")}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(quote.validUntil).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("view", quote)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/quotes/${quote.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("Téléchargement PDF", quote)}>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("Envoi par email", quote)}>
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer par email
                          </DropdownMenuItem>
                          {quote.status === "accepted" && (
                            <DropdownMenuItem onClick={() => handleAction("convert", quote)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Convertir en facture
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600" onClick={() => handleAction("delete", quote)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <QuotePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        quote={selectedQuote}
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
        onConvertToInvoice={() => {
          if (selectedQuote) {
            handleAction("convert", selectedQuote)
            setIsPreviewOpen(false)
          }
        }}
      />
    </div>
  )
}
