"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart3, Plus, User, Settings, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Tableau de bord", href: "/", current: pathname === "/" },
    { name: "Factures", href: "/invoices", current: pathname.startsWith("/invoices") },
    { name: "Devis", href: "/quotes", current: pathname.startsWith("/quotes") },
    { name: "Clients", href: "/clients", current: pathname.startsWith("/clients") },
    { name: "Produits", href: "/products", current: pathname.startsWith("/products") },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">InvoiceApp</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-900"
                } transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/invoices/create">Nouvelle facture</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/quotes/create">Nouveau devis</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // This will be handled by the clients page modal
                    window.location.href = "/clients"
                  }}
                >
                  Nouveau client
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // This will be handled by the products page modal
                    window.location.href = "/products"
                  }}
                >
                  Nouveau produit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    item.current ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
