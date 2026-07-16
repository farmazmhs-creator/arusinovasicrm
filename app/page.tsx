import Link from 'next/link';
import { BarChart3, Truck, Package, Users, Zap, Bell, Clock, Search } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/middleware';
import { getUserProfile } from '@/lib/auth/user-profiles';

export default async function Home() {
  const user = await getCurrentUser();
  const profile = user ? await getUserProfile(user.id) : null;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">ArusInovasi CRM</h1>
          <p className="text-gray-600 text-lg">
            Medical device quotation and operations management
          </p>
          {profile && (
            <p className="text-sm text-blue-600 mt-2 font-medium">
              Welcome, {profile.name}! ({profile.role?.replace('_', ' ')})
            </p>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Sales Pipeline */}
          <Link
            href="/pipeline"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <BarChart3 className="text-blue-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sales Pipeline
                </h2>
                <p className="text-gray-600">
                  Kanban board with drag-drop status changes. Colour-coded cards for urgency.
                </p>
              </div>
            </div>
          </Link>

          {/* Quotations */}
          <Link
            href="/quotations"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Package className="text-green-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quotations
                </h2>
                <p className="text-gray-600">
                  Create, edit, and track quotations with line items and version history.
                </p>
              </div>
            </div>
          </Link>

          {/* Purchase Orders */}
          <Link
            href="/pos"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Truck className="text-orange-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Purchase Orders
                </h2>
                <p className="text-gray-600">
                  Track deliveries, mark partial deliveries, monitor stock allocation.
                </p>
              </div>
            </div>
          </Link>

          {/* Inventory */}
          <Link
            href="/inventory"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Users className="text-purple-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Inventory
                </h2>
                <p className="text-gray-600">
                  View stock levels, allocated quantities, and reorder alerts.
                </p>
              </div>
            </div>
          </Link>

          {/* Automation Rules */}
          <Link
            href="/automation-rules"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Zap className="text-yellow-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Automation Rules
                </h2>
                <p className="text-gray-600">
                  Configure rules that fire on events and create notifications.
                </p>
              </div>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Bell className="text-red-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Notifications
                </h2>
                <p className="text-gray-600">
                  View inbox of notifications fired by automation rules.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Approval Queue */}
          <Link
            href="/approval-queue"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Clock className="text-orange-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Approval Queue
                </h2>
                <p className="text-gray-600">
                  Director approval for high-value or heavily-discounted quotes.
                </p>
              </div>
            </div>
          </Link>

          {/* Global Search */}
          <Link
            href="/search"
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition group"
          >
            <div className="flex items-start gap-4">
              <Search className="text-cyan-600 flex-shrink-0 group-hover:scale-110 transition" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Global Search
                </h2>
                <p className="text-gray-600">
                  Find quotations, POs, customers, and contacts instantly.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Dashboards & Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboards & Analytics</h2>
          <div className="grid grid-cols-4 gap-4">
            {profile?.role === 'sales_rep' && (
              <Link
                href="/dashboards/sales-rep"
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-900 mb-2">My Dashboard</h3>
                <p className="text-sm text-gray-600">Quotations, approvals, conversion rate</p>
              </Link>
            )}

            {profile?.role === 'ops' && (
              <Link
                href="/dashboards/ops"
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Ops Dashboard</h3>
                <p className="text-sm text-gray-600">Fulfillment, deliveries, inventory</p>
              </Link>
            )}

            {profile?.role === 'director' && (
              <Link
                href="/dashboards/director"
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Executive Dashboard</h3>
                <p className="text-sm text-gray-600">Revenue, pipeline, team metrics</p>
              </Link>
            )}

            <Link
              href="/reports"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Report Builder</h3>
              <p className="text-sm text-gray-600">Create custom reports and exports</p>
            </Link>

            <Link
              href="/scoring"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">AI Scoring</h3>
              <p className="text-sm text-gray-600">Deal probability & customer health</p>
            </Link>
          </div>
        </div>

        {/* Tertiary Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Other Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vendor-prices"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              Vendor Pricing
            </Link>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>Sprint 5 Complete:</strong> Approval workflows for high-value quotes and discounts &gt;20%. Global search across quotations, POs, customers, and contacts. Director can approve/reject quotes from approval queue.
          </p>
        </div>
      </div>
    </main>
  );
}
