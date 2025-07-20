"use client"

import { useState, useCallback } from "react"

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Quote {
  id: string
  number: string
  clientId: string
  clientName: string
  date: string
  validUntil: string
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  items: QuoteItem[]
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

const initialQuotes: Quote[] = [
  {
    id: "1",
    number: "DEV-001",
    clientId: "1",
    clientName: "Marketing Pro",
    date: "2024-01-16",
    validUntil: "2024-02-16",
    status: "sent",
    items: [
      { id: "1", description: "Consultation stratégique", quantity: 1, unitPrice: 1500, total: 1500 },
      { id: "2", description: "Développement MVP", quantity: 1, unitPrice: 3500, total: 3500 },
    ],
    subtotal: 5000,
    taxAmount: 1000,
    total: 6000,
    notes: "Ce devis est valable 30 jours",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
]

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [isLoading, setIsLoading] = useState(false)

  const createQuote = useCallback(async (quoteData: Omit<Quote, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newQuote: Quote = {
      ...quoteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setQuotes((prev) => [newQuote, ...prev])
    setIsLoading(false)
    return newQuote
  }, [])

  const updateQuote = useCallback(async (id: string, quoteData: Partial<Quote>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setQuotes((prev) =>
      prev.map((quote) => (quote.id === id ? { ...quote, ...quoteData, updatedAt: new Date().toISOString() } : quote)),
    )
    setIsLoading(false)
  }, [])

  const deleteQuote = useCallback(async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setQuotes((prev) => prev.filter((quote) => quote.id !== id))
    setIsLoading(false)
  }, [])

  const getQuote = useCallback(
    (id: string) => {
      return quotes.find((quote) => quote.id === id)
    },
    [quotes],
  )

  const convertToInvoice = useCallback(
    async (quoteId: string) => {
      const quote = quotes.find((q) => q.id === quoteId)
      if (!quote) return null

      // Simulate conversion
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)

      return {
        number: `INV-${Date.now()}`,
        clientId: quote.clientId,
        clientName: quote.clientName,
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "draft" as const,
        items: quote.items,
        subtotal: quote.subtotal,
        taxAmount: quote.taxAmount,
        total: quote.total,
        notes: quote.notes,
      }
    },
    [quotes],
  )

  return {
    quotes,
    isLoading,
    createQuote,
    updateQuote,
    deleteQuote,
    getQuote,
    convertToInvoice,
  }
}
