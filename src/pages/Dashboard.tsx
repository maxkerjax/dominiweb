import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useSystemStats } from "@/hooks/useSystemStats";
import { RoomStatsCard } from "@/components/dashboard/RoomStatsCard";
import { ServiceStatsCard } from "@/components/dashboard/ServiceStatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OccupancyVisualization } from "@/components/dashboard/OccupancyVisualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useReportsData } from "@/components/reports/hooks/useReportsData"; 
import { useDashboardData } from "@/hooks/useDashboardData"; 

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    stats,
    loading,
    error,
    revenueChartData,
    monthlyData,
    formatCurrency,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">{error}</div>
    );
  }

  const totalRevenue = monthlyData.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const last6Revenue = monthlyData.slice(-6);

  return (
    <div className="animate-in fade-in duration-500">
      {/* ส่วน Header และ Avatar เหมือนเดิม */}

      {/* Total Revenue Card */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>รายได้ทั้งหมดที่ผ่านมา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RoomStatsCard
          totalRooms={stats?.totalRooms || 0}
          occupiedRooms={stats?.occupiedRooms || 0}
          vacantRooms={stats?.vacantRooms || 0}
          t={t}
        />
        <ServiceStatsCard
          monthlyData={last6Revenue}
          pendingRepairs={stats?.pendingRepairs || 0}
          announcements={stats?.announcements || 0}
          formatCurrency={formatCurrency}
          t={t}
        />
      </div>

      {/* Revenue Chart & Occupancy */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <RevenueChart
          monthlyData={last6Revenue}
          formatCurrency={formatCurrency}
          t={t}
        />
        <OccupancyVisualization
          occupiedRooms={stats?.occupiedRooms || 0}
          totalRooms={stats?.totalRooms || 0}
        />
      </div>
    </div>
  );
}