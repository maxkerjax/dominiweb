
import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, Filter, Download, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BillingCalculationDialog from "@/components/billing/BillingCalculationDialog";
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

const BillingPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalculationDialog, setShowCalculationDialog] = useState(false);

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('billing')
        .select(`
          id,
          billing_month,
          room_rent,
          water_units,
          water_cost,
          electricity_units,
          electricity_cost,
          total_amount,
          status,
          due_date,
          paid_date,
          created_at,
          rooms (
            room_number
          ),
          tenants (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching billings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch billing records",
          variant: "destructive",
        });
        return;
      }

      setBillings(data || []);
    } catch (err) {
      console.error('Error in fetchBillings:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBillings = billings.filter(billing => {
    const matchesSearch = 
      billing.tenants.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.tenants.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.rooms.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || billing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleMarkAsPaid = async (billingId: string) => {
    try {
      const { error } = await supabase
        .from('billing')
        .update({ 
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', billingId);

      if (error) {
        console.error('Error updating billing status:', error);
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Payment Updated",
        description: "Billing marked as paid successfully",
      });

      fetchBillings(); // Refresh the list
    } catch (err) {
      console.error('Error in handleMarkAsPaid:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
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
            onClick={() => setShowCalculationDialog(true)}
          >
            <Plus size={16} />
            คำนวณค่าใช้จ่าย
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ค้นหาและกรอง</CardTitle>
          <CardDescription>
            ค้นหาบิลตามชื่อผู้เช่าหรือหมายเลขห้อง
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="ค้นหาบิล..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="กรองตามสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="paid">ชำระแล้ว</SelectItem>
                  <SelectItem value="pending">รอชำระ</SelectItem>
                  <SelectItem value="overdue">เกินกำหนด</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
                              onClick={() => handleMarkAsPaid(billing.id)}
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

      <BillingCalculationDialog
        open={showCalculationDialog}
        onOpenChange={setShowCalculationDialog}
        onBillingCreated={fetchBillings}
      />
    </div>
  );
};

export default BillingPage;
