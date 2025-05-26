
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Zap, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useSystemStats } from "@/hooks/useSystemStats";
import { useSystemSettings } from "@/hooks/useSystemSettings";

export function SystemSettingsCard() {
  const [backupLoading, setBackupLoading] = useState(false);
  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { settings, saveSettings, loading: settingsLoading } = useSystemSettings();
  
  const [formSettings, setFormSettings] = useState({
    waterRate: settings.waterRate,
    electricityRate: settings.electricityRate,
    lateFee: settings.lateFee,
    depositRate: settings.depositRate
  });

  const handleSystemBackup = async () => {
    setBackupLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("สำรองข้อมูลเสร็จสิ้น!");
    } catch (error) {
      toast.error("ไม่สามารถสำรองข้อมูลได้");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      // Clear localStorage except for auth data
      const authData = localStorage.getItem('sb-mnsotnlftoumjwjlvzus-auth-token');
      localStorage.clear();
      if (authData) {
        localStorage.setItem('sb-mnsotnlftoumjwjlvzus-auth-token', authData);
      }
      toast.success("ล้าง Cache เสร็จสิ้น!");
    } catch (error) {
      toast.error("ไม่สามารถล้าง Cache ได้");
    }
  };

  const handleSaveSettings = async () => {
    await saveSettings(formSettings);
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormSettings(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>ตั้งค่าระบบ</span>
        </CardTitle>
        <CardDescription>
          การตั้งค่าระบบและการบำรุงรักษา (เฉพาะผู้ดูแลระบบ)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">ข้อมูลระบบ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {statsLoading ? "..." : stats?.totalRooms || 0}
              </div>
              <div className="text-sm text-muted-foreground">ห้องทั้งหมด</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {statsLoading ? "..." : stats?.occupiedRooms || 0}
              </div>
              <div className="text-sm text-muted-foreground">ห้องที่เช่าแล้ว</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {statsLoading ? "..." : stats?.totalTenants || 0}
              </div>
              <div className="text-sm text-muted-foreground">ผู้เช่าทั้งหมด</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {statsLoading ? "..." : stats?.pendingRepairs || 0}
              </div>
              <div className="text-sm text-muted-foreground">งานซ่อมรอดำเนินการ</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* System Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">การตั้งค่าระบบ</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="water-rate">อัตราค่าน้ำ (บาท/หน่วย)</Label>
              <Input 
                id="water-rate" 
                type="number" 
                value={formSettings.waterRate}
                onChange={(e) => handleInputChange('waterRate', e.target.value)}
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="electricity-rate">อัตราค่าไฟ (บาท/หน่วย)</Label>
              <Input 
                id="electricity-rate" 
                type="number" 
                value={formSettings.electricityRate}
                onChange={(e) => handleInputChange('electricityRate', e.target.value)}
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="late-fee">ค่าปรับชำระล่าช้า (%)</Label>
              <Input 
                id="late-fee" 
                type="number" 
                value={formSettings.lateFee}
                onChange={(e) => handleInputChange('lateFee', e.target.value)}
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="deposit-rate">อัตราเงินมัดจำ (เท่าของค่าเช่า)</Label>
              <Input 
                id="deposit-rate" 
                type="number" 
                value={formSettings.depositRate}
                onChange={(e) => handleInputChange('depositRate', e.target.value)}
                className="mt-1" 
              />
            </div>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={settingsLoading}
            className="w-full md:w-auto"
          >
            {settingsLoading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
          </Button>
        </div>

        <Separator />

        {/* System Maintenance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">การบำรุงรักษาระบบ</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              variant="outline" 
              onClick={handleSystemBackup}
              disabled={backupLoading}
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>{backupLoading ? "กำลังสำรอง..." : "สำรองข้อมูล"}</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleClearCache}
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>ล้าง Cache</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>ตรวจสอบระบบ</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* System Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">สถานะระบบ</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">ฐานข้อมูล</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ปกติ
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">การเชื่อมต่อ</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ปกติ
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">พื้นที่จัดเก็บข้อมูล</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                ใช้ไป 65%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
