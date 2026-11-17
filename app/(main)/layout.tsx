import Sidebar from './_components/Sidebar'
import RouteGuard from './_components/RouteGuard'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <RouteGuard />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}