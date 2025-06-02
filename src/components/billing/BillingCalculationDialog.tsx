
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Zap, Droplet, Home } from "lucide-react";

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

interface BillingCalculationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillingCreated: () => void;
}

export default function BillingCalculationDialog({ open, onOpenChange, onBillingCreated }: BillingCalculationDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [occupancies, setOccupancies] = useState<Occupancy[]>([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>("");
  const [billingMonth, setBillingMonth] = useState("");
  const [waterUnits, setWaterUnits] = useState<number>(1);
  const [electricityUnits, setElectricityUnits] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");

  const WATER_RATE = 100; // บาทต่อคน
  const ELECTRICITY_RATE = 7; // บาทต่อหน่วย

  useEffect(() => {
    if (open) {
      fetchOccupancies();
      // Set default due date to end of current month
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDueDate(lastDay.toISOString().split('T')[0]);
      
      // Set default billing month to current month
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setBillingMonth(currentMonth.toISOString().split('T')[0]);
    }
  }, [open]);

  const fetchOccupancies = async () => {
    try {
      const { data, error } = await supabase
        .from('occupancy')
        .select(`
          id,
          room_id,
          tenant_id,
          check_in_date,
          rooms!occupancy_room_id_fkey (
            room_number,
            price
          ),
          tenants!occupancy_tenant_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('is_current', true);

      if (error) {
        console.error('Error fetching occupancies:', error);
        toast({
          title: "Error",
          description: "Failed to fetch room occupancies",
          variant: "destructive",
        });
        return;
      }

      // Type-safe mapping with null checks
      const mappedOccupancies: Occupancy[] = (data || []).map(item => ({
        id: item.id,
        room_id: item.room_id,
        tenant_id: item.tenant_id,
        check_in_date: item.check_in_date,
        rooms: item.rooms || null,
        tenants: item.tenants || null
      }));

      setOccupancies(mappedOccupancies);
    } catch (err) {
      console.error('Error in fetchOccupancies:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const selectedOccupancyData = occupancies.find(occ => occ.id === selectedOccupancy);
  const roomRent = selectedOccupancyData?.rooms?.price || 0;
  const waterCost = waterUnits * WATER_RATE;
  const electricityCost = electricityUnits * ELECTRICITY_RATE;
  const totalAmount = roomRent + waterCost + electricityCost;

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
      const occupancyData = occupancies.find(occ => occ.id === selectedOccupancy);
      if (!occupancyData) return;

      const { error } = await supabase
        .from('billing')
        .insert({
          occupancy_id: selectedOccupancy,
          room_id: occupancyData.room_id,
          tenant_id: occupancyData.tenant_id,
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
        console.error('Error creating billing:', error);
        toast({
          title: "Error",
          description: "Failed to create billing record",
          variant: "destructive",
        });
        return;
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
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOccupancy("");
    setWaterUnits(1);
    setElectricityUnits(0);
    setBillingMonth("");
    setDueDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            คำนวณค่าใช้จ่าย
          </DialogTitle>
          <DialogDescription>
            คำนวณค่าห้อง + ค่าน้ำ + ค่าไฟสำหรับผู้เช่า
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="occupancy">เลือกห้องและผู้เช่า</Label>
            <Select value={selectedOccupancy} onValueChange={setSelectedOccupancy}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกห้อง" />
              </SelectTrigger>
              <SelectContent>
                {occupancies.map((occ) => (
                  <SelectItem key={occ.id} value={occ.id}>
                    ห้อง {occ.rooms?.room_number || 'N/A'} - {occ.tenants?.first_name || ''} {occ.tenants?.last_name || ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Billing Month */}
          <div className="space-y-2">
            <Label htmlFor="billingMonth">เดือนที่คิดค่าใช้จ่าย</Label>
            <Input
              id="billingMonth"
              type="month"
              value={billingMonth}
              onChange={(e) => setBillingMonth(e.target.value)}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">วันครบกำหนดชำระ</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Cost Breakdown */}
          {selectedOccupancyData && (
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
                    <span>ค่าน้ำ ({WATER_RATE} บาท/คน)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={waterUnits}
                      onChange={(e) => setWaterUnits(Number(e.target.value))}
                      min="1"
                      className="w-20"
                    />
                    <span>คน</span>
                    <span className="font-medium ml-2">{waterCost.toLocaleString()} บาท</span>
                  </div>
                </div>
              </div>

              {/* Electricity Cost */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>ค่าไฟ ({ELECTRICITY_RATE} บาท/หน่วย)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={electricityUnits}
                      onChange={(e) => setElectricityUnits(Number(e.target.value))}
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
