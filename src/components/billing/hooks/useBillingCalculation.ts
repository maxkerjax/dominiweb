
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useOccupancyData } from "./useOccupancyData";
import { useBillingFormState } from "./useBillingFormState";
import { useBillingCalculation as useCalculation } from "./useBillingCalculation";
import { createBillingRecord } from "../utils/billingApi";

export const useBillingCalculation = (open: boolean, onBillingCreated: () => void, onOpenChange: (open: boolean) => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { occupancies } = useOccupancyData(open);
  
  const {
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
    resetForm
  } = useBillingFormState(open);

  const {
    selectedOccupancyData,
    roomRent,
    waterCost,
    electricityCost,
    totalAmount,
    WATER_RATE,
    ELECTRICITY_RATE
  } = useCalculation(occupancies, selectedOccupancy, waterUnits, electricityUnits);

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
      
      await createBillingRecord({
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
      });

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
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
