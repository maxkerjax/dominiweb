
import { useState } from "react";
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
import { DoorClosed, MoreVertical, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Room = {
  id: number;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  status: "vacant" | "occupied" | "maintenance";
  rent: number;
  size: string;
};

export default function RoomsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      roomNumber: "101",
      type: "standard",
      status: "occupied",
      rent: 3500,
      size: "20 sq.m.",
    },
    {
      id: 2,
      roomNumber: "102",
      type: "standard",
      status: "vacant",
      rent: 3500,
      size: "20 sq.m.",
    },
    {
      id: 3,
      roomNumber: "201",
      type: "deluxe",
      status: "occupied",
      rent: 4500,
      size: "30 sq.m.",
    },
    {
      id: 4,
      roomNumber: "202",
      type: "deluxe",
      status: "maintenance",
      rent: 4500,
      size: "30 sq.m.",
    },
    {
      id: 5,
      roomNumber: "301",
      type: "suite",
      status: "occupied",
      rent: 5500,
      size: "40 sq.m.",
    },
    {
      id: 6,
      roomNumber: "302",
      type: "suite",
      status: "vacant",
      rent: 5500,
      size: "40 sq.m.",
    },
  ]);
  const [newRoom, setNewRoom] = useState<Omit<Room, "id">>({
    roomNumber: "",
    type: "standard",
    status: "vacant",
    rent: 3500,
    size: "20",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const handleAddRoom = () => {
    const newId = Math.max(...rooms.map((room) => room.id), 0) + 1;
    setRooms([...rooms, { ...newRoom, id: newId }]);
    setDialogOpen(false);
    toast({
      title: "Room Added",
      description: `Room ${newRoom.roomNumber} has been added successfully.`,
    });
    setNewRoom({
      roomNumber: "",
      type: "standard",
      status: "vacant",
      rent: 3500,
      size: "20",
    });
  };

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

  const handleChangeRoomStatus = (id: number, status: Room["status"]) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, status } : room))
    );
    toast({
      title: "Room Status Updated",
      description: `Room status has been updated to ${status}.`,
    });
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? room.status === statusFilter
      : true;
    const matchesType = typeFilter
      ? room.type === typeFilter
      : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("rooms.management")}</h1>
        {(user?.role === "admin" || user?.role === "staff") && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> {t("rooms.add")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("rooms.add")}</DialogTitle>
                <DialogDescription>
                  Add a new room to the dormitory.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="roomNumber">{t("rooms.number")}</label>
                  <Input
                    id="roomNumber"
                    value={newRoom.roomNumber}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, roomNumber: e.target.value })
                    }
                    placeholder="101"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type">{t("rooms.type")}</label>
                  <Select
                    value={newRoom.type}
                    onValueChange={(value: any) =>
                      setNewRoom({ ...newRoom, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status">{t("rooms.status")}</label>
                  <Select
                    value={newRoom.status}
                    onValueChange={(value: any) =>
                      setNewRoom({ ...newRoom, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="rent">{t("rooms.rent")}</label>
                  <Input
                    id="rent"
                    type="number"
                    value={newRoom.rent}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        rent: Number(e.target.value),
                      })
                    }
                    placeholder="3500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="size">{t("rooms.size")}</label>
                  <div className="flex items-center">
                    <Input
                      id="size"
                      value={newRoom.size}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, size: e.target.value })
                      }
                      placeholder="20"
                    />
                    <span className="ml-2">sq.m.</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddRoom}>{t("rooms.add")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by room number..."
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
              <SelectItem value="vacant">Vacant</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("rooms.number")}</TableHead>
              <TableHead>{t("rooms.type")}</TableHead>
              <TableHead>{t("rooms.status")}</TableHead>
              <TableHead>{t("rooms.rent")}</TableHead>
              <TableHead>{t("rooms.size")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <DoorClosed className="h-4 w-4 mr-2 text-muted-foreground" />
                      {room.roomNumber}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{room.type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        room.status
                      )}`}
                    >
                      {room.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatPrice(room.rent)}</TableCell>
                  <TableCell>{room.size}</TableCell>
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
                            // View room details
                            toast({
                              title: "View Room",
                              description: `Viewing details for Room ${room.roomNumber}`,
                            });
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        {(user?.role === "admin" || user?.role === "staff") && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                // Edit room
                                toast({
                                  title: "Edit Room",
                                  description: `Editing Room ${room.roomNumber}`,
                                });
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRoomStatus(room.id, "vacant")
                              }
                            >
                              Set as Vacant
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRoomStatus(room.id, "occupied")
                              }
                            >
                              Set as Occupied
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRoomStatus(room.id, "maintenance")
                              }
                            >
                              Set as Maintenance
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
                <TableCell colSpan={6} className="text-center py-4">
                  No rooms found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
