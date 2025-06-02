
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tenant = Database['public']['Tables']['tenants']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];

interface RoomAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onAssignRoom: (tenantId: string, roomId: string) => void;
  isLoading?: boolean;
}

export default function RoomAssignmentDialog({
  open,
  onOpenChange,
  tenant,
  onAssignRoom,
  isLoading = false,
}: RoomAssignmentDialogProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const { data: availableRooms = [] } = useQuery({
    queryKey: ['available-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'vacant')
        .order('room_number');

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const handleAssign = () => {
    if (tenant && selectedRoomId) {
      onAssignRoom(tenant.id, selectedRoomId);
      setSelectedRoomId("");
      onOpenChange(false);
    }
  };

  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>กำหนดห้องให้ผู้เช่า</DialogTitle>
          <DialogDescription>
            เลือกห้องสำหรับ {tenant.first_name} {tenant.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="room" className="text-sm font-medium">
              เลือกห้อง
            </label>
            <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกห้องที่ว่าง" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    ห้อง {room.room_number} - {room.room_type} (ชั้น {room.floor}) - {room.price.toLocaleString()} บาท
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedRoomId || isLoading}
          >
            {isLoading ? "กำลังบันทึก..." : "กำหนดห้อง"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
