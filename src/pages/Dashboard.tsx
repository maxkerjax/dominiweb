
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useDashboardData } from "@/hooks/useDashboardData";
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
  const { stats, monthlyData, formatCurrency } = useDashboardData();

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
