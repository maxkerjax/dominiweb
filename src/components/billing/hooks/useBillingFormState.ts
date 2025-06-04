
import { useState, useEffect } from "react";

export const useBillingFormState = (open: boolean) => {
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>("");
  const [billingMonth, setBillingMonth] = useState("");
  const [waterUnits, setWaterUnits] = useState<number>(1);
  const [electricityUnits, setElectricityUnits] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      // Set default due date to end of current month
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDueDate(lastDay.toISOString().split('T')[0]);
      
      // Set default billing month to current month
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setBillingMonth(currentMonth.toISOString().split('T')[0]);
    }
  }, [open]);

  const resetForm = () => {
    setSelectedOccupancy("");
    setWaterUnits(1);
    setElectricityUnits(0);
    setBillingMonth("");
    setDueDate("");
  };

  return {
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
  };
};
