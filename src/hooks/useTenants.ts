
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Tenant = Database['public']['Tables']['tenants']['Row'] & {
  current_room?: {
    id: string;
    room_number: string;
    room_type: string;
    floor: number;
  } | null;
};
type TenantInsert = Database['public']['Tables']['tenants']['Insert'];
type TenantUpdate = Database['public']['Tables']['tenants']['Update'];

export const useTenants = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: tenants = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      console.log('Fetching tenants...');
      
      // First get all tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }

      console.log('Tenants fetched:', tenantsData);

      // Then get current occupancy with room details for each tenant
      const tenantsWithRooms = await Promise.all(
        (tenantsData || []).map(async (tenant) => {
          const { data: occupancyData } = await supabase
            .from('occupancy')
            .select(`
              room_id,
              rooms!occupancy_room_id_fkey(
                id,
                room_number,
                room_type,
                floor
              )
            `)
            .eq('tenant_id', tenant.id)
            .eq('is_current', true)
            .maybeSingle();

          const current_room = occupancyData?.rooms ? {
            id: occupancyData.rooms.id,
            room_number: occupancyData.rooms.room_number,
            room_type: occupancyData.rooms.room_type,
            floor: occupancyData.rooms.floor,
          } : null;

          return {
            ...tenant,
            current_room
          };
        })
      );

      console.log('Tenants with room info:', tenantsWithRooms);
      return tenantsWithRooms;
    },
    enabled: !!user,
  });

  const createTenantMutation = useMutation({
    mutationFn: async (newTenant: TenantInsert) => {
      console.log('Creating tenant:', newTenant);
      const { data, error } = await supabase
        .from('tenants')
        .insert(newTenant)
        .select()
        .single();

      if (error) {
        console.error('Error creating tenant:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "สำเร็จ",
        description: "เพิ่มผู้เช่าใหม่เรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Create tenant error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มผู้เช่าได้",
        variant: "destructive",
      });
    },
  });

  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TenantUpdate }) => {
      console.log('Updating tenant:', id, updates);
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating tenant:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "สำเร็จ",
        description: "อัปเดตข้อมูลผู้เช่าเรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Update tenant error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลผู้เช่าได้",
        variant: "destructive",
      });
    },
  });

  const deleteTenantMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting tenant:', id);
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tenant:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "สำเร็จ",
        description: "ลบผู้เช่าเรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Delete tenant error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบผู้เช่าได้",
        variant: "destructive",
      });
    },
  });

  const assignRoomMutation = useMutation({
    mutationFn: async ({ tenantId, roomId }: { tenantId: string; roomId: string }) => {
      console.log('Assigning room:', { tenantId, roomId });
      
      // First, check the room capacity and current occupancy
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('capacity')
        .eq('id', roomId)
        .single();

      if (roomError) {
        console.error('Error fetching room:', roomError);
        throw roomError;
      }

      const { data: currentOccupancy, error: occupancyError } = await supabase
        .from('occupancy')
        .select('tenant_id')
        .eq('room_id', roomId)
        .eq('is_current', true);

      if (occupancyError) {
        console.error('Error fetching current occupancy:', occupancyError);
        throw occupancyError;
      }

      // Check if room has space
      const currentOccupants = currentOccupancy?.length || 0;
      if (currentOccupants >= roomData.capacity) {
        throw new Error('ห้องนี้เต็มแล้ว ไม่สามารถเพิ่มผู้เช่าได้');
      }

      // Check out from any current room first
      await supabase
        .from('occupancy')
        .update({ 
          is_current: false, 
          check_out_date: new Date().toISOString().split('T')[0] 
        })
        .eq('tenant_id', tenantId)
        .eq('is_current', true);

      // Then create new occupancy record
      const { data, error } = await supabase
        .from('occupancy')
        .insert({
          tenant_id: tenantId,
          room_id: roomId,
          check_in_date: new Date().toISOString().split('T')[0],
          is_current: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error assigning room:', error);
        throw error;
      }

      // Update room status to occupied if it becomes occupied
      if (currentOccupants === 0) {
        await supabase
          .from('rooms')
          .update({ status: 'occupied' })
          .eq('id', roomId);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms-with-capacity'] });
      queryClient.invalidateQueries({ queryKey: ['system-stats'] });
      toast({
        title: "สำเร็จ",
        description: "กำหนดห้องให้ผู้เช่าเรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      console.error('Assign room error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถกำหนดห้องได้",
        variant: "destructive",
      });
    },
  });

  return {
    tenants,
    isLoading,
    error,
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    deleteTenant: deleteTenantMutation.mutate,
    assignRoom: (tenantId: string, roomId: string) => assignRoomMutation.mutate({ tenantId, roomId }),
    isCreating: createTenantMutation.isPending,
    isUpdating: updateTenantMutation.isPending,
    isDeleting: deleteTenantMutation.isPending,
    isAssigningRoom: assignRoomMutation.isPending,
  };
};
