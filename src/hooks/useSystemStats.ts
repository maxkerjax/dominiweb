
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSystemStats = () => {
  return useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      // Get total rooms
      const { count: totalRooms } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });

      // Get occupied rooms
      const { count: occupiedRooms } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'occupied');

      // Get total tenants
      const { count: totalTenants } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true });

      // Get pending repairs
      const { count: pendingRepairs } = await supabase
        .from('repairs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return {
        totalRooms: totalRooms || 0,
        occupiedRooms: occupiedRooms || 0,
        totalTenants: totalTenants || 0,
        pendingRepairs: pendingRepairs || 0
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
