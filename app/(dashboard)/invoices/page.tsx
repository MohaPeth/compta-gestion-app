"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash2, Download, Send } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useInvoices } from "@/hooks/use-invoices"
import { InvoicePreviewModal } from "@/components/modals/invoice-preview-modal"
import type { Invoice } from "@/hooks/use-invoices"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { toast } = useToast()

  const { invoices, isLoading, deleteInvoice } = useInvoices()

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Payée", className: "bg-green-100 text-green-800" },
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
      draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
      overdue: { label: "En retard", className: "bg-red-100 text-red-800" },
      sent: { label: "Envoyée", className: "bg-blue-100 text-blue-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleAction = async (action: string, invoice: Invoice) => {
    switch (action) {
      case "view":
        setSelectedInvoice(invoice)
        setIsPreviewOpen(true)
        break
      case "delete":
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.number} ?`)) {
          try {
            await deleteInvoice(invoice.id)
            toast({
              title: "Facture supprimée",
              description: `La facture ${invoice.number} a été supprimée avec succès`,
            })
          } catch (error) {
            toast({
              title: "Erreur",
              description: "Impossible de supprimer la facture",
              variant: "destructive",
            })
          }
        }
        break
      default:
        toast({
          title: "Action effectuée",
          description: `${action} pour la facture ${invoice.number}`,
        })
    }
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Factures</h1>
        <p className="text-gray-600">Gérez toutes vos factures en un seul endroit</p>
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
            <Link href="/invoices/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Liste des factures ({filteredInvoices.length})</CardTitle>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Échéance</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{invoice.number}</td>
                    <td className="py-4 px-4 text-gray-700">{invoice.clientName}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">€{invoice.total.toLocaleString()}</td>
                    <td className="py-4 px-4">{getStatusBadge(invoice.status)}</td>
                    <td className="py-4 px-4 text-gray-600">{new Date(invoice.date).toLocaleDateString("fr-FR")}</td>
                    <td className="py-4 px-4 text-gray-600">{new Date(invoice.dueDate).toLocaleDateString("fr-FR")}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("view", invoice)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/${invoice.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("Téléchargement PDF", invoice)}>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("Envoi par email", invoice)}>
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer par email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleAction("delete", invoice)}>
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

      <InvoicePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        invoice={selectedInvoice}
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
