"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Compte créé avec succès",
      description: "Bienvenue ! Votre compte a été créé.",
    })

    setIsLoading(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">InvoiceApp</h2>
          <p className="mt-2 text-sm text-gray-600">Créez votre compte gratuitement</p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>Remplissez les informations pour créer votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" placeholder="Jean" required />
                </div>
                <div>
                  <Label htmlFor="last-name">Nom</Label>
                  <Input id="last-name" placeholder="Dupont" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" required />
              </div>
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" placeholder="Mon Entreprise" required />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    conditions d'utilisation
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
