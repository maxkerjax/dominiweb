
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

// Mock tenant data
const mockTenants = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    room: "A-101",
    status: "active",
    moveInDate: "2023-01-15",
    leaseEnd: "2024-01-15",
  },
  {
    id: 2,
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    room: "B-205",
    status: "active",
    moveInDate: "2023-02-01",
    leaseEnd: "2024-02-01",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    room: "C-312",
    status: "pending",
    moveInDate: "2023-03-01",
    leaseEnd: "2024-03-01",
  },
  {
    id: 4,
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    room: "A-110",
    status: "active",
    moveInDate: "2022-11-15",
    leaseEnd: "2023-11-15",
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.lee@example.com",
    room: "B-210",
    status: "inactive",
    moveInDate: "2022-09-01",
    leaseEnd: "2023-09-01",
  },
];

const TenantsPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.room.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="text-muted-foreground">Manage your property tenants</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2">
            <Users size={16} />
            Add New Tenant
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tenant Search</CardTitle>
          <CardDescription>
            Search for tenants by name, email or room number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="Search tenants..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tenant List</CardTitle>
          <CardDescription>
            Showing {filteredTenants.length} of {mockTenants.length} tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Move In Date</TableHead>
                  <TableHead>Lease End</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.name}`} 
                            alt={tenant.name} 
                          />
                          <AvatarFallback>
                            {tenant.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">{tenant.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.room}</TableCell>
                    <TableCell>{new Date(tenant.moveInDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(tenant.leaseEnd).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(tenant.status)}`}>
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantsPage;
