
import { Wrench, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceStatsCardProps {
  monthlyRevenue: number;
  pendingRepairs: number;
  announcements: number;
  formatCurrency: (value: number) => string;
  t: (key: string) => string;
}

export function ServiceStatsCard({ 
  monthlyRevenue, 
  pendingRepairs, 
  announcements, 
  formatCurrency, 
  t 
}: ServiceStatsCardProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t("dashboard.monthlyRevenue")}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(monthlyRevenue)}
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
          <div className="text-2xl font-bold">{pendingRepairs}</div>
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
          <div className="text-2xl font-bold">{announcements}</div>
          <div className="mt-2">
            <Button size="sm" variant="outline">
              {t("nav.announcements")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
