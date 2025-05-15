
import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "th";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(
  undefined
);

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "Dormitory Management System",
    "nav.dashboard": "Dashboard",
    "nav.rooms": "Rooms",
    "nav.tenants": "Tenants",
    "nav.staff": "Staff",
    "nav.billing": "Billing",
    "nav.repairs": "Repairs",
    "nav.announcements": "Announcements",
    "nav.reports": "Reports",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.role": "Role",
    "auth.welcomeBack": "Welcome back",
    "auth.pleaseLogin": "Please login to continue",
    "dashboard.welcome": "Welcome to your Dashboard",
    "dashboard.summary": "Here's a summary of your dormitory",
    "dashboard.totalRooms": "Total Rooms",
    "dashboard.occupiedRooms": "Occupied",
    "dashboard.vacantRooms": "Vacant",
    "dashboard.pendingRepairs": "Pending Repairs",
    "dashboard.monthlyRevenue": "Monthly Revenue",
    "rooms.management": "Room Management",
    "rooms.number": "Room Number",
    "rooms.type": "Room Type",
    "rooms.status": "Status",
    "rooms.rent": "Monthly Rent",
    "rooms.size": "Room Size",
    "rooms.add": "Add Room",
    "rooms.edit": "Edit Room",
    "rooms.delete": "Delete Room",
    "tenants.management": "Tenant Management",
    "tenants.name": "Name",
    "tenants.room": "Room",
    "tenants.contactInfo": "Contact Info",
    "tenants.leaseStart": "Lease Start",
    "tenants.leaseEnd": "Lease End",
    "tenants.add": "Add Tenant",
    "tenants.edit": "Edit Tenant",
    "tenants.delete": "Delete Tenant",
    "repairs.management": "Repair Management",
    "repairs.room": "Room",
    "repairs.description": "Description",
    "repairs.status": "Status",
    "repairs.date": "Date Reported",
    "repairs.add": "Add Repair Request",
    "repairs.edit": "Edit Repair",
    "repairs.delete": "Delete Repair",
    "language.en": "English",
    "language.th": "Thai",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "footer.rights": "All rights reserved",
    "welcome.title": "Welcome to Our Dormitory",
    "welcome.subtitle": "Modern living spaces for students and professionals",
    "welcome.login": "Login to access your account",
    "welcome.explore": "Explore Available Rooms",
    "welcome.features": "Our Features",
    "welcome.location": "Prime Location",
    "welcome.security": "24/7 Security",
    "welcome.amenities": "Modern Amenities",
    "welcome.contact": "Contact Us",
    // Add more translations as needed
  },
  th: {
    "app.title": "ระบบจัดการหอพัก",
    "nav.dashboard": "แดชบอร์ด",
    "nav.rooms": "ห้องพัก",
    "nav.tenants": "ผู้เช่า",
    "nav.staff": "พนักงาน",
    "nav.billing": "การเงิน",
    "nav.repairs": "แจ้งซ่อม",
    "nav.announcements": "ประกาศ",
    "nav.reports": "รายงาน",
    "nav.profile": "โปรไฟล์",
    "nav.settings": "ตั้งค่า",
    "auth.login": "เข้าสู่ระบบ",
    "auth.logout": "ออกจากระบบ",
    "auth.register": "ลงทะเบียน",
    "auth.email": "อีเมล",
    "auth.password": "รหัสผ่าน",
    "auth.confirmPassword": "ยืนยันรหัสผ่าน",
    "auth.role": "ตำแหน่ง",
    "auth.welcomeBack": "ยินดีต้อนรับกลับ",
    "auth.pleaseLogin": "กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ",
    "dashboard.welcome": "ยินดีต้อนรับสู่แดชบอร์ดของคุณ",
    "dashboard.summary": "นี่คือสรุปข้อมูลหอพักของคุณ",
    "dashboard.totalRooms": "จำนวนห้องทั้งหมด",
    "dashboard.occupiedRooms": "ห้องที่มีผู้เช่า",
    "dashboard.vacantRooms": "ห้องว่าง",
    "dashboard.pendingRepairs": "การซ่อมแซมที่รอดำเนินการ",
    "dashboard.monthlyRevenue": "รายได้ประจำเดือน",
    "rooms.management": "จัดการห้องพัก",
    "rooms.number": "หมายเลขห้อง",
    "rooms.type": "ประเภทห้อง",
    "rooms.status": "สถานะ",
    "rooms.rent": "ค่าเช่ารายเดือน",
    "rooms.size": "ขนาดห้อง",
    "rooms.add": "เพิ่มห้อง",
    "rooms.edit": "แก้ไขห้อง",
    "rooms.delete": "ลบห้อง",
    "tenants.management": "จัดการผู้เช่า",
    "tenants.name": "ชื่อ",
    "tenants.room": "ห้อง",
    "tenants.contactInfo": "ข้อมูลติดต่อ",
    "tenants.leaseStart": "วันเริ่มสัญญา",
    "tenants.leaseEnd": "วันสิ้นสุดสัญญา",
    "tenants.add": "เพิ่มผู้เช่า",
    "tenants.edit": "แก้ไขข้อมูลผู้เช่า",
    "tenants.delete": "ลบผู้เช่า",
    "repairs.management": "จัดการการซ่อมแซม",
    "repairs.room": "ห้อง",
    "repairs.description": "รายละเอียด",
    "repairs.status": "สถานะ",
    "repairs.date": "วันที่แจ้ง",
    "repairs.add": "เพิ่มการแจ้งซ่อม",
    "repairs.edit": "แก้ไขการซ่อม",
    "repairs.delete": "ลบการซ่อม",
    "language.en": "อังกฤษ",
    "language.th": "ไทย",
    "theme.light": "สว่าง",
    "theme.dark": "มืด",
    "footer.rights": "สงวนลิขสิทธิ์",
    "welcome.title": "ยินดีต้อนรับสู่หอพักของเรา",
    "welcome.subtitle": "พื้นที่พักอาศัยทันสมัยสำหรับนักศึกษาและมืออาชีพ",
    "welcome.login": "เข้าสู่ระบบเพื่อเข้าถึงบัญชีของคุณ",
    "welcome.explore": "ดูห้องพักที่มี",
    "welcome.features": "สิ่งอำนวยความสะดวก",
    "welcome.location": "ทำเลดี",
    "welcome.security": "ระบบรักษาความปลอดภัย 24 ชั่วโมง",
    "welcome.amenities": "สิ่งอำนวยความสะดวกทันสมัย",
    "welcome.contact": "ติดต่อเรา",
    // Add more translations as needed
  },
};

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || defaultLanguage
  );

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage: (language: Language) => {
      setLanguage(language);
    },
    t,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
