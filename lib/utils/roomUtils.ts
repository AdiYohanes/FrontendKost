/**
 * Room Utility Functions
 */

import { RoomStatus } from "../api/types";

/**
 * Get Tailwind CSS classes for room status badge
 */
export function getRoomStatusColor(status: RoomStatus): string {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case RoomStatus.OCCUPIED:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case RoomStatus.MAINTENANCE:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "";
  }
}

/**
 * Format facility key to readable text
 */
export function formatFacilityKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
