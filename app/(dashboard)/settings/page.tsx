"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Bell, Shield, Palette, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès",
    })

    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Configurez votre application selon vos préférences</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <CardTitle>Paramètres généraux</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                <Input id="invoice-prefix" defaultValue="INV-" />
              </div>
              <div>
                <Label htmlFor="quote-prefix">Préfixe des devis</Label>
                <Input id="quote-prefix" defaultValue="DEV-" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="default-tax">TVA par défaut (%)</Label>
                <Select defaultValue="20">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5.5">5,5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select defaultValue="EUR">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar ($)</SelectItem>
                    <SelectItem value="GBP">Livre (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="payment-terms">Conditions de paiement par défaut</Label>
              <Input id="payment-terms" defaultValue="Paiement à 30 jours" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="invoice-reminders">Rappels de factures</Label>
                <p className="text-sm text-gray-600">Rappels automatiques pour les factures impayées</p>
              </div>
              <Switch id="invoice-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quote-expiry">Expiration des devis</Label>
                <p className="text-sm text-gray-600">Notifications d'expiration des devis</p>
              </div>
              <Switch id="quote-expiry" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-600" />
              <CardTitle>Apparence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Thème</Label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <CardTitle>Sécurité</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Authentification à deux facteurs</Label>
                <p className="text-sm text-gray-600">Sécurité renforcée pour votre compte</p>
              </div>
              <Switch id="two-factor" />
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
  )
}
