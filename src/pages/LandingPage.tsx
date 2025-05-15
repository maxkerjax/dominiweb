
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageProvider";
import { Building, CheckCircle2, MapPin, Lock, WifiIcon } from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();
  const [roomTypes] = useState([
    {
      id: 1,
      name: "Standard Room",
      nameTh: "ห้องมาตรฐาน",
      price: "3,500",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      available: true,
    },
    {
      id: 2,
      name: "Deluxe Room",
      nameTh: "ห้องดีลักซ์",
      price: "4,500",
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      available: true,
    },
    {
      id: 3,
      name: "Suite Room",
      nameTh: "ห้องสวีท",
      price: "5,500",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2339&q=80",
      available: false,
    },
  ]);

  const features = [
    {
      icon: WifiIcon,
      title: "Free Wi-Fi",
      titleTh: "Wi-Fi ฟรี",
      description: "High-speed internet in all rooms",
      descriptionTh: "อินเทอร์เน็ตความเร็วสูงในทุกห้อง",
    },
    {
      icon: Lock,
      title: "24/7 Security",
      titleTh: "ระบบรักษาความปลอดภัย 24 ชม.",
      description: "CCTV and keycard access system",
      descriptionTh: "ระบบ CCTV และคีย์การ์ด",
    },
    {
      icon: Building,
      title: "Modern Facilities",
      titleTh: "สิ่งอำนวยความสะดวกทันสมัย",
      description: "Gym, laundry, and common areas",
      descriptionTh: "ฟิตเนส, ซักรีด และพื้นที่ส่วนกลาง",
    },
    {
      icon: MapPin,
      title: "Prime Location",
      titleTh: "ทำเลดี",
      description: "Close to universities and shopping centers",
      descriptionTh: "ใกล้มหาวิทยาลัยและห้างสรรพสินค้า",
    },
  ];

  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary">
                  {t("app.title")}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Link to="/login">
                <Button variant="default">{t("auth.login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 z-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
              {t("welcome.title")}
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              {t("welcome.subtitle")}
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/login">
                <Button size="lg">{t("welcome.login")}</Button>
              </Link>
              <Button size="lg" variant="outline">
                {t("welcome.explore")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground">
              {t("welcome.features")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-lg shadow-sm border border-border"
              >
                <div className="inline-flex items-center justify-center rounded-md p-2 bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">
                  {language === "en" ? feature.title : feature.titleTh}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {language === "en"
                    ? feature.description
                    : feature.descriptionTh}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Rooms */}
      <div className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground">
              {t("welcome.explore")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((room) => (
              <div
                key={room.id}
                className="bg-card rounded-lg overflow-hidden shadow-md border border-border"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={language === "en" ? room.name : room.nameTh}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {language === "en" ? room.name : room.nameTh}
                    </h3>
                    <p className="font-bold text-primary">{room.price} THB</p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <CheckCircle2
                      className={`h-5 w-5 mr-2 ${
                        room.available
                          ? "text-emerald-500"
                          : "text-destructive"
                      }`}
                    />
                    <p className="text-sm">
                      {room.available ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background text-foreground border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t("app.title")}</h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                nec odio.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">
                {t("welcome.contact")}
              </h3>
              <p className="text-muted-foreground">123 Main St, City</p>
              <p className="text-muted-foreground">Phone: 123-456-7890</p>
              <p className="text-muted-foreground">Email: info@dormitory.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-foreground hover:text-primary">
                  Facebook
                </a>
                <a href="#" className="text-foreground hover:text-primary">
                  Twitter
                </a>
                <a href="#" className="text-foreground hover:text-primary">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {t("app.title")}. {t("footer.rights")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
