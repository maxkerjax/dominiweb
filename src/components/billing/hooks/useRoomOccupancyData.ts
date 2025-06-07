
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoomOccupancy {
  room_id: string;
  room_number: string;
  room_price: number;
  occupant_count: number;
  latest_meter_reading: number;
  occupants: Array<{
    tenant_id: string;
    tenant_name: string;
    occupancy_id: string;
  }>;
}

export const useRoomOccupancyData = (shouldFetch: boolean) => {
  const { toast } = useToast();
  const [roomOccupancies, setRoomOccupancies] = useState<RoomOccupancy[]>([]);

  useEffect(() => {
    if (shouldFetch) {
      fetchRoomOccupancies();
    }
  }, [shouldFetch]);

  const fetchRoomOccupancies = async () => {
    try {
      // Get all occupied rooms with their occupants
      const { data: occupancyData, error } = await supabase
        .from('occupancy')
        .select(`
          id,
          room_id,
          tenant_id,
          latest_meter_reading,
          rooms!occupancy_room_id_fkey (
            room_number,
            price
          ),
          tenants!occupancy_tenant_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('is_current', true);

      if (error) {
        console.error('Error fetching room occupancies:', error);
        toast({
          title: "Error",
          description: "Failed to fetch room occupancies",
          variant: "destructive",
        });
        return;
      }

      // Group by room_id and aggregate data
      const roomMap = new Map<string, RoomOccupancy>();

      (data || []).forEach(item => {
        const roomId = item.room_id;
        
        if (!roomMap.has(roomId)) {
          roomMap.set(roomId, {
            room_id: roomId,
            room_number: item.rooms?.room_number || 'N/A',
            room_price: item.rooms?.price || 0,
            occupant_count: 0,
            latest_meter_reading: item.latest_meter_reading || 0,
            occupants: []
          });
        }

        const room = roomMap.get(roomId)!;
        room.occupant_count += 1;
        room.occupants.push({
          tenant_id: item.tenant_id,
          tenant_name: `${item.tenants?.first_name || ''} ${item.tenants?.last_name || ''}`.trim(),
          occupancy_id: item.id
        });

        // Use the latest meter reading from any occupant (they should all be the same for the room)
        if (item.latest_meter_reading && item.latest_meter_reading > room.latest_meter_reading) {
          room.latest_meter_reading = item.latest_meter_reading;
        }
      });

      setRoomOccupancies(Array.from(roomMap.values()));
    } catch (err) {
      console.error('Error in fetchRoomOccupancies:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return { roomOccupancies };
};
