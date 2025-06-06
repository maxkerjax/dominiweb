
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOccupancyData } from "./useOccupancyData";
import { useBillingFormState } from "./useBillingFormState";
import { useBillingCalculationLogic } from "./useBillingCalculationLogic";
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
    previousMeterReading,
    setPreviousMeterReading,
    currentMeterReading,
    setCurrentMeterReading,
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
  } = useBillingCalculationLogic(occupancies, selectedOccupancy, waterUnits, electricityUnits);

  // Load latest meter reading when occupancy is selected
  useEffect(() => {
    const loadLatestMeterReading = async () => {
      if (selectedOccupancy) {
        try {
          const { data, error } = await supabase
            .from('occupancy')
            .select('latest_meter_reading')
            .eq('id', selectedOccupancy)
            .single();

          if (error) {
            console.error('Error loading latest meter reading:', error);
            return;
          }

          if (data) {
            setPreviousMeterReading(data.latest_meter_reading || 0);
          }
        } catch (err) {
          console.error('Error in loadLatestMeterReading:', err);
        }
      }
    };

    loadLatestMeterReading();
  }, [selectedOccupancy, setPreviousMeterReading]);

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

      // Update latest meter reading in occupancy table
      const { error: updateError } = await supabase
        .from('occupancy')
        .update({ latest_meter_reading: currentMeterReading })
        .eq('id', selectedOccupancy);

      if (updateError) {
        console.error('Error updating meter reading:', updateError);
        toast({
          title: "Warning",
          description: "Billing created but failed to update meter reading",
          variant: "destructive",
        });
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
    previousMeterReading,
    setPreviousMeterReading,
    currentMeterReading,
    setCurrentMeterReading,
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
