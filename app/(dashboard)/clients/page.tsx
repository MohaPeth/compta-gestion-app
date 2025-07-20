"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Mail, Phone, FileText, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useClients } from "@/hooks/use-clients"
import { ClientModal } from "@/components/modals/client-modal"
import { ClientPreviewModal } from "@/components/modals/client-preview-modal"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { useRouter } from "next/navigation"
import type { Client } from "@/hooks/use-clients"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const { clients, isLoading, createClient, updateClient, deleteClient } = useClients()

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.contactName && client.contactName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [clients, searchTerm])

  const handleCreateClient = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setIsPreviewOpen(true)
  }

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await deleteClient(clientToDelete.id)
        toast({
          title: "Client supprimé",
          description: `${clientToDelete.name} a été supprimé avec succès`,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le client",
          variant: "destructive",
        })
      }
    }
  }

  const handleSaveClient = async (
    clientData: Omit<Client, "id" | "totalInvoices" | "totalAmount" | "createdAt" | "updatedAt">,
  ) => {
    if (selectedClient) {
      await updateClient(selectedClient.id, clientData)
    } else {
      await createClient(clientData)
    }
  }

  const handleCreateInvoice = (client: Client) => {
    // Redirect to invoice creation with pre-selected client
    router.push(`/invoices/create?client=${client.id}`)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-600">Gérez vos clients et leur historique</p>
      </div>

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
        <Button onClick={handleCreateClient}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{client.name}</CardTitle>
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
                    <DropdownMenuItem onClick={() => handleViewClient(client)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClient(client)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCreateInvoice(client)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Nouvelle facture
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClient(client)}>
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
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <p className="text-sm text-gray-600 line-clamp-2">{client.address.split("\n")[0]}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total facturé</p>
                    <p className="font-semibold text-gray-900">€{client.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dernière facture</p>
                    <p className="font-medium text-gray-900">
                      {client.lastInvoice ? new Date(client.lastInvoice).toLocaleDateString("fr-FR") : "Aucune"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" onClick={() => handleCreateInvoice(client)}>
                  Nouvelle facture
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleViewClient(client)}
                >
                  Voir profil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="bg-white">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "Aucun client trouvé" : "Aucun client dans votre base"}
            </p>
            <p className="text-gray-400 mt-2">
              {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par ajouter votre premier client"}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={handleCreateClient}>
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier client
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ClientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        client={selectedClient}
        onSave={handleSaveClient}
        isLoading={isLoading}
      />

      <ClientPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        client={selectedClient}
        onCreateInvoice={() => {
          if (selectedClient) {
            handleCreateInvoice(selectedClient)
            setIsPreviewOpen(false)
          }
        }}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Supprimer le client"
        description={`Êtes-vous sûr de vouloir supprimer "${clientToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
