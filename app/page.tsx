import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Users, Package, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Factures ce mois",
      value: "12",
      change: "+2.5%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Revenus",
      value: "€8,450",
      change: "+12.3%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Clients actifs",
      value: "24",
      change: "+4.1%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Produits",
      value: "18",
      change: "+1.2%",
      icon: Package,
      color: "text-orange-600",
    },
  ]

  const recentInvoices = [
    { id: "INV-001", client: "Acme Corp", amount: "€1,250", status: "Payée", date: "2024-01-15" },
    { id: "INV-002", client: "Tech Solutions", amount: "€890", status: "En attente", date: "2024-01-14" },
    { id: "INV-003", client: "Design Studio", amount: "€2,100", status: "Brouillon", date: "2024-01-13" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">InvoiceApp</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-900 font-medium">
                Tableau de bord
              </Link>
              <Link href="/invoices" className="text-gray-500 hover:text-gray-900">
                Factures
              </Link>
              <Link href="/quotes" className="text-gray-500 hover:text-gray-900">
                Devis
              </Link>
              <Link href="/clients" className="text-gray-500 hover:text-gray-900">
                Clients
              </Link>
              <Link href="/products" className="text-gray-500 hover:text-gray-900">
                Produits
              </Link>
            </nav>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Factures récentes</CardTitle>
              <CardDescription>Vos dernières factures créées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-600">{invoice.client}</p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{invoice.amount}</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === "Payée"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "En attente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Voir toutes les factures
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Actions rapides</CardTitle>
              <CardDescription>Créez rapidement vos documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg">
                <FileText className="h-5 w-5 mr-3" />
                Nouvelle facture
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <FileText className="h-5 w-5 mr-3" />
                Nouveau devis
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <Users className="h-5 w-5 mr-3" />
                Ajouter un client
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <Package className="h-5 w-5 mr-3" />
                Ajouter un produit
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
