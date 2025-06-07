
import { supabase } from "@/integrations/supabase/client";

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

  // Create one billing record for the room (using the first occupant as representative)
  const primaryOccupant = selectedRoomData.occupants[0];
  
  const { error } = await supabase
    .from('billing')
    .insert({
      room_id: selectedRoomData.room_id,
      tenant_id: primaryOccupant.tenant_id,
      occupancy_id: primaryOccupant.occupancy_id,
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
    console.error('Error creating billing record:', error);
    throw new Error(error.message);
  }
};
