
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user?.tenant) {
      setFormData({
        firstName: user.tenant.first_name || "",
        lastName: user.tenant.last_name || "",
        phone: user.tenant.phone || "",
        address: user.tenant.address || "",
        email: user.tenant.email || user.email || ""
      });
    } else if (user?.email) {
      // If no tenant data but user exists, set email at least
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast.error("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    setLoading(true);
    try {
      // If user is a tenant with tenant data, update tenant table
      if (user.tenant?.id) {
        const { error } = await supabase
          .from('tenants')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            email: formData.email,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.tenant.id);

        if (error) {
          console.error('Error updating tenant profile:', error);
          toast.error("ไม่สามารถบันทึกโปรไฟล์ได้");
          return;
        }
      } else if (user.role === 'tenant') {
        // If user is tenant but no tenant record exists, create one
        const { error } = await supabase
          .from('tenants')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            email: formData.email,
            auth_email: user.email
          });

        if (error) {
          console.error('Error creating tenant profile:', error);
          toast.error("ไม่สามารถสร้างโปรไฟล์ได้");
          return;
        }

        // Link the new tenant to the profile
        const { data: newTenant } = await supabase
          .from('tenants')
          .select('id')
          .eq('auth_email', user.email)
          .single();

        if (newTenant) {
          await supabase
            .from('profiles')
            .update({ tenant_id: newTenant.id })
            .eq('id', user.id);
        }
      } else {
        // For admin/staff, we might want to store basic info somewhere else
        // or just show a message that profile editing is for tenants only
        toast.info("การแก้ไขโปรไฟล์รองรับเฉพาะผู้เช่าเท่านั้น");
        return;
      }

      toast.success("บันทึกโปรไฟล์สำเร็จ!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show different UI based on user role
  if (user?.role !== 'tenant') {
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
              <p className="text-sm text-muted-foreground">บทบาท: {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            การแก้ไขโปรไฟล์รองรับเฉพาะผู้เช่าเท่านั้น
          </p>
        </CardContent>
      </Card>
    );
  }

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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">ชื่อ</Label>
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">นามสกุล</Label>
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>อีเมล</span>
            </Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>เบอร์โทรศัพท์</span>
            </Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
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
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
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
