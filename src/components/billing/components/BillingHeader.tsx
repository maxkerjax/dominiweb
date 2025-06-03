
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface BillingHeaderProps {
  onOpenCalculationDialog: () => void;
}

export default function BillingHeader({ onOpenCalculationDialog }: BillingHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">ระบบคิดเงิน</h1>
        <p className="text-muted-foreground">จัดการการคิดค่าใช้จ่ายของหอพัก</p>
      </div>
      <div className="mt-4 md:mt-0 space-x-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          ส่งออก
        </Button>
        <Button 
          className="flex items-center gap-2"
          onClick={onOpenCalculationDialog}
        >
          <Plus size={16} />
          คำนวณค่าใช้จ่าย
        </Button>
      </div>
    </div>
  );
}
