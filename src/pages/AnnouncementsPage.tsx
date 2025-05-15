
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, addMonths, subMonths, isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string; // ISO string
  important: boolean;
};

export default function AnnouncementsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<Omit<Announcement, "id">>({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    important: false,
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Water Outage",
      content: "Water will be shut off from 10am to 2pm for maintenance.",
      date: "2025-05-20",
      important: true,
    },
    {
      id: 2,
      title: "Monthly Cleaning",
      content: "Common areas will be cleaned on Saturday.",
      date: "2025-05-15",
      important: false,
    },
    {
      id: 3,
      title: "Fire Drill",
      content: "Annual fire drill will be conducted next week.",
      date: "2025-05-25",
      important: true,
    },
  ]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddAnnouncement = () => {
    const newId = Math.max(...announcements.map((a) => a.id), 0) + 1;
    setAnnouncements([...announcements, { ...newAnnouncement, id: newId }]);
    setDialogOpen(false);
    toast({
      title: "Announcement Added",
      description: "The announcement has been successfully added.",
    });
    setNewAnnouncement({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      important: false,
    });
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been successfully deleted.",
    });
  };

  const currentMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const hasAnnouncementOnDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return announcements.some(a => a.date === dateStr);
  };

  const getAnnouncementsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return announcements.filter(a => a.date === dateStr);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("nav.announcements")}</h1>
        {(user?.role === "admin" || user?.role === "staff") && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Announcement</DialogTitle>
                <DialogDescription>
                  Create a new announcement for residents.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                    }
                    placeholder="Announcement Title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content">Content</label>
                  <Textarea
                    id="content"
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                    }
                    placeholder="Announcement details..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date">Date</label>
                  <Input
                    id="date"
                    type="date"
                    value={newAnnouncement.date}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, date: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="important"
                    type="checkbox"
                    className="w-4 h-4"
                    checked={newAnnouncement.important}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, important: e.target.checked })
                    }
                  />
                  <label htmlFor="important" className="text-sm">
                    Mark as Important
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddAnnouncement}>Add Announcement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="mx-2 w-28 text-center">
                  {format(currentDate, "MMMM yyyy")}
                </div>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-xs font-medium py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {currentMonthDays().map((date, i) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const hasAnnouncement = hasAnnouncementOnDate(date);
                return (
                  <Button
                    key={i}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-12 p-0 ${
                      hasAnnouncement ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      {date.getDate()}
                      {hasAnnouncement && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Announcements for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              Announcements for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate && getAnnouncementsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getAnnouncementsForDate(selectedDate).map((announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{announcement.title}</CardTitle>
                          {announcement.important && (
                            <Badge variant="destructive" className="mt-1">
                              Important
                            </Badge>
                          )}
                        </div>
                        {(user?.role === "admin" || user?.role === "staff") && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                toast({
                                  title: "Edit Announcement",
                                  description: "Editing announcement",
                                });
                              }}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-3 text-muted-foreground" />
                <p>No announcements for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Announcements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {announcements.length > 0 ? (
          announcements
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6)
            .map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{announcement.title}</CardTitle>
                    {(user?.role === "admin" || user?.role === "staff") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <CardDescription>{format(parseISO(announcement.date), "MMMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{announcement.content}</p>
                </CardContent>
                <CardFooter>
                  {announcement.important && (
                    <Badge variant="destructive">Important</Badge>
                  )}
                </CardFooter>
              </Card>
            ))
        ) : (
          <div className="col-span-3 text-center py-10 text-muted-foreground">
            <p>No announcements available</p>
          </div>
        )}
      </div>
    </div>
  );
}
