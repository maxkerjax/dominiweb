
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BillingStatusBadge from "@/components/billing/BillingStatusBadge";

interface BillingRecord {
  id: string;
  billing_month: string;
  room_rent: number;
  water_units: number;
  water_cost: number;
  electricity_units: number;
  electricity_cost: number;
  total_amount: number;
  status: string;
  due_date: string;
  paid_date: string | null;
  created_at: string;
  rooms: {
    room_number: string;
  };
  tenants: {
    first_name: string;
    last_name: string;
  };
}

interface BillingTableProps {
  billings: BillingRecord[];
  filteredBillings: BillingRecord[];
  onMarkAsPaid: (billingId: string) => void;
}

export default function BillingTable({ 
  billings, 
  filteredBillings, 
  onMarkAsPaid 
}: BillingTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการบิล</CardTitle>
        <CardDescription>
          แสดง {filteredBillings.length} จาก {billings.length} รายการ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เดือน</TableHead>
                <TableHead>ผู้เช่า</TableHead>
                <TableHead>ห้อง</TableHead>
                <TableHead>ค่าห้อง</TableHead>
                <TableHead>ค่าน้ำ</TableHead>
                <TableHead>ค่าไฟ</TableHead>
                <TableHead>รวม</TableHead>
                <TableHead>ครบกำหนด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillings.length > 0 ? (
                filteredBillings.map((billing) => (
                  <TableRow key={billing.id}>
                    <TableCell className="font-medium">
                      {formatMonth(billing.billing_month)}
                    </TableCell>
                    <TableCell>
                      {billing.tenants.first_name} {billing.tenants.last_name}
                    </TableCell>
                    <TableCell>{billing.rooms.room_number}</TableCell>
                    <TableCell>{formatCurrency(billing.room_rent)}</TableCell>
                    <TableCell>
                      {formatCurrency(billing.water_cost)}
                      <div className="text-xs text-muted-foreground">
                        {billing.water_units} คน
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(billing.electricity_cost)}
                      <div className="text-xs text-muted-foreground">
                        {billing.electricity_units} หน่วย
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatCurrency(billing.total_amount)}
                    </TableCell>
                    <TableCell>{formatDate(billing.due_date)}</TableCell>
                    <TableCell>
                      <BillingStatusBadge status={billing.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-x-2">
                        {billing.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onMarkAsPaid(billing.id)}
                          >
                            ชำระแล้ว
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">ดูรายละเอียด</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    ไม่พบข้อมูลบิลที่ตรงกับเงื่อนไขการค้นหา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
