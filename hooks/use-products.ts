"use client"

import { useState, useCallback } from "react"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  taxRate: number
  unit: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Développement site web",
    description: "Création d'un site web responsive avec CMS",
    price: 2500,
    category: "Développement",
    taxRate: 20,
    unit: "projet",
    notes: "Inclut hébergement première année",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Consultation stratégique",
    description: "Audit et conseil en stratégie digitale",
    price: 150,
    category: "Conseil",
    taxRate: 20,
    unit: "heure",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Formation équipe",
    description: "Formation sur les outils digitaux",
    price: 300,
    category: "Formation",
    taxRate: 20,
    unit: "jour",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Maintenance mensuelle",
    description: "Maintenance et support technique",
    price: 200,
    category: "Support",
    taxRate: 20,
    unit: "mois",
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04",
  },
  {
    id: "5",
    name: "Design graphique",
    description: "Création d'identité visuelle complète",
    price: 800,
    category: "Design",
    taxRate: 20,
    unit: "projet",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
]

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  const createProduct = useCallback(async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProducts((prev) => [newProduct, ...prev])
    setIsLoading(false)
    return newProduct
  }, [])

  const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...productData, updatedAt: new Date().toISOString() } : product,
      ),
    )
    setIsLoading(false)
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setProducts((prev) => prev.filter((product) => product.id !== id))
    setIsLoading(false)
  }, [])

  const getProduct = useCallback(
    (id: string) => {
      return products.find((product) => product.id === id)
    },
    [products],
  )

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  }
}
