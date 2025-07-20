import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Factures ce mois",
      value: "12",
      change: "+2.5%",
      changeType: "increase",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Revenus",
      value: "€8,450",
      change: "+12.3%",
      changeType: "increase",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Clients actifs",
      value: "24",
      change: "+4.1%",
      changeType: "increase",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Produits",
      value: "18",
      change: "-1.2%",
      changeType: "decrease",
      icon: Package,
      color: "text-orange-600",
    },
  ]

  const recentInvoices = [
    { id: "INV-001", client: "Acme Corp", amount: "€1,250", status: "Payée", date: "2024-01-15" },
    { id: "INV-002", client: "Tech Solutions", amount: "€890", status: "En attente", date: "2024-01-14" },
    { id: "INV-003", client: "Design Studio", amount: "€2,100", status: "Brouillon", date: "2024-01-13" },
  ]

  const recentQuotes = [
    { id: "DEV-001", client: "Marketing Pro", amount: "€3,200", status: "Envoyé", date: "2024-01-16" },
    { id: "DEV-002", client: "Startup Inc", amount: "€1,800", status: "Accepté", date: "2024-01-15" },
    { id: "DEV-003", client: "Creative Agency", amount: "€950", status: "Brouillon", date: "2024-01-14" },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre espace de gestion</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <p className={`text-sm ml-1 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Invoices */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Factures récentes</CardTitle>
                <CardDescription>Vos dernières factures créées</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/invoices">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
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
          </CardContent>
        </Card>

        {/* Recent Quotes */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Devis récents</CardTitle>
                <CardDescription>Vos derniers devis créés</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/quotes">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{quote.id}</p>
                    <p className="text-sm text-gray-600">{quote.client}</p>
                    <p className="text-xs text-gray-500">{quote.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{quote.amount}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        quote.status === "Accepté"
                          ? "bg-green-100 text-green-800"
                          : quote.status === "Envoyé"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Actions rapides</CardTitle>
          <CardDescription>Créez rapidement vos documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col" asChild>
              <Link href="/invoices/create">
                <FileText className="h-6 w-6 mb-2" />
                Nouvelle facture
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/quotes/create">
                <FileText className="h-6 w-6 mb-2" />
                Nouveau devis
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/clients">
                <Users className="h-6 w-6 mb-2" />
                Gérer les clients
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/products">
                <Package className="h-6 w-6 mb-2" />
                Gérer les produits
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
