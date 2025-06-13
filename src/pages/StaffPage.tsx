import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StaffFormDialog } from "@/components/staff/StaffFormDialog";

type Staff = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  created_at?: string;
};

export default function StaffPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Filter staff based on search term
  const filteredStaffs = staffs.filter(staff => {
    const fullName = `${staff.first_name} ${staff.last_name}`.toLowerCase();
    const email = staff.email?.toLowerCase() || "";
    const phone = staff.phone?.toLowerCase() || "";
    const department = staff.department?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || 
           email.includes(search) || 
           phone.includes(search) ||
           department.includes(search);
  });

  // Load staff data from Supabase
  useEffect(() => {
    const fetchStaffs = async () => {
      const { data, error } = await supabase
        .from('staffs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading staff data",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setStaffs(data || []);
      }
      setIsLoading(false);
    };

    fetchStaffs();
  }, []);

  // Handle staff operations
  const handleAddStaff = async (data: Omit<Staff, 'id' | 'created_at'>) => {
    const { data: newStaff, error } = await supabase
      .from('staffs')
      .insert([data])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding staff",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setStaffs([...staffs, newStaff]);
      setIsFormOpen(false);
      toast({
        title: "Staff added successfully",
        description: "New staff member has been added to the system",
      });
    }
  };

  const handleEditStaff = async (id: string, updates: Partial<Staff>) => {
    const { error } = await supabase
      .from('staffs')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating staff",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setStaffs(staffs.map(staff => 
        staff.id === id ? { ...staff, ...updates } : staff
      ));
      setIsFormOpen(false);
      toast({
        title: "Staff updated successfully",
        description: "Staff member information has been updated",
      });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    const { error } = await supabase
      .from('staffs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting staff",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setStaffs(staffs.filter(staff => staff.id !== id));
      toast({
        title: "Staff deleted successfully",
        description: "Staff member has been removed from the system",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading staff data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage dormitory staff members and their roles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => {
            setEditingStaff(null);
            setIsFormOpen(true);
          }} className="flex items-center gap-2">
            <Plus size={16} />
            Add New Staff
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Staff</CardTitle>
          <CardDescription>
            Search for staff by name, email, phone, or department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="Search staff..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>
            Showing {filteredStaffs.length} of {staffs.length} staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaffs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No staff members found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaffs.map((staff) => {
                    const fullName = `${staff.first_name} ${staff.last_name}`;
                    return (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`} 
                                alt={fullName} 
                              />
                              <AvatarFallback>
                                {staff.first_name.charAt(0)}{staff.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{fullName}</p>
                              <p className="text-sm text-muted-foreground">{staff.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{staff.phone || "-"}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>
                          <Badge variant={staff.status === 'active' ? "success" : "secondary"}>
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedStaff(staff);
                                setIsDetailsOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setEditingStaff(staff);
                                setIsFormOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteStaff(staff.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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

      <StaffFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddStaff}
        initialData={editingStaff || undefined}
      />
    </div>
  );
}
