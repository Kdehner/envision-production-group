// src/components/layout/DashboardLayout.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[];
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Equipment", href: "/equipment", icon: CubeIcon },
  {
    name: "Maintenance",
    href: "/maintenance",
    icon: WrenchScrewdriverIcon,
    roles: ["operations", "admin"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ChartBarIcon,
    roles: ["operations", "admin"],
  },
  { name: "Users", href: "/users", icon: UserGroupIcon, roles: ["admin"] },
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    roles: ["admin"],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || "");
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={clsx(
          "fixed inset-0 flex z-40 md:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <SidebarContent
            navigation={filteredNavigation}
            pathname={pathname}
            user={user}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent
            navigation={filteredNavigation}
            pathname={pathname}
            user={user}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-800">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  navigation: NavigationItem[];
  pathname: string;
  user: any;
  onSignOut: () => void;
}

function SidebarContent({
  navigation,
  pathname,
  user,
  onSignOut,
}: SidebarContentProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
      {/* Logo */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EPG</span>
          </div>
          <span className="ml-3 text-white font-medium">Employee Portal</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon
                  className={clsx(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive
                      ? "text-gray-300"
                      : "text-gray-400 group-hover:text-gray-300"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info */}
      <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <div className="flex items-center w-full">
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "?"}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role} {user?.department && `• ${user.department}`}
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="ml-3 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
            title="Sign out"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
