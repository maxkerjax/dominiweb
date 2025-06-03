
import { Input } from "@/components/ui/input";
import { Zap, Droplet, Home } from "lucide-react";

interface CostBreakdownProps {
  roomRent: number;
  waterUnits: number;
  onWaterUnitsChange: (value: number) => void;
  waterCost: number;
  electricityUnits: number;
  onElectricityUnitsChange: (value: number) => void;
  electricityCost: number;
  totalAmount: number;
  WATER_RATE: number;
  ELECTRICITY_RATE: number;
}

export default function CostBreakdown({
  roomRent,
  waterUnits,
  onWaterUnitsChange,
  waterCost,
  electricityUnits,
  onElectricityUnitsChange,
  electricityCost,
  totalAmount,
  WATER_RATE,
  ELECTRICITY_RATE
}: CostBreakdownProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
      <h4 className="font-semibold text-lg">รายละเอียดค่าใช้จ่าย</h4>
      
      {/* Room Rent */}
      <div className="flex items-center justify-between p-3 bg-white rounded border">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-blue-600" />
          <span>ค่าห้อง</span>
        </div>
        <span className="font-medium">{roomRent.toLocaleString()} บาท</span>
      </div>

      {/* Water Cost */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-white rounded border">
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-blue-600" />
            <span>ค่าน้ำ (หัวละ {WATER_RATE} บาท)</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={waterUnits}
              onChange={(e) => onWaterUnitsChange(Number(e.target.value))}
              min="1"
              className="w-20"
            />
            <span>หัว</span>
            <span className="font-medium ml-2">{waterCost.toLocaleString()} บาท</span>
          </div>
        </div>
      </div>

      {/* Electricity Cost */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-white rounded border">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>ค่าไฟ (หน่วยละ {ELECTRICITY_RATE} บาท)</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={electricityUnits}
              onChange={(e) => onElectricityUnitsChange(Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-24"
            />
            <span>หน่วย</span>
            <span className="font-medium ml-2">{electricityCost.toLocaleString()} บาท</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-3 bg-green-50 rounded border-2 border-green-200">
        <span className="font-semibold text-lg">รวมทั้งหมด</span>
        <span className="font-bold text-xl text-green-600">{totalAmount.toLocaleString()} บาท</span>
      </div>
    </div>
  );
}
