
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";

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

const monthlyOccupancyData = [
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

export const OccupancyChart = () => {
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
              <CustomTooltip />
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
};
