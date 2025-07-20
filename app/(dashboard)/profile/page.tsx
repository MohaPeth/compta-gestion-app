"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Save, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès",
    })

    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et professionnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Changer la photo
            </Button>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" defaultValue="Jean" />
                </div>
                <div>
                  <Label htmlFor="last-name">Nom</Label>
                  <Input id="last-name" defaultValue="Dupont" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" defaultValue="+33 1 23 45 67 89" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" defaultValue="Mon Entreprise SARL" />
              </div>
              <div>
                <Label htmlFor="job-title">Fonction</Label>
                <Input id="job-title" defaultValue="Consultant Freelance" />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea id="address" defaultValue="123 Rue de la République&#10;75001 Paris&#10;France" rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input id="siret" defaultValue="12345678901234" />
                </div>
                <div>
                  <Label htmlFor="vat-number">Numéro de TVA</Label>
                  <Input id="vat-number" defaultValue="FR12345678901" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Informations bancaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bank-name">Nom de la banque</Label>
                <Input id="bank-name" defaultValue="Banque Populaire" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" defaultValue="FR76 1234 5678 9012 3456 7890 123" />
                </div>
                <div>
                  <Label htmlFor="bic">BIC</Label>
                  <Input id="bic" defaultValue="CCBPFRPPXXX" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading} className="px-8">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
