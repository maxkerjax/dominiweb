
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

interface CreateRoomBillingParams {
  selectedRoomData: {
    room_id: string;
    room_number: string;
    room_price: number;
    occupant_count: number;
    occupants: Array<{
      tenant_id: string;
      tenant_name: string;
      occupancy_id: string;
    }>;
  };
  billingMonth: string;
  roomRent: number;
  waterUnits: number;
  waterCost: number;
  electricityUnits: number;
  electricityCost: number;
  totalAmount: number;
  dueDate: string;
  occupantCount: number;
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

export const createRoomBillingRecord = async (params: CreateRoomBillingParams) => {
  const {
    selectedRoomData,
    billingMonth,
    roomRent,
    waterUnits,
    waterCost,
    electricityUnits,
    electricityCost,
    totalAmount,
    dueDate
  } = params;

  // Convert billingMonth from YYYY-MM format to YYYY-MM-01 for database
  const billingDate = billingMonth + '-01';

  // Create billing records for each occupant in the room
  const billingInserts = selectedRoomData.occupants.map(occupant => ({
    occupancy_id: occupant.occupancy_id,
    room_id: selectedRoomData.room_id,
    tenant_id: occupant.tenant_id,
    billing_month: billingDate,
    room_rent: roomRent / selectedRoomData.occupant_count, // Split room rent among occupants
    water_units: waterUnits,
    water_cost: waterCost / selectedRoomData.occupant_count, // Split water cost among occupants
    electricity_units: electricityUnits,
    electricity_cost: electricityCost / selectedRoomData.occupant_count, // Split electricity cost among occupants
    total_amount: totalAmount / selectedRoomData.occupant_count, // Split total among occupants
    due_date: dueDate,
    status: 'pending'
  }));

  const { error } = await supabase
    .from('billing')
    .insert(billingInserts);

  if (error) {
    console.error('Error creating room billing:', error);
    throw new Error("Failed to create room billing records");
  }

  return { success: true };
};
