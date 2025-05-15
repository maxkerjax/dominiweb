
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useDashboardData } from "@/hooks/useDashboardData";
import { RoomStatsCard } from "@/components/dashboard/RoomStatsCard";
import { ServiceStatsCard } from "@/components/dashboard/ServiceStatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OccupancyVisualization } from "@/components/dashboard/OccupancyVisualization";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { stats, monthlyData, formatCurrency } = useDashboardData();

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold mb-4">{t("dashboard.welcome")}</h1>
      <p className="text-muted-foreground mb-6">{t("dashboard.summary")}</p>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RoomStatsCard
          totalRooms={stats.totalRooms}
          occupiedRooms={stats.occupiedRooms}
          vacantRooms={stats.vacantRooms}
          t={t}
        />

        <ServiceStatsCard
          monthlyRevenue={stats.monthlyRevenue}
          pendingRepairs={stats.pendingRepairs}
          announcements={stats.announcements}
          formatCurrency={formatCurrency}
          t={t}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <RevenueChart 
          monthlyData={monthlyData}
          formatCurrency={formatCurrency}
          t={t}
        />

        <OccupancyVisualization
          occupiedRooms={stats.occupiedRooms}
          totalRooms={stats.totalRooms}
        />
      </div>
    </div>
  );
}
