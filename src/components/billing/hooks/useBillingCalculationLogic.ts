
import { useMemo } from "react";

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

export const useBillingCalculationLogic = (
  occupancies: Occupancy[],
  selectedOccupancy: string,
  waterUnits: number,
  electricityUnits: number
) => {
  const WATER_RATE = 100;
  const ELECTRICITY_RATE = 8;

  const selectedOccupancyData = useMemo(() => {
    return occupancies.find(occ => occ.id === selectedOccupancy);
  }, [occupancies, selectedOccupancy]);

  const roomRent = selectedOccupancyData?.rooms?.price || 0;
  const waterCost = waterUnits * WATER_RATE;
  const electricityCost = electricityUnits * ELECTRICITY_RATE;
  const totalAmount = roomRent + waterCost + electricityCost;

  return {
    selectedOccupancyData,
    roomRent,
    waterCost,
    electricityCost,
    totalAmount,
    WATER_RATE,
    ELECTRICITY_RATE
  };
};
