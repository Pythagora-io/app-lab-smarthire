import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { Sidebar } from "./Sidebar"

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="rounded-xl bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 shadow-lg">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}