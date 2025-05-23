
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, Filter, Download } from "lucide-react";

// Mock billing data
const mockBillings = [
  {
    id: 1,
    invoiceNumber: "INV-2025-001",
    tenant: "John Smith",
    roomNumber: "A-101",
    amount: 850.00,
    status: "paid",
    dueDate: "2025-04-15",
    paidDate: "2025-04-10",
  },
  {
    id: 2,
    invoiceNumber: "INV-2025-002",
    tenant: "Sarah Johnson",
    roomNumber: "B-205",
    amount: 950.00,
    status: "pending",
    dueDate: "2025-05-15",
    paidDate: null,
  },
  {
    id: 3,
    invoiceNumber: "INV-2025-003",
    tenant: "Michael Chen",
    roomNumber: "C-310",
    amount: 750.00,
    status: "overdue",
    dueDate: "2025-04-30",
    paidDate: null,
  },
  {
    id: 4,
    invoiceNumber: "INV-2025-004",
    tenant: "Emily Wilson",
    roomNumber: "A-103",
    amount: 850.00,
    status: "paid",
    dueDate: "2025-04-15",
    paidDate: "2025-04-08",
  },
  {
    id: 5,
    invoiceNumber: "INV-2025-005",
    tenant: "David Rodriguez",
    roomNumber: "B-208",
    amount: 950.00,
    status: "pending",
    dueDate: "2025-05-15",
    paidDate: null,
  },
];

const BillingPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBillings = mockBillings.filter(billing => {
    const matchesSearch = 
      billing.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || billing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage dormitory billing and invoices</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Receipt size={16} />
            Create Invoice
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find invoices by tenant name, invoice number, or room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Search invoices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Showing {filteredBillings.length} of {mockBillings.length} invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBillings.length > 0 ? (
                  filteredBillings.map((billing) => (
                    <TableRow key={billing.id}>
                      <TableCell className="font-medium">{billing.invoiceNumber}</TableCell>
                      <TableCell>{billing.tenant}</TableCell>
                      <TableCell>{billing.roomNumber}</TableCell>
                      <TableCell>{formatCurrency(billing.amount)}</TableCell>
                      <TableCell>{new Date(billing.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(billing.status)}`}>
                          {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No invoices found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
