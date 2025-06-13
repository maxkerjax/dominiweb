
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

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: systemStats, isLoading: statsLoading } = useSystemStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Sample monthly data for the chart
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const apiData = systemStats?.monthlyRevenueByMonthArray || [];
const monthlyData = months.map(month => {
  const found = apiData.find(item => item.month === month);
  return { month, revenue: found ? found.revenue : 0 };
});

  if (statsLoading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ยินดีต้อนรับ</h1>
          <p className="text-muted-foreground">ภาพรวมระบบจัดการหอพัก</p>
        </div>
        
        {user && (
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name} 
                />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RoomStatsCard
          totalRooms={systemStats?.totalRooms || 0}
          occupiedRooms={systemStats?.occupiedRooms || 0}
          vacantRooms={(systemStats?.totalRooms || 0) - (systemStats?.occupiedRooms || 0)}
          t={t}
        />

        <ServiceStatsCard
          monthlyRevenue={systemStats?.monthlyRevenue || 0}
          pendingRepairs={systemStats?.pendingRepairs || 0}
          announcements={2}
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
          occupiedRooms={systemStats?.occupiedRooms || 0}
          totalRooms={systemStats?.totalRooms || 0}
        />
      </div>
    </div>
  );
}
