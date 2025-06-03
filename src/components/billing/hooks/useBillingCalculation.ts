
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Occupancy {
  id: string;
  room_id: string;
  tenant_id: string;
  check_in_date: string;
  rooms: {
    room_number: string;
    price: number;
  } | null;
  tenants: {
    first_name: string;
    last_name: string;
  } | null;
}

export const useBillingCalculation = (open: boolean, onBillingCreated: () => void, onOpenChange: (open: boolean) => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [occupancies, setOccupancies] = useState<Occupancy[]>([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>("");
  const [billingMonth, setBillingMonth] = useState("");
  const [waterUnits, setWaterUnits] = useState<number>(1);
  const [electricityUnits, setElectricityUnits] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");

  const WATER_RATE = 100; // บาทต่อหัว (คน)
  const ELECTRICITY_RATE = 8; // บาทต่อหน่วย

  useEffect(() => {
    if (open) {
      fetchOccupancies();
      // Set default due date to end of current month
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDueDate(lastDay.toISOString().split('T')[0]);
      
      // Set default billing month to current month
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setBillingMonth(currentMonth.toISOString().split('T')[0]);
    }
  }, [open]);

  const fetchOccupancies = async () => {
    try {
      const { data, error } = await supabase
        .from('occupancy')
        .select(`
          id,
          room_id,
          tenant_id,
          check_in_date,
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
        console.error('Error fetching occupancies:', error);
        toast({
          title: "Error",
          description: "Failed to fetch room occupancies",
          variant: "destructive",
        });
        return;
      }

      // Type-safe mapping with null checks
      const mappedOccupancies: Occupancy[] = (data || []).map(item => ({
        id: item.id,
        room_id: item.room_id,
        tenant_id: item.tenant_id,
        check_in_date: item.check_in_date,
        rooms: item.rooms || null,
        tenants: item.tenants || null
      }));

      setOccupancies(mappedOccupancies);
    } catch (err) {
      console.error('Error in fetchOccupancies:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const selectedOccupancyData = occupancies.find(occ => occ.id === selectedOccupancy);
  const roomRent = selectedOccupancyData?.rooms?.price || 0;
  const waterCost = waterUnits * WATER_RATE;
  const electricityCost = electricityUnits * ELECTRICITY_RATE;
  const totalAmount = roomRent + waterCost + electricityCost;

  const handleCreateBilling = async () => {
    if (!selectedOccupancy || !billingMonth || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const occupancyData = occupancies.find(occ => occ.id === selectedOccupancy);
      if (!occupancyData) return;

      const { error } = await supabase
        .from('billing')
        .insert({
          occupancy_id: selectedOccupancy,
          room_id: occupancyData.room_id,
          tenant_id: occupancyData.tenant_id,
          billing_month: billingMonth,
          room_rent: roomRent,
          water_units: waterUnits,
          water_cost: waterCost,
          electricity_units: electricityUnits,
          electricity_cost: electricityCost,
          total_amount: totalAmount,
          due_date: dueDate,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating billing:', error);
        toast({
          title: "Error",
          description: "Failed to create billing record",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Billing Created",
        description: `Billing record created successfully for ${totalAmount.toLocaleString()} THB`,
      });

      onBillingCreated();
      onOpenChange(false);
      resetForm();
    } catch (err) {
      console.error('Error in handleCreateBilling:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOccupancy("");
    setWaterUnits(1);
    setElectricityUnits(0);
    setBillingMonth("");
    setDueDate("");
  };

  return {
    loading,
    occupancies,
    selectedOccupancy,
    setSelectedOccupancy,
    billingMonth,
    setBillingMonth,
    waterUnits,
    setWaterUnits,
    electricityUnits,
    setElectricityUnits,
    dueDate,
    setDueDate,
    selectedOccupancyData,
    roomRent,
    waterCost,
    electricityCost,
    totalAmount,
    handleCreateBilling,
    WATER_RATE,
    ELECTRICITY_RATE
  };
};
