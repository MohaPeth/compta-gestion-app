"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash2, Download, Send } from "lucide-react"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const invoices = [
    {
      id: "INV-001",
      client: "Acme Corp",
      amount: 1250,
      status: "paid",
      date: "2024-01-15",
      dueDate: "2024-02-15",
    },
    {
      id: "INV-002",
      client: "Tech Solutions",
      amount: 890,
      status: "pending",
      date: "2024-01-14",
      dueDate: "2024-02-14",
    },
    {
      id: "INV-003",
      client: "Design Studio",
      amount: 2100,
      status: "draft",
      date: "2024-01-13",
      dueDate: "2024-02-13",
    },
    {
      id: "INV-004",
      client: "Marketing Agency",
      amount: 750,
      status: "overdue",
      date: "2024-01-10",
      dueDate: "2024-01-25",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Payée", className: "bg-green-100 text-green-800" },
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
      draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
      overdue: { label: "En retard", className: "bg-red-100 text-red-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Factures</h1>
          <p className="text-gray-600">Gérez toutes vos factures en un seul endroit</p>
        </div>

        {/* Filters and Actions */}
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Liste des factures</CardTitle>
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
                      <td className="py-4 px-4 font-medium text-gray-900">{invoice.id}</td>
                      <td className="py-4 px-4 text-gray-700">{invoice.client}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900">€{invoice.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-4 px-4 text-gray-600">{invoice.date}</td>
                      <td className="py-4 px-4 text-gray-600">{invoice.dueDate}</td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Envoyer par email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
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
      </div>
    </div>
  )
}
