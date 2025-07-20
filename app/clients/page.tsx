"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Mail, Phone } from "lucide-react"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const clients = [
    {
      id: "1",
      name: "Acme Corp",
      email: "contact@acme.com",
      phone: "+33 1 23 45 67 89",
      totalInvoices: 5,
      totalAmount: 12500,
      lastInvoice: "2024-01-15",
    },
    {
      id: "2",
      name: "Tech Solutions",
      email: "hello@techsolutions.com",
      phone: "+33 1 98 76 54 32",
      totalInvoices: 3,
      totalAmount: 8900,
      lastInvoice: "2024-01-14",
    },
    {
      id: "3",
      name: "Design Studio",
      email: "info@designstudio.fr",
      phone: "+33 1 11 22 33 44",
      totalInvoices: 7,
      totalAmount: 15600,
      lastInvoice: "2024-01-13",
    },
    {
      id: "4",
      name: "Marketing Agency",
      email: "contact@marketing.com",
      phone: "+33 1 55 66 77 88",
      totalInvoices: 2,
      totalAmount: 4500,
      lastInvoice: "2024-01-10",
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Clients</h1>
          <p className="text-gray-600">Gérez vos clients et leur historique</p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <p className="text-sm text-gray-600">{client.totalInvoices} factures</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.phone}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total facturé</p>
                      <p className="font-semibold text-gray-900">€{client.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dernière facture</p>
                      <p className="font-medium text-gray-900">{client.lastInvoice}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Nouvelle facture
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Voir historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
