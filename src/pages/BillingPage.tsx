
import BillingCalculationDialog from "@/components/billing/BillingCalculationDialog";
import BillingHeader from "@/components/billing/components/BillingHeader";
import BillingFilters from "@/components/billing/components/BillingFilters";
import BillingTable from "@/components/billing/components/BillingTable";
import BillingDetailDialog from "@/components/billing/components/BillingDetailDialog";
import { useBillingPage } from "@/components/billing/hooks/useBillingPage";
import { useBillingDetail } from "@/components/billing/hooks/useBillingDetail";

const BillingPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    billings,
    filteredBillings,
    loading,
    showCalculationDialog,
    setShowCalculationDialog,
    fetchBillings,
    handleMarkAsPaid
  } = useBillingPage();

  const {
    selectedBilling,
    isDetailDialogOpen,
    openDetailDialog,
    closeDetailDialog,
    setIsDetailDialogOpen
  } = useBillingDetail();

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <BillingHeader onOpenCalculationDialog={() => setShowCalculationDialog(true)} />

      <BillingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <BillingTable
        billings={billings}
        filteredBillings={filteredBillings}
        onMarkAsPaid={handleMarkAsPaid}
        onViewDetails={openDetailDialog}
      />

      <BillingCalculationDialog
        open={showCalculationDialog}
        onOpenChange={setShowCalculationDialog}
        onBillingCreated={fetchBillings}
      />

      <BillingDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        billing={selectedBilling}
      />
    </div>
  );
};

export default BillingPage;
