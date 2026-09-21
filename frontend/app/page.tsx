export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          システムの状況を確認できます。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Users</p>
          <p className="mt-2 text-3xl font-bold">1,248</p>
          <p className="mt-2 text-sm text-green-600">
            +12.5%
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="mt-2 text-3xl font-bold">384</p>
          <p className="mt-2 text-sm text-green-600">
            +8.2%
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold">¥1.24M</p>
          <p className="mt-2 text-sm text-green-600">
            +15.3%
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-3xl font-bold">24</p>
          <p className="mt-2 text-sm text-red-600">
            +3.1%
          </p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6 rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h3 className="font-semibold">Recent Orders</h3>
        </div>

        <div className="divide-y">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium">Order #1001</p>
              <p className="text-sm text-gray-500">田中 太郎</p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              Completed
            </span>
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium">Order #1002</p>
              <p className="text-sm text-gray-500">佐藤 花子</p>
            </div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
              Pending
            </span>
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium">Order #1003</p>
              <p className="text-sm text-gray-500">鈴木 一郎</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
              Processing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
