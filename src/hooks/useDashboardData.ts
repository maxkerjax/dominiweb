import { useState, useEffect } from "react";
import axios from "axios";

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  pendingRepairs: number;
  monthlyRevenue: number;
  announcements: number;
}

type MonthlyData = {
  month: string;
  revenue: number;
};

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://stripeapi-76to.onrender.com/sever/dashboard");
      const { stats, revenue } = response.data;

      setStats(stats);
      setMonthlyData(revenue || []);
    } catch (err: any) {
      setError("โหลดข้อมูลล้มเหลว");
      console.error("Dashboard API error:", err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const last6Revenue = monthlyData.slice(-6);

  const revenueChartData = {
    labels: last6Revenue.map((item) => item.month),
    datasets: [
      {
        label: "รายได้ (บาท)",
        data: last6Revenue.map((item) => item.revenue),
        backgroundColor: "#34d399",
      },
    ],
  };

  return {
    stats,
    monthlyData,
    loading,
    error,
    formatCurrency,
    revenueChartData,
  };
}
