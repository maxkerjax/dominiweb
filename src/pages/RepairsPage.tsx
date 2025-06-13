import { useEffect, useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client"; 

type Room = {
  id: string;
  room_number: string;
  tenant_id?: string; 
};

type RepairRequest = {
  id: string;
  room_id: string;
  room_number: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  reported_date: string;
  completed_date?: string | null;
  profile_id?: string;
};

export default function RepairsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRepair, setNewRepair] = useState<Omit<RepairRequest, "id" | "completed_date">>({
    room_id: "",
    room_number: "",
    description: "",
    status: "pending",
    reported_date: new Date().toISOString().split("T")[0],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<RepairRequest | null>(null);
  const tenantId = user?.tenant?.id;
  console.log('tenantId',tenantId);
  

  // โหลดข้อมูลจาก supabase
  useEffect(() => {
    const fetchRepairs = async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .order("reported_date", { ascending: false });
      if (!error && data) setRepairs(data as RepairRequest[]);
    };
    fetchRepairs();
  }, []);

  // โหลด rooms
useEffect(() => {
  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, room_number, tenant_id");
    if (data) {
      setRooms(data);
      console.log("rooms:", data); 
    }
  };
  fetchRooms();
}, []);

 const handleChangeRepairStatus = async (id: string, status: RepairRequest["status"]) => {
  const { error } = await supabase
    .from("repairs")
    .update({ status })
    .eq("id", id);

  if (!error) {
    setRepairs((prev) =>
      prev.map((repair) =>
        repair.id === id ? { ...repair, status } : repair
      )
    );
    toast({
      title: "Repair Status Updated",
      description: `Status updated to ${status}`,
    });
  } else {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};


  // เพิ่มข้อมูลลง supabase
  const handleAddRepair = async () => {
    const selectedRoom = rooms.find(r => r.id === newRepair.room_id);
    if (!selectedRoom) {
      toast({ title: "Error", description: "กรุณาเลือกห้อง", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("repairs")
      .insert([
        {
          room_id: selectedRoom.id,
          room_number: selectedRoom.room_number,
          description: newRepair.description,
          status: newRepair.status,
          reported_date: newRepair.reported_date,
          profile_id: user.id,
        },
      ])
      .select();
        if (!error && data) {
      const newRepairs = data.map((item) => ({
        ...item,
        status: item.status as "pending" | "in_progress" | "completed" | "cancelled",
      })) as RepairRequest[];

      setRepairs((prev) => [...prev, ...newRepairs]);

      setDialogOpen(false);
      toast({
        title: t("repairs.added") || "Repair Request Added",
        description: t("repairs.addedDesc") || `Repair request submitted.`,
      });

      setNewRepair({
        room_id: "",
        room_number: "",
        description: "",
        status: "pending",
        reported_date: new Date().toISOString().split("T")[0],
      });
    } else {
      toast({
        title: t("repairs.error") || "Error",
        description: error?.message || "Error",
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชันอัปเดตข้อมูล
  const handleUpdateRepair = async () => {
    if (!editingRepair) return;
    const { id, ...updateData } = editingRepair;
    const { data, error } = await supabase
      .from("repairs")
      .update(updateData)
      .eq("id", id)
      .select();
    if (!error && data) {
      setRepairs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updateData } : r))
      );
      setEditDialogOpen(false);
      toast({
        title: t("repairs.updated") || "Repair Updated",
        description: t("repairs.updatedDesc") || "Repair request updated.",
      });
    } else {
      toast({
        title: t("repairs.error") || "Error",
        description: error?.message || "Error",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      (repair.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? repair.status === statusFilter
      : true;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return format(parseISO(date), "PPP");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return t("repairs.status_pending") || "Pending";
      case "in_progress":
        return t("repairs.status_in_progress") || "In Progress";
      case "completed":
        return t("repairs.status_completed") || "Completed";
      case "cancelled":
        return t("repairs.status_cancelled") || "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("repairs.management")}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("repairs.add")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("repairs.add")}</DialogTitle>
              <DialogDescription>
                {t("repairs.createDescription") || "Submit a new repair request."}
              </DialogDescription>
            </DialogHeader>
                <div className="space-y-4 py-4">
                  {user?.role === "admin" || user?.role === "staff" ? (
                    // admin/staff: เลือกห้องได้
                    <div>
                      <label htmlFor="room-select">เลือกห้อง</label>
                      <Select
                        value={newRepair.room_id}
                        onValueChange={value => {
                          const selectedRoom = rooms.find(r => r.id === value);
                          setNewRepair({
                            ...newRepair,
                            room_id: value,
                            room_number: selectedRoom?.room_number || "",
                          });
                        }}
                      >
                        <SelectTrigger id="room-select">
                          <SelectValue placeholder="เลือกห้อง" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.room_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    // tenant: โชว์ label ห้องตัวเอง และ set ค่าให้ newRepair
                    (() => {
                      const myRoom = rooms.find(room => room.tenant_id === tenantId);
                      // ถ้าเจอห้องของตัวเอง ให้ setNewRepair (แค่ครั้งแรก)
                      if (myRoom && newRepair.room_id !== myRoom.id) {
                        setNewRepair({
                          ...newRepair,
                          room_id: myRoom.id,
                          room_number: myRoom.room_number,
                        });
                      }
                      return myRoom ? (
                        <div>
                          <label className="font-medium text-gray-700">
                            ห้องของคุณ: {myRoom.room_number}
                          </label>
                        </div>
                      ) : (
                        <div className="text-red-500">ไม่พบห้องของคุณในระบบ</div>
                      );
                    })()
                  )}
                </div>
              <div className="space-y-2">
                <label htmlFor="description">{t("repairs.description")}</label>
                <Textarea
                  id="description"
                  value={newRepair.description}
                  onChange={(e) =>
                    setNewRepair({ ...newRepair, description: e.target.value })
                  }
                  placeholder="Describe the issue..."
                  rows={4}
                />
              </div>
             <div className="space-y-2">
                <label htmlFor="status">{t("repairs.status")}</label>
                {user?.role === "admin" || user?.role === "staff" ? (
                  // admin/staff: เลือกสถานะได้
                  <Select
                    value={newRepair.status}
                    onValueChange={(value: any) =>
                      setNewRepair({ ...newRepair, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t("repairs.status_pending") || "Pending"}</SelectItem>
                      <SelectItem value="in_progress">{t("repairs.status_in_progress") || "In Progress"}</SelectItem>
                      <SelectItem value="completed">{t("repairs.status_completed") || "Completed"}</SelectItem>
                      <SelectItem value="cancelled">{t("repairs.status_cancelled") || "Cancelled"}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  // tenant: โชว์แค่ label pending
                  <div>
                    <label className="font-medium text-gray-700">
                      {t("repairs.status_pending") || "Pending"}
                    </label>
                  </div>
                )}
              </div>
            <DialogFooter>
              <Button onClick={handleAddRepair}>{t("repairs.add")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">{t("repairs.status_pending") || "Pending"}</SelectItem>
              <SelectItem value="in_progress">{t("repairs.status_in_progress") || "In Progress"}</SelectItem>
              <SelectItem value="completed">{t("repairs.status_completed") || "Completed"}</SelectItem>
              <SelectItem value="cancelled">{t("repairs.status_cancelled") || "Cancelled"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Repairs Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("repairs.room")}</TableHead>
              <TableHead>{t("repairs.description")}</TableHead>
              <TableHead>{t("repairs.status")}</TableHead>
              <TableHead>{t("repairs.date")}</TableHead>
              <TableHead className="w-[100px]">{t("repairs.actions")}</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {filteredRepairs.filter((repair) => {
                  if (user?.role === "admin" || user?.role === "staff") return true;
                  if (user?.role === "tenant") return repair.profile_id === user.id;
                  return false;
                }).length > 0 ? (
                  filteredRepairs
                    .filter((repair) => {
                      if (user?.role === "admin" || user?.role === "staff") return true;
                      if (user?.role === "tenant") return repair.profile_id === user.id;
                      return false;
                    })
                  .map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                          {repair.room_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{repair.description}</div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            repair.status
                          )}`}
                        >
                          {getStatusLabel(repair.status)}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(repair.reported_date)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "View Details",
                                  description: `Viewing details for repair in room ${repair.room_number}`,
                                });
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            {(user?.role === "admin" || user?.role === "staff") && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingRepair(repair);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleChangeRepairStatus(repair.id, "pending")}>
                                  Set as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeRepairStatus(repair.id, "in_progress")}>
                                  Set as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeRepairStatus(repair.id, "completed")}>
                                  Set as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeRepairStatus(repair.id, "cancelled")}>
                                  Set as Cancelled
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    ไม่พบรายการแจ้งซ่อมที่ตรงกับเงื่อนไขการค้นหา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {/* <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขการแจ้งซ่อม</DialogTitle>
          </DialogHeader>
          {editingRepair && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit_room_id">{t("repairs.room")}</label>
                <Select
                  value={editingRepair.room_id}
                  onValueChange={(value) =>
                    setEditingRepair({ ...editingRepair, room_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกห้อง" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.room_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_description">{t("repairs.description")}</label>
                <Textarea
                  id="edit_description"
                  value={editingRepair.description}
                  onChange={(e) =>
                    setEditingRepair({ ...editingRepair, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_status">{t("repairs.status")}</label>
                <Select
                  value={editingRepair.status}
                  onValueChange={(value: any) =>
                    setEditingRepair({ ...editingRepair, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t("repairs.status_pending") || "Pending"}</SelectItem>
                    <SelectItem value="in_progress">{t("repairs.status_in_progress") || "In Progress"}</SelectItem>
                    <SelectItem value="completed">{t("repairs.status_completed") || "Completed"}</SelectItem>
                    <SelectItem value="cancelled">{t("repairs.status_cancelled") || "Cancelled"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateRepair}>บันทึกการแก้ไข</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
