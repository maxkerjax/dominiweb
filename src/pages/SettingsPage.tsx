
import { useAuth } from "@/providers/AuthProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserManagementDialog } from "@/components/auth/UserManagementDialog";
import { ProfileSettingsCard } from "@/components/settings/ProfileSettingsCard";
import { SystemSettingsCard } from "@/components/settings/SystemSettingsCard";
import { ThemeSettingsCard } from "@/components/settings/ThemeSettingsCard";
import { Users, Settings, Palette, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ตั้งค่า</h1>
          <p className="text-muted-foreground">จัดการการตั้งค่าระบบและโปรไฟล์ของคุณ</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : user?.role === 'staff' ? 'พนักงาน' : 'ผู้เช่า'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <ProfileSettingsCard />

        {/* Theme Settings */}
        <ThemeSettingsCard />

        {/* User Management - Admin Only */}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>จัดการผู้ใช้</span>
              </CardTitle>
              <CardDescription>
                สร้างบัญชีผู้ใช้ใหม่และรีเซ็ตรหัสผ่าน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagementDialog>
                <Button className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  เปิดการจัดการผู้ใช้
                </Button>
              </UserManagementDialog>
            </CardContent>
          </Card>
        )}

        {/* System Settings - Admin Only */}
        {user?.role === 'admin' && <SystemSettingsCard />}
      </div>
    </div>
  );
}
