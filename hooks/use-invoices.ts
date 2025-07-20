"use client"

import { useState, useCallback } from "react"

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  number: string
  clientId: string
  clientName: string
  date: string
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue"
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

const initialInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-001",
    clientId: "1",
    clientName: "Acme Corp",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
    items: [{ id: "1", description: "Développement site web", quantity: 1, unitPrice: 2500, total: 2500 }],
    subtotal: 2500,
    taxAmount: 500,
    total: 3000,
    notes: "Paiement à 30 jours",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    number: "INV-002",
    clientId: "2",
    clientName: "Tech Solutions",
    date: "2024-01-14",
    dueDate: "2024-02-14",
    status: "pending",
    items: [{ id: "1", description: "Consultation", quantity: 5, unitPrice: 150, total: 750 }],
    subtotal: 750,
    taxAmount: 150,
    total: 900,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
  },
]

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [isLoading, setIsLoading] = useState(false)

  const createInvoice = useCallback(async (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setInvoices((prev) => [newInvoice, ...prev])
    setIsLoading(false)
    return newInvoice
  }, [])

  const updateInvoice = useCallback(async (id: string, invoiceData: Partial<Invoice>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, ...invoiceData, updatedAt: new Date().toISOString() } : invoice,
      ),
    )
    setIsLoading(false)
  }, [])

  const deleteInvoice = useCallback(async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    setIsLoading(false)
  }, [])

  const getInvoice = useCallback(
    (id: string) => {
      return invoices.find((invoice) => invoice.id === id)
    },
    [invoices],
  )

  return {
    invoices,
    isLoading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
  }
}
