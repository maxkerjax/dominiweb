
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RoleSelector } from "./RoleSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const userSchema = z.object({
  email: z.string().email("กรุณาใส่อีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  firstName: z.string().min(1, "กรุณาใส่ชื่อ"),
  lastName: z.string().min(1, "กรุณาใส่นามสกุล"),
  phone: z.string().optional(),
  role: z.enum(["admin", "staff", "tenant"], {
    required_error: "กรุณาเลือกบทบาท",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const UserCreateDialog = ({ open, onOpenChange, onSuccess }: UserCreateDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "tenant",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      // Create user via Supabase Admin API (this would typically be done via an edge function)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create tenant record if role is tenant
        if (data.role === 'tenant') {
          const { error: tenantError } = await supabase
            .from('tenants')
            .insert({
              first_name: data.firstName,
              last_name: data.lastName,
              email: data.email,
              phone: data.phone,
              auth_email: data.email,
            });

          if (tenantError) {
            console.error('Error creating tenant:', tenantError);
          }
        }

        // Update profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: data.role })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      toast.success("สร้างบัญชีผู้ใช้สำเร็จ!");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Create user failed:", error);
      toast.error(error.message || "ไม่สามารถสร้างบัญชีผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>สร้างบัญชีผู้ใช้ใหม่</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ</FormLabel>
                    <FormControl>
                      <Input placeholder="ชื่อ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="นามสกุล" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="อีเมลของผู้ใช้" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทร (ไม่บังคับ)</FormLabel>
                  <FormControl>
                    <Input placeholder="เบอร์โทรศัพท์" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <RoleSelector control={form.control} name="role" />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "กำลังสร้าง..." : "สร้างบัญชี"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
