
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DoorClosed, Users, MapPin, Banknote } from "lucide-react";

type Room = {
  id: string;
  room_number: string;
  room_type: string;
  status: string;
  price: number;
  capacity: number;
  floor: number;
};

interface RoomDetailsDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoomDetailsDialog({ room, open, onOpenChange }: RoomDetailsDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "vacant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DoorClosed className="h-5 w-5" />
            Room {room.room_number} Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this room.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge className={`capitalize ${getStatusColor(room.status)}`}>
              {room.status}
            </Badge>
          </div>

          {/* Room Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Room Type</span>
            <span className="text-sm font-medium">{room.room_type}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Monthly Rent
            </span>
            <span className="text-sm font-bold text-green-600">{formatPrice(room.price)}</span>
          </div>

          {/* Capacity */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Capacity
            </span>
            <span className="text-sm font-medium">{room.capacity} person{room.capacity > 1 ? 's' : ''}</span>
          </div>

          {/* Floor */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Floor
            </span>
            <span className="text-sm font-medium">{room.floor}</span>
          </div>

          {/* Room ID */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Room ID</span>
              <span className="text-xs font-mono text-muted-foreground">{room.id}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
