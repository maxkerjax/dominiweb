
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type RoomTypeData = {
  name: string;
  value: number;
  color: string;
};

interface PieChartsProps {
  roomTypeDistribution: RoomTypeData[];
  repairTypeDistribution: RoomTypeData[];
  selectedReport: string;
}

export const PieCharts = ({ 
  roomTypeDistribution, 
  repairTypeDistribution, 
  selectedReport 
}: PieChartsProps) => {
  if (selectedReport === "rooms") {
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
  }

  if (selectedReport === "repairs") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Repair Request Analysis</CardTitle>
          <CardDescription>Distribution of repair request statuses</CardDescription>
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
  }

  return null;
};
