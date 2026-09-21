import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
            <div className="flex h-16 items-center px-6 text-xl font-bold">
              Admin Panel
            </div>

            <nav className="space-y-1 px-3 py-4">
              <Link
                href="/dashboard"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-800"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/users"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-800"
              >
                Users
              </Link>

              <Link
                href="/dashboard/orders"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-800"
              >
                Orders
              </Link>

              <Link
                href="/dashboard/settings"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-800"
              >
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main area */}
          <div className="pl-64">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
              <h1 className="text-lg font-semibold">Dashboard</h1>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  admin@example.com
                </span>

                <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                  Logout
                </button>
              </div>
            </header>

            {/* Page content */}
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
