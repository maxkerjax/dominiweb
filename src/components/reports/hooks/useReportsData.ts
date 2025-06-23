import { useEffect, useState } from "react";
import axios from "axios";

type RoomTypeData = {
  name: string;
  value: number;
  color: string;
};

type OccupancyData = {
  month: string;
  occupancy: number;
};

type RevenueData = {
  month: string;
  revenue: number;
};

type EventAttendanceData = {
  month: string;
  events: number;
  attendees: number;
  averageAttendance: number;
};

export const useReportsData = (selectedReport: string) => {
  const [roomTypeDistribution, setRoomTypeDistribution] = useState<RoomTypeData[]>([]);
  const [repairTypeDistribution, setRepairTypeDistribution] = useState<RoomTypeData[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [eventAttendanceData, setEventAttendanceData] = useState<EventAttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedReport) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://stripeapi-76to.onrender.com/getReportData`);
        const data = res.data;

        switch (selectedReport) {
          case "rooms":
            setRoomTypeDistribution(data);
            break;
          case "repairs":
            setRepairTypeDistribution(data);
            break;
          case "occupancy":
            setOccupancyData(data);
            break;
          case "revenue":
            setRevenueData(data);
            break;
          case "events":
            setEventAttendanceData(data);
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${selectedReport} report:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedReport]);

  return {
    roomTypeDistribution,
    repairTypeDistribution,
    occupancyData,
    revenueData,
    eventAttendanceData,
    isLoading,
  };
};
