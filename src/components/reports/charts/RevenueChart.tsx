
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

const monthlyRevenueData = [
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

export const RevenueChart = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
              <CustomTooltip />
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
};
