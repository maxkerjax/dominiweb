
import { useMemo } from "react";
import { useSystemSettings } from "@/hooks/useSystemSettings";

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
  const { settings } = useSystemSettings();

  const selectedOccupancyData = useMemo(() => {
    return occupancies.find(occ => occ.id === selectedOccupancy);
  }, [occupancies, selectedOccupancy]);

  const roomRent = selectedOccupancyData?.rooms?.price || 0;
  const waterCost = waterUnits * settings.waterRate;
  const electricityCost = electricityUnits * settings.electricityRate;
  const totalAmount = roomRent + waterCost + electricityCost;

  return {
    selectedOccupancyData,
    roomRent,
    waterCost,
    electricityCost,
    totalAmount,
    WATER_RATE: settings.waterRate,
    ELECTRICITY_RATE: settings.electricityRate
  };
};
