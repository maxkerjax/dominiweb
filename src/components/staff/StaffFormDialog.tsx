import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// ส่วนของ Type definitions สำหรับข้อมูลพนักงาน
type StaffFormData = {
  first_name: string    // ชื่อพนักงาน
  last_name: string     // นามสกุลพนักงาน  
  email: string         // อีเมล
  phone: string         // เบอร์โทรศัพท์
  department: string    // แผนก
  role: string         // ตำแหน่ง
  status: 'active' | 'inactive' // สถานะการทำงาน
}

// Props ที่ส่งเข้ามาในคอมโพเนนต์
type StaffFormDialogProps = {
  open: boolean        // สถานะการแสดง/ซ่อน dialog
  onOpenChange: (open: boolean) => void  // handler เมื่อมีการเปลี่ยนสถานะ dialog
  onSubmit: (data: StaffFormData) => void // handler เมื่อกดบันทึกข้อมูล
  initialData?: StaffFormData  // ข้อมูลเริ่มต้น (กรณีแก้ไข)
}

export function StaffFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: StaffFormDialogProps) {
  const { toast } = useToast() // hook สำหรับแสดง notifications
  
  // state เก็บข้อมูลฟอร์ม โดยถ้ามี initialData ให้ใช้ค่านั้น ถ้าไม่มีใช้ค่าว่าง
  const [formData, setFormData] = useState<StaffFormData>(
    initialData || {
      first_name: "",
      last_name: "", 
      email: "",
      phone: "",
      department: "",
      role: "",
      status: "active"
    }
  )

  // handler เมื่อกด submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // ตรวจสอบข้อมูลที่จำเป็นต้องกรอก
    if (!formData.first_name || !formData.last_name || !formData.department || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    onSubmit(formData) // ส่งข้อมูลกลับไปที่ parent component
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Staff" : "Add New Staff"} {/* แสดงหัวข้อตามโหมดเพิ่ม/แก้ไข */}
          </DialogTitle>
        </DialogHeader>
        
        {/* ส่วนของฟอร์ม */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* ช่องกรอกชื่อ */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name*
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* ช่องกรอกนามสกุล */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name*
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* ช่องกรอกอีเมล */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* ช่องกรอกเบอร์โทรศัพท์ */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* เลือกแผนก */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department*
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* เลือกตำแหน่ง */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role*
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* เลือกสถานะ */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => 
                  setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ปุ่มบันทึก */}
          <DialogFooter>
            <Button type="submit">
              {initialData ? "Update" : "Add"} Staff
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}