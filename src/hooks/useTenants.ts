
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Tenant = Database['public']['Tables']['tenants']['Row'];
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
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tenants:', error);
        throw error;
      }

      console.log('Tenants fetched:', data);
      return data || [];
    },
    enabled: !!user, // Only fetch when user is authenticated
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

  return {
    tenants,
    isLoading,
    error,
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    deleteTenant: deleteTenantMutation.mutate,
    isCreating: createTenantMutation.isPending,
    isUpdating: updateTenantMutation.isPending,
    isDeleting: deleteTenantMutation.isPending,
  };
};
