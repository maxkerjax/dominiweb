
import { supabase } from "@/integrations/supabase/client";

interface CreateBillingParams {
  selectedOccupancy: string;
  occupancies: any[];
  billingMonth: string;
  roomRent: number;
  waterUnits: number;
  waterCost: number;
  electricityUnits: number;
  electricityCost: number;
  totalAmount: number;
  dueDate: string;
}

export const createBillingRecord = async (params: CreateBillingParams) => {
  const {
    selectedOccupancy,
    occupancies,
    billingMonth,
    roomRent,
    waterUnits,
    waterCost,
    electricityUnits,
    electricityCost,
    totalAmount,
    dueDate
  } = params;

  const occupancyData = occupancies.find(occ => occ.id === selectedOccupancy);
  if (!occupancyData) {
    throw new Error("Occupancy data not found");
  }

  // Convert billingMonth from YYYY-MM format to YYYY-MM-01 for database
  const billingDate = billingMonth + '-01';

  const { error } = await supabase
    .from('billing')
    .insert({
      occupancy_id: selectedOccupancy,
      room_id: occupancyData.room_id,
      tenant_id: occupancyData.tenant_id,
      billing_month: billingDate,
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
    throw new Error("Failed to create billing record");
  }

  return { success: true };
};
