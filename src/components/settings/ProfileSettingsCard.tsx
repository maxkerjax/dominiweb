
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export function ProfileSettingsCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("บันทึกโปรไฟล์สำเร็จ!");
    } catch (error) {
      toast.error("ไม่สามารถบันทึกโปรไฟล์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>โปรไฟล์ส่วนตัว</span>
        </CardTitle>
        <CardDescription>
          จัดการข้อมูลส่วนตัวของคุณ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt={user?.name} 
            />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name">ชื่อ-นามสกุล</Label>
            <Input 
              id="name" 
              defaultValue={user?.name} 
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>อีเมล</span>
            </Label>
            <Input 
              id="email" 
              type="email" 
              defaultValue={user?.email} 
              className="mt-1"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>เบอร์โทรศัพท์</span>
            </Label>
            <Input 
              id="phone" 
              placeholder="กรุณาใส่เบอร์โทรศัพท์" 
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>ที่อยู่</span>
            </Label>
            <Input 
              id="address" 
              placeholder="กรุณาใส่ที่อยู่" 
              className="mt-1"
            />
          </div>
        </div>

        <Button 
          onClick={handleSaveProfile} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </CardContent>
    </Card>
  );
}
