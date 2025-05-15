
import { useState } from "react";

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  pendingRepairs: number;
  monthlyRevenue: number;
  announcements: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 50,
    occupiedRooms: 42,
    vacantRooms: 8,
    pendingRepairs: 3,
    monthlyRevenue: 175000,
    announcements: 2,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { month: "Jan", revenue: 155000 },
    { month: "Feb", revenue: 160000 },
    { month: "Mar", revenue: 165000 },
    { month: "Apr", revenue: 170000 },
    { month: "May", revenue: 175000 },
    { month: "Jun", revenue: 175000 },
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return {
    stats,
    monthlyData,
    formatCurrency,
  };
}
