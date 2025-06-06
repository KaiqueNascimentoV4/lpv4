"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Settings, FileText, LogOut, User } from "lucide-react"
import { useAdminAuth } from "./admin-auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar() {
  const pathname = usePathname()
  const { user, logout } = useAdminAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-gray-900 border-gray-700 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center mr-2">
                <Image
                  src="/v4-rondina-logo.png"
                  alt="V4 Rondina Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-white text-xl font-semibold hidden sm:block">V4 Rondina</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                pathname === "/" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              Solicitações
            </Link>

            {user ? (
              <>
                <Link
                  href="/config"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                    pathname === "/config"
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      <User className="w-4 h-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 w-fit">
                        {user.role === "super-admin" ? "Super Admin" : "Admin"}
                      </span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
