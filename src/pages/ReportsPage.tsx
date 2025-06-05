
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ReportSelector } from "@/components/reports/ReportSelector";
import { OccupancyChart } from "@/components/reports/charts/OccupancyChart";
import { RevenueChart } from "@/components/reports/charts/RevenueChart";
import { PieCharts } from "@/components/reports/charts/PieCharts";
import { EventsChart } from "@/components/reports/charts/EventsChart";
import { useReportsData } from "@/components/reports/hooks/useReportsData";

const ReportsPage = () => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState("occupancy");
  const [timeFrame, setTimeFrame] = useState("year");
  
  const { roomTypeDistribution, repairTypeDistribution } = useReportsData(selectedReport);

  const renderReport = () => {
    switch(selectedReport) {
      case "occupancy":
        return <OccupancyChart />;
      case "revenue":
        return <RevenueChart />;
      case "rooms":
      case "repairs":
        return (
          <PieCharts
            roomTypeDistribution={roomTypeDistribution}
            repairTypeDistribution={repairTypeDistribution}
            selectedReport={selectedReport}
          />
        );
      case "events":
        return <EventsChart />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View and analyze dormitory data</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <ReportSelector
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
      />

      {renderReport()}
    </div>
  );
};

export default ReportsPage;
