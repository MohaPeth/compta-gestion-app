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

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Connexion réussie",
      description: "Bienvenue dans votre espace de gestion",
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
          <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte</p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre espace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" required defaultValue="demo@example.com" />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" placeholder="••••••••" required defaultValue="password" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
