
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  Wrench,
  Calendar,
  FileBarChart,
} from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const availableReports: ReportItem[] = [
  {
    id: "occupancy",
    title: "Occupancy Trends",
    icon: Users,
    description: "Monthly dormitory occupancy rates"
  },
  {
    id: "revenue",
    title: "Revenue Analysis",
    icon: DollarSign,
    description: "Monthly revenue breakdown"
  },
  {
    id: "rooms",
    title: "Room Type Distribution",
    icon: FileBarChart,
    description: "Distribution of different room types"
  },
  {
    id: "repairs",
    title: "Repair Request Analysis",
    icon: Wrench,
    description: "Types of repair requests received"
  },
  {
    id: "events",
    icon: Calendar,
    title: "Event Attendance",
    description: "Dormitory event participation metrics"
  },
];

interface ReportSelectorProps {
  selectedReport: string;
  setSelectedReport: (value: string) => void;
  timeFrame: string;
  setTimeFrame: (value: string) => void;
}

export const ReportSelector = ({ 
  selectedReport, 
  setSelectedReport, 
  timeFrame, 
  setTimeFrame 
}: ReportSelectorProps) => {
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Options</CardTitle>
          <CardDescription>
            Select the report type and time frame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {availableReports.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      <span className="flex items-center gap-2">
                        <report.icon className="h-4 w-4" />
                        {report.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Time Period</label>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {availableReports.slice(0, 3).map((report) => (
          <Card 
            key={report.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedReport === report.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <report.icon className="h-5 w-5" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};
