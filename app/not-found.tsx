import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="bg-white max-w-md w-full">
        <CardContent className="text-center py-12">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
          <p className="text-gray-600 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
