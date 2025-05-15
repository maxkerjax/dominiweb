
import { useEffect, useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DoorClosed,
  Users,
  DollarSign,
  Wrench,
  Home,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRooms: 50,
    occupiedRooms: 42,
    vacantRooms: 8,
    pendingRepairs: 3,
    monthlyRevenue: 175000,
    announcements: 2,
  });

  const [monthlyData, setMonthlyData] = useState([
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("dashboard.welcome")}</h1>
      <p className="text-muted-foreground mb-6">{t("dashboard.summary")}</p>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.totalRooms")}
            </CardTitle>
            <DoorClosed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <div className="flex w-full items-center gap-2">
                <div className="flex h-2 w-full overflow-hidden rounded bg-secondary">
                  <div
                    className="bg-primary"
                    style={{
                      width: `${
                        (stats.occupiedRooms / stats.totalRooms) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div>
                  {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.occupiedRooms")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupiedRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.vacantRooms")}
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vacantRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.monthlyRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.pendingRepairs")}
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRepairs}</div>
            <div className="mt-2">
              <Button size="sm" variant="outline">
                {t("repairs.management")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("nav.announcements")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcements}</div>
            <div className="mt-2">
              <Button size="sm" variant="outline">
                {t("nav.announcements")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.monthlyRevenue")}</CardTitle>
            <CardDescription>
              Revenue trend over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Status</CardTitle>
            <CardDescription>Current room occupancy</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {/* Simple occupancy visualization */}
            <div className="flex flex-col h-full justify-center">
              <div className="text-center text-4xl font-bold text-primary">
                {stats.occupiedRooms}/{stats.totalRooms}
              </div>
              <div className="mt-4 text-muted-foreground text-center">
                Rooms Occupied
              </div>
              <div className="mt-6">
                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${
                        (stats.occupiedRooms / stats.totalRooms) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-center">
                  {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%
                  Occupancy
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
