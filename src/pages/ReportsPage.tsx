import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import {
  Download,
  Filter,
  FileBarChart,
  Users,
  DollarSign,
  Wrench,
  Calendar,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Add type definitions for chart data
type MonthlyOccupancyData = {
  month: string;
  occupancy: number;
};

type MonthlyRevenueData = {
  month: string;
  revenue: number;
};

type RoomTypeData = {
  name: string;
  value: number;
  color: string;
};

interface ReportItem {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

// Mock report data (will be replaced with Supabase data)
const monthlyOccupancyData: MonthlyOccupancyData[] = [
  { month: "Jan", occupancy: 85 },
  { month: "Feb", occupancy: 88 },
  { month: "Mar", occupancy: 90 },
  { month: "Apr", occupancy: 92 },
  { month: "May", occupancy: 95 },
  { month: "Jun", occupancy: 94 },
  { month: "Jul", occupancy: 92 },
  { month: "Aug", occupancy: 90 },
  { month: "Sep", occupancy: 93 },
  { month: "Oct", occupancy: 94 },
  { month: "Nov", occupancy: 96 },
  { month: "Dec", occupancy: 89 },
];

const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: "Jan", revenue: 42500 },
  { month: "Feb", revenue: 44000 },
  { month: "Mar", revenue: 45000 },
  { month: "Apr", revenue: 46000 },
  { month: "May", revenue: 47500 },
  { month: "Jun", revenue: 47000 },
  { month: "Jul", revenue: 46000 },
  { month: "Aug", revenue: 45000 },
  { month: "Sep", revenue: 46500 },
  { month: "Oct", revenue: 47000 },
  { month: "Nov", revenue: 48000 },
  { month: "Dec", revenue: 44500 },
];

const roomTypesData: RoomTypeData[] = [
  { name: "Standard Single", value: 35, color: "#3b82f6" },
  { name: "Standard Double", value: 25, color: "#10b981" },
  { name: "Deluxe Single", value: 20, color: "#f59e0b" },
  { name: "Deluxe Double", value: 15, color: "#6366f1" },
  { name: "Suite", value: 5, color: "#ec4899" },
];

const repairTypesData: RoomTypeData[] = [
  { name: "Plumbing", value: 38, color: "#3b82f6" },
  { name: "Electrical", value: 25, color: "#10b981" },
  { name: "Furniture", value: 15, color: "#f59e0b" },
  { name: "HVAC", value: 12, color: "#6366f1" },
  { name: "Other", value: 10, color: "#ec4899" },
];

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

// Create custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ReportsPage = () => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState("occupancy");
  const [timeFrame, setTimeFrame] = useState("year");
  const [roomTypeDistribution, setRoomTypeDistribution] = useState<RoomTypeData[]>(roomTypesData);
  const [repairTypeDistribution, setRepairTypeDistribution] = useState<RoomTypeData[]>(repairTypesData);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchRoomTypeDistribution = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('room_type, count(*)')
          .group('room_type');
        
        if (error) {
          console.error('Error fetching room types:', error);
          return;
        }

        if (data && data.length) {
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#64748b"];
          
          const formattedData: RoomTypeData[] = data.map((item, index) => ({
            name: item.room_type,
            value: parseInt(item.count),
            color: colors[index % colors.length]
          }));
          
          setRoomTypeDistribution(formattedData);
        }
      } catch (err) {
        console.error('Error in fetchRoomTypeDistribution:', err);
      }
    };

    const fetchRepairTypeDistribution = async () => {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .select('repair_type, count(*)')
          .group('repair_type');
        
        if (error) {
          console.error('Error fetching repair types:', error);
          return;
        }

        if (data && data.length) {
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#64748b"];
          
          const formattedData: RoomTypeData[] = data.map((item, index) => ({
            name: item.repair_type,
            value: parseInt(item.count),
            color: colors[index % colors.length]
          }));
          
          setRepairTypeDistribution(formattedData);
        } else {
          // If no data, keep the mock data
          console.log('No repair data found, using mock data');
        }
      } catch (err) {
        console.error('Error in fetchRepairTypeDistribution:', err);
      }
    };

    // When the report is selected, fetch the appropriate data
    if (selectedReport === 'rooms') {
      fetchRoomTypeDistribution();
    } else if (selectedReport === 'repairs') {
      fetchRepairTypeDistribution();
    }

  }, [selectedReport]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderReport = () => {
    switch(selectedReport) {
      case "occupancy":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trends</CardTitle>
              <CardDescription>Monthly occupancy rates for the dormitory</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  occupancy: {
                    label: "Occupancy Rate",
                    theme: {
                      light: "#3b82f6",
                      dark: "#60a5fa",
                    },
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyOccupancyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: "var(--foreground)" }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fill: "var(--foreground)" }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="occupancy"
                      name="Occupancy Rate"
                      fill="var(--color-occupancy)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      case "revenue":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Monthly revenue data for the dormitory</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    theme: {
                      light: "#10b981",
                      dark: "#34d399",
                    },
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: "var(--foreground)" }}
                    />
                    <YAxis 
                      tick={{ fill: "var(--foreground)" }}
                      tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      fill="var(--color-revenue)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      case "rooms":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Room Type Distribution</CardTitle>
              <CardDescription>Distribution of different room types in the dormitory</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} rooms`, 'Rooms']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case "repairs":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Repair Request Analysis</CardTitle>
              <CardDescription>Distribution of different types of repair requests</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repairTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {repairTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} requests`, 'Requests']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case "events":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Event Attendance</CardTitle>
              <CardDescription>This report is not available yet</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileBarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="max-w-sm">Event attendance analytics are currently being developed and will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        );
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

      {renderReport()}
    </div>
  );
};

export default ReportsPage;
