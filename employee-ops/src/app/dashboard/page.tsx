// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { strapiAPI, type DashboardStats } from "@/lib/api/strapi";
import {
  CubeIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      // Don't load data until component is mounted and user is authenticated
      if (!mounted || authLoading || !user) return;

      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await strapiAPI.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [mounted, authLoading, user]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-2 text-lg font-medium text-white">
            Error loading dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              // Trigger reload by updating a dependency
              setMounted(false);
              setTimeout(() => setMounted(true), 100);
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const statusCards = [
    {
      name: "Available",
      value: stats?.statusCounts?.Available || 0,
      icon: CheckCircleIcon,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      name: "Rented",
      value: stats?.statusCounts?.Rented || 0,
      icon: ClockIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      name: "Maintenance",
      value: stats?.statusCounts?.Maintenance || 0,
      icon: WrenchScrewdriverIcon,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      name: "Issues",
      value:
        (stats?.statusCounts?.Damaged || 0) +
        (stats?.statusCounts?.Retired || 0),
      icon: ExclamationTriangleIcon,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
  ];

  const overviewCards = [
    {
      name: "Total Equipment",
      value: stats?.totalInstances || 0,
      subtitle: `${stats?.totalModels || 0} models`,
      icon: CubeIcon,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User"}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Here's your equipment management overview
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((item) => (
            <div
              key={item.name}
              className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        {item.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-white">
                          {item.value.toLocaleString()}
                        </div>
                        {item.subtitle && (
                          <div className="ml-2 text-sm text-gray-400">
                            {item.subtitle}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Equipment Status */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">
            Equipment Status
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statusCards.map((item) => (
              <div
                key={item.name}
                className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${item.bgColor}`}
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-2xl font-semibold text-white">
                          {item.value.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="Add Equipment"
              description="Register new equipment instance"
              href="/equipment/new"
              color="bg-blue-600 hover:bg-blue-700"
              icon={CubeIcon}
            />
            <QuickActionCard
              title="Scan Equipment"
              description="Use QR code to find equipment"
              href="/equipment/scan"
              color="bg-green-600 hover:bg-green-700"
              icon={QrCodeIcon}
            />
            <QuickActionCard
              title="Maintenance Due"
              description="View items needing maintenance"
              href="/maintenance"
              color="bg-yellow-600 hover:bg-yellow-700"
              icon={WrenchScrewdriverIcon}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">
            Recent Activity
          </h2>
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
            <div className="px-4 py-12 text-center text-gray-400">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-400">
                No recent activity
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Equipment updates and changes will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  color: string;
  icon: any;
}

function QuickActionCard({
  title,
  description,
  href,
  color,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`block p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-all ${color} group`}
    >
      <div className="flex items-center">
        <Icon className="h-8 w-8 text-white mb-2" />
        <div className="ml-4">
          <h3 className="text-lg font-medium text-white group-hover:text-gray-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-200 group-hover:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
