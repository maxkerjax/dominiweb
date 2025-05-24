
import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import TenantFormDialog from "@/components/tenants/TenantFormDialog";
import TenantDetailsDialog from "@/components/tenants/TenantDetailsDialog";
import type { Database } from "@/integrations/supabase/types";

type Tenant = Database['public']['Tables']['tenants']['Row'];

const TenantsPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const {
    tenants,
    isLoading,
    createTenant,
    updateTenant,
    deleteTenant,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTenants();

  const filteredTenants = tenants.filter(tenant => {
    const fullName = `${tenant.first_name} ${tenant.last_name}`.toLowerCase();
    const email = tenant.email?.toLowerCase() || "";
    const phone = tenant.phone?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || 
           email.includes(search) || 
           phone.includes(search);
  });

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDetailsOpen(true);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ ${tenant.first_name} ${tenant.last_name}?`)) {
      deleteTenant(tenant.id);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingTenant) {
      updateTenant({ id: editingTenant.id, updates: data });
    } else {
      createTenant(data);
    }
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-bold">จัดการผู้เช่า</h1>
          <p className="text-muted-foreground">จัดการข้อมูลผู้เช่าในอพาร์ตเมนต์</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleAddTenant} className="flex items-center gap-2">
            <Plus size={16} />
            เพิ่มผู้เช่าใหม่
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ค้นหาผู้เช่า</CardTitle>
          <CardDescription>
            ค้นหาผู้เช่าด้วยชื่อ อีเมล หรือเบอร์โทร
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="ค้นหาผู้เช่า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้เช่า</CardTitle>
          <CardDescription>
            แสดง {filteredTenants.length} จาก {tenants.length} รายการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้เช่า</TableHead>
                  <TableHead>เบอร์โทร</TableHead>
                  <TableHead>ที่อยู่</TableHead>
                  <TableHead>วันที่เพิ่ม</TableHead>
                  <TableHead className="w-[100px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">ไม่มีข้อมูลผู้เช่า</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTenants.map((tenant) => {
                    const fullName = `${tenant.first_name} ${tenant.last_name}`;
                    return (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`} 
                                alt={fullName} 
                              />
                              <AvatarFallback>
                                {tenant.first_name.charAt(0)}{tenant.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{fullName}</p>
                              <p className="text-sm text-muted-foreground">{tenant.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{tenant.phone || "-"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {tenant.address || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(tenant.created_at!).toLocaleDateString('th-TH')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(tenant)}>
                                <Eye className="mr-2 h-4 w-4" />
                                ดูรายละเอียด
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTenant(tenant)}>
                                <Edit className="mr-2 h-4 w-4" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTenant(tenant)}
                                className="text-destructive"
                                disabled={isDeleting}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TenantFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        tenant={editingTenant}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <TenantDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        tenant={selectedTenant}
      />
    </div>
  );
};

export default TenantsPage;
