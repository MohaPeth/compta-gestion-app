"use client"

import { useState, useCallback } from "react"

export interface Client {
  id: string
  name: string
  contactName?: string
  email: string
  phone?: string
  address?: string
  siret?: string
  vatNumber?: string
  notes?: string
  totalInvoices: number
  totalAmount: number
  lastInvoice?: string
  createdAt: string
  updatedAt: string
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    contactName: "Jean Dupont",
    email: "contact@acme.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Rue de la Paix\n75001 Paris\nFrance",
    siret: "12345678901234",
    vatNumber: "FR12345678901",
    notes: "Client fidèle depuis 2023",
    totalInvoices: 5,
    totalAmount: 12500,
    lastInvoice: "2024-01-15",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Tech Solutions",
    contactName: "Marie Martin",
    email: "hello@techsolutions.com",
    phone: "+33 1 98 76 54 32",
    address: "456 Avenue des Champs\n75008 Paris\nFrance",
    totalInvoices: 3,
    totalAmount: 8900,
    lastInvoice: "2024-01-14",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Design Studio",
    contactName: "Pierre Durand",
    email: "info@designstudio.fr",
    phone: "+33 1 11 22 33 44",
    address: "789 Boulevard Saint-Germain\n75006 Paris\nFrance",
    totalInvoices: 7,
    totalAmount: 15600,
    lastInvoice: "2024-01-13",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Marketing Agency",
    contactName: "Sophie Leroy",
    email: "contact@marketing.com",
    phone: "+33 1 55 66 77 88",
    address: "321 Rue de Rivoli\n75004 Paris\nFrance",
    totalInvoices: 2,
    totalAmount: 4500,
    lastInvoice: "2024-01-10",
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04",
  },
]

export function useClients() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [isLoading, setIsLoading] = useState(false)

  const createClient = useCallback(
    async (clientData: Omit<Client, "id" | "totalInvoices" | "totalAmount" | "createdAt" | "updatedAt">) => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        totalInvoices: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setClients((prev) => [newClient, ...prev])
      setIsLoading(false)
      return newClient
    },
    [],
  )

  const updateClient = useCallback(async (id: string, clientData: Partial<Client>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, ...clientData, updatedAt: new Date().toISOString() } : client,
      ),
    )
    setIsLoading(false)
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setClients((prev) => prev.filter((client) => client.id !== id))
    setIsLoading(false)
  }, [])

  const getClient = useCallback(
    (id: string) => {
      return clients.find((client) => client.id === id)
    },
    [clients],
  )

  return {
    clients,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    getClient,
  }
}
