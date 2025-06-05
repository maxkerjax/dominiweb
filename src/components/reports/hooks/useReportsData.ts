
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type RoomTypeData = {
  name: string;
  value: number;
  color: string;
};

const mockRoomTypesData: RoomTypeData[] = [
  { name: "Standard Single", value: 35, color: "#3b82f6" },
  { name: "Standard Double", value: 25, color: "#10b981" },
  { name: "Deluxe Single", value: 20, color: "#f59e0b" },
  { name: "Deluxe Double", value: 15, color: "#6366f1" },
  { name: "Suite", value: 5, color: "#ec4899" },
];

const mockRepairTypesData: RoomTypeData[] = [
  { name: "Plumbing", value: 38, color: "#3b82f6" },
  { name: "Electrical", value: 25, color: "#10b981" },
  { name: "Furniture", value: 15, color: "#f59e0b" },
  { name: "HVAC", value: 12, color: "#6366f1" },
  { name: "Other", value: 10, color: "#ec4899" },
];

export const useReportsData = (selectedReport: string) => {
  const [roomTypeDistribution, setRoomTypeDistribution] = useState<RoomTypeData[]>(mockRoomTypesData);
  const [repairTypeDistribution, setRepairTypeDistribution] = useState<RoomTypeData[]>(mockRepairTypesData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoomTypeDistribution = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('room_type');
        
        if (error) {
          console.error('Error fetching room types:', error);
          return;
        }

        if (data && data.length) {
          const roomTypeCounts: { [key: string]: number } = {};
          data.forEach((room) => {
            roomTypeCounts[room.room_type] = (roomTypeCounts[room.room_type] || 0) + 1;
          });

          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#64748b"];
          
          const formattedData: RoomTypeData[] = Object.entries(roomTypeCounts).map(([roomType, count], index) => ({
            name: roomType,
            value: count,
            color: colors[index % colors.length]
          }));
          
          setRoomTypeDistribution(formattedData);
        }
      } catch (err) {
        console.error('Error in fetchRoomTypeDistribution:', err);
      }
    };

    const fetchRepairStatusDistribution = async () => {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .select('status');
        
        if (error) {
          console.error('Error fetching repair statuses:', error);
          return;
        }

        if (data && data.length) {
          const repairStatusCounts: { [key: string]: number } = {};
          data.forEach((repair) => {
            repairStatusCounts[repair.status] = (repairStatusCounts[repair.status] || 0) + 1;
          });

          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#64748b"];
          
          const formattedData: RoomTypeData[] = Object.entries(repairStatusCounts).map(([repairStatus, count], index) => ({
            name: repairStatus.charAt(0).toUpperCase() + repairStatus.slice(1),
            value: count,
            color: colors[index % colors.length]
          }));
          
          setRepairTypeDistribution(formattedData);
        } else {
          console.log('No repair data found, using mock data');
        }
      } catch (err) {
        console.error('Error in fetchRepairStatusDistribution:', err);
      }
    };

    if (selectedReport === 'rooms') {
      fetchRoomTypeDistribution();
    } else if (selectedReport === 'repairs') {
      fetchRepairStatusDistribution();
    }

  }, [selectedReport]);

  return {
    roomTypeDistribution,
    repairTypeDistribution,
    isLoading
  };
};
