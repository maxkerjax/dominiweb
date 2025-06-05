
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FileBarChart } from "lucide-react";

export const EventsChart = () => {
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
};
