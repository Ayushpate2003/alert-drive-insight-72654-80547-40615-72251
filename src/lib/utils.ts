import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "@/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'fleet_manager':
      return '/fleet-dashboard';
    case 'driver':
    default:
      return '/dashboard';
  }
}
