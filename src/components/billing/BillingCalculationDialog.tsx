
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useBillingCalculation } from "./hooks/useBillingCalculation";
import OccupancySelector from "./components/OccupancySelector";
import BillingDateInputs from "./components/BillingDateInputs";
import CostBreakdown from "./components/CostBreakdown";

interface BillingCalculationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillingCreated: () => void;
}

export default function BillingCalculationDialog({ 
  open, 
  onOpenChange, 
  onBillingCreated 
}: BillingCalculationDialogProps) {
  const {
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
  } = useBillingCalculation(open, onBillingCreated, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            คำนวณค่าใช้จ่าย
          </DialogTitle>
          <DialogDescription>
            คำนวณค่าห้อง + ค่าน้ำ (หัวละ {WATER_RATE} บาท) + ค่าไฟ (หน่วยละ {ELECTRICITY_RATE} บาท) สำหรับผู้เช่า
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <OccupancySelector
            occupancies={occupancies}
            selectedOccupancy={selectedOccupancy}
            onOccupancyChange={setSelectedOccupancy}
          />

          <BillingDateInputs
            billingMonth={billingMonth}
            onBillingMonthChange={setBillingMonth}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
          />

          {selectedOccupancyData && (
            <CostBreakdown
              roomRent={roomRent}
              waterUnits={waterUnits}
              onWaterUnitsChange={setWaterUnits}
              waterCost={waterCost}
              electricityUnits={electricityUnits}
              onElectricityUnitsChange={setElectricityUnits}
              electricityCost={electricityCost}
              totalAmount={totalAmount}
              WATER_RATE={WATER_RATE}
              ELECTRICITY_RATE={ELECTRICITY_RATE}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleCreateBilling} disabled={loading || !selectedOccupancy}>
            {loading ? "กำลังสร้าง..." : "สร้างบิล"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
