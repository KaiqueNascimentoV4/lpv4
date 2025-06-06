"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Settings, FileText } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()

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
            <Link
              href="/config"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                pathname === "/config" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
