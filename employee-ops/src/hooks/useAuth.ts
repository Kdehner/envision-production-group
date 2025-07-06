// src/hooks/useAuth.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after component is mounted and we know auth status
    if (mounted && requireAuth && status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, requireAuth, router, mounted]);

  return {
    session,
    user: session?.user,
    isLoading: !mounted || status === "loading",
    isAuthenticated: mounted && status === "authenticated",
    strapiToken: session?.strapiToken,
  };
}

// Role-based access hook
export function useRole(requiredRole?: string | string[]) {
  const { session, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !session?.user?.role) {
    return { hasAccess: false, userRole: null, isLoading };
  }

  const userRole = session.user.role;

  if (!requiredRole) {
    return { hasAccess: true, userRole, isLoading: false };
  }

  const hasAccess = Array.isArray(requiredRole)
    ? requiredRole.includes(userRole)
    : userRole === requiredRole;

  return { hasAccess, userRole, isLoading: false };
}

// Permission levels
export const ROLES = {
  WAREHOUSE: "warehouse",
  OPERATIONS: "operations",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Permission groups for easier access control
export const ROLE_PERMISSIONS = {
  [ROLES.WAREHOUSE]: [
    "equipment:read",
    "equipment:update_status",
    "equipment:update_location",
  ],
  [ROLES.OPERATIONS]: [
    "equipment:read",
    "equipment:update_status",
    "equipment:update_location",
    "equipment:create",
    "equipment:delete",
    "maintenance:read",
    "maintenance:create",
    "reports:read",
  ],
  [ROLES.ADMIN]: [
    "equipment:*",
    "maintenance:*",
    "reports:*",
    "users:*",
    "settings:*",
  ],
} as const;
