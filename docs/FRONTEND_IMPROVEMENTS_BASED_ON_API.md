# Frontend Improvements - Berdasarkan API yang Ada

Rekomendasi improvement frontend yang **sesuai dengan API yang sudah tersedia** (36 endpoints).

---

## 🎯 Priority 1: Fitur yang Belum Dimanfaatkan Optimal

### 1. Resident Management - Move Out Feature

**API Available**: `PATCH /residents/:id/move-out`

**Current State**: 
- API sudah ada di `residentsApi.moveOut()`
- Belum ada UI untuk trigger move-out

**Improvement**:
```tsx
// Di residents/[id]/page.tsx - tambahkan button Move Out
<Button 
  variant="destructive"
  onClick={handleMoveOut}
>
  <UserX className="w-4 h-4 mr-2" />
  Process Move Out
</Button>

const handleMoveOut = async () => {
  const confirmed = await confirm({
    title: 'Process Move Out',
    description: 'Resident akan di-mark sebagai inactive. Lanjutkan?',
  });
  
  if (confirmed) {
    await moveOutMutation.mutateAsync(residentId);
    toast.success('Resident berhasil di-move out');
  }
};
```

**Estimasi**: 1 jam

---

### 2. Invoice - Payment Status Update

**API Available**: `PATCH /invoices/:id/payment`

**Current State**:
- API ada di `invoicesApi.updatePayment()`
- UI untuk update payment sudah ada tapi bisa ditingkatkan

**Improvement**:
- Tambahkan **partial payment** input (bukan hanya mark as paid)
- Tambahkan **payment method** selection
- Tambahkan **payment date** picker
- Show **remaining amount** untuk partial payment

```tsx
// components/forms/PaymentForm.tsx
<form onSubmit={handleSubmit}>
  <div>
    <Label>Payment Amount</Label>
    <Input 
      type="number" 
      value={amount}
      max={remainingAmount}
    />
    <p className="text-sm text-gray-500">
      Remaining: Rp {remainingAmount.toLocaleString()}
    </p>
  </div>
  
  <div>
    <Label>Payment Method</Label>
    <Select value={method} onValueChange={setMethod}>
      <SelectItem value="cash">Cash</SelectItem>
      <SelectItem value="transfer">Transfer</SelectItem>
      <SelectItem value="e-wallet">E-Wallet</SelectItem>
    </Select>
  </div>
  
  <div>
    <Label>Payment Date</Label>
    <Input type="date" value={paymentDate} />
  </div>
  
  <Button type="submit">Record Payment</Button>
</form>
```

**Estimasi**: 2 jam

---

### 3. Laundry - Status & Payment Update

**API Available**: 
- `PATCH /laundry/:id/status`
- `PATCH /laundry/:id/payment`

**Current State**:
- API sudah ada
- UI bisa lebih user-friendly

**Improvement**:
- Tambahkan **status timeline** (pending → processing → ready → delivered)
- Tambahkan **quick action buttons** untuk update status
- Tambahkan **payment recording** di detail page

```tsx
// app/(dashboard)/laundry/[id]/page.tsx
<Card>
  <CardHeader>
    <CardTitle>Status Timeline</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {statusSteps.map((step) => (
        <div key={step.status} className="flex items-center gap-4">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            currentStatus === step.status ? "bg-blue-600 text-white" : "bg-gray-200"
          )}>
            {step.icon}
          </div>
          <div className="flex-1">
            <p className="font-medium">{step.label}</p>
            {step.timestamp && (
              <p className="text-sm text-gray-500">{step.timestamp}</p>
            )}
          </div>
          {currentStatus === step.status && (
            <Button 
              size="sm"
              onClick={() => updateStatus(step.nextStatus)}
            >
              Mark as {step.nextLabel}
            </Button>
          )}
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

**Estimasi**: 2 jam

---

### 4. Utilities - Better Display & Filtering

**API Available**: 
- `POST /utilities`
- `GET /utilities/resident/:id`

**Current State**:
- Utilities page ada tapi basic
- Tidak ada filtering by date range
- Tidak ada summary per resident

**Improvement**:
- Tambahkan **date range filter**
- Tambahkan **utility type filter** (electricity, water, gas)
- Tambahkan **summary card** (total per type)
- Tambahkan **chart** untuk usage trend

```tsx
// app/(dashboard)/utilities/page.tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <Card>
    <CardHeader>
      <CardTitle>Electricity</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">
        {electricityTotal.toLocaleString()} kWh
      </p>
      <p className="text-sm text-gray-500">
        Rp {electricityCost.toLocaleString()}
      </p>
    </CardContent>
  </Card>
  {/* Similar for water & gas */}
</div>

<DateRangeFilter 
  startDate={startDate}
  endDate={endDate}
  onChange={handleDateChange}
/>

<LineChart 
  data={utilityTrend}
  xKey="month"
  yKey="amount"
/>
```

**Estimasi**: 3 jam

---

### 5. Complaints - Status Management

**API Available**: `PATCH /complaints/:id/status`

**Current State**:
- Status update ada tapi bisa lebih visual
- Tidak ada comment/notes saat update status

**Improvement**:
- Tambahkan **status badge** dengan color coding
- Tambahkan **notes field** saat update status
- Tambahkan **status history** timeline
- Tambahkan **priority indicator**

```tsx
// app/(dashboard)/complaints/[id]/page.tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Complaint Status</CardTitle>
      <Badge variant={getStatusVariant(status)}>
        {status}
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Select value={newStatus} onValueChange={setNewStatus}>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </Select>
      
      <Textarea 
        placeholder="Add notes about this status update..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      
      <Button onClick={handleUpdateStatus}>
        Update Status
      </Button>
    </div>
    
    {/* Status History */}
    <div className="mt-6">
      <h4 className="font-medium mb-2">Status History</h4>
      <div className="space-y-2">
        {statusHistory.map((history) => (
          <div key={history.id} className="flex gap-2 text-sm">
            <span className="text-gray-500">{history.date}</span>
            <span className="font-medium">{history.status}</span>
            {history.notes && (
              <span className="text-gray-600">- {history.notes}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </CardContent>
</Card>
```

**Estimasi**: 2 jam

---

## 🎯 Priority 2: Data Visualization & Analytics

### 6. Financial Reports - Enhanced Dashboard

**API Available**: `GET /reports/financial`

**Current State**:
- Reports page sudah ada dengan basic charts
- Bisa ditingkatkan dengan more insights

**Improvement**:
- Tambahkan **comparison** (month-over-month, year-over-year)
- Tambahkan **breakdown by category**
- Tambahkan **export to Excel/PDF**
- Tambahkan **date range selector**

```tsx
// app/(dashboard)/reports/page.tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Revenue vs Expenses */}
  <Card>
    <CardHeader>
      <CardTitle>Revenue vs Expenses</CardTitle>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant={period === 'month' ? 'default' : 'outline'}
          onClick={() => setPeriod('month')}
        >
          Monthly
        </Button>
        <Button 
          size="sm"
          variant={period === 'year' ? 'default' : 'outline'}
          onClick={() => setPeriod('year')}
        >
          Yearly
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <BarChart 
        data={revenueVsExpenses}
        categories={['revenue', 'expenses']}
      />
    </CardContent>
  </Card>
  
  {/* Expense Breakdown */}
  <Card>
    <CardHeader>
      <CardTitle>Expense Breakdown</CardTitle>
    </CardHeader>
    <CardContent>
      <PieChart 
        data={expenseBreakdown}
        nameKey="category"
        valueKey="amount"
      />
    </CardContent>
  </Card>
</div>

{/* Comparison */}
<Card>
  <CardHeader>
    <CardTitle>Month-over-Month Comparison</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">This Month</p>
        <p className="text-2xl font-bold">
          Rp {thisMonth.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Last Month</p>
        <p className="text-2xl font-bold">
          Rp {lastMonth.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Change</p>
        <p className={cn(
          "text-2xl font-bold",
          change > 0 ? "text-green-600" : "text-red-600"
        )}>
          {change > 0 ? '+' : ''}{change}%
        </p>
      </div>
    </div>
  </CardContent>
</Card>

{/* Export Buttons */}
<div className="flex gap-2">
  <Button onClick={exportToExcel}>
    <FileSpreadsheet className="w-4 h-4 mr-2" />
    Export to Excel
  </Button>
  <Button onClick={exportToPDF}>
    <FileText className="w-4 h-4 mr-2" />
    Export to PDF
  </Button>
</div>
```

**Estimasi**: 4 jam

---

### 7. Dashboard - Real-time Overview

**Current State**:
- Dashboard ada tapi bisa lebih comprehensive

**Improvement**:
- Tambahkan **occupancy rate** (rooms occupied vs available)
- Tambahkan **payment collection rate** (paid vs unpaid invoices)
- Tambahkan **upcoming due dates** (invoices due in 7 days)
- Tambahkan **recent activities** (new residents, payments, complaints)
- Tambahkan **quick actions** (generate invoice, add resident, etc)

```tsx
// app/(dashboard)/dashboard/page.tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {/* Occupancy Rate */}
  <Card>
    <CardHeader>
      <CardTitle>Occupancy Rate</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">
        {occupancyRate}%
      </div>
      <p className="text-sm text-gray-500">
        {occupiedRooms} of {totalRooms} rooms occupied
      </p>
      <Progress value={occupancyRate} className="mt-2" />
    </CardContent>
  </Card>
  
  {/* Collection Rate */}
  <Card>
    <CardHeader>
      <CardTitle>Collection Rate</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">
        {collectionRate}%
      </div>
      <p className="text-sm text-gray-500">
        Rp {collectedAmount.toLocaleString()} collected
      </p>
      <Progress value={collectionRate} className="mt-2" />
    </CardContent>
  </Card>
  
  {/* Pending Complaints */}
  <Card>
    <CardHeader>
      <CardTitle>Pending Complaints</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-orange-600">
        {pendingComplaints}
      </div>
      <Link href="/complaints?status=pending" className="text-sm text-blue-600 hover:underline">
        View all →
      </Link>
    </CardContent>
  </Card>
  
  {/* Overdue Invoices */}
  <Card>
    <CardHeader>
      <CardTitle>Overdue Invoices</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-red-600">
        {overdueInvoices}
      </div>
      <p className="text-sm text-gray-500">
        Rp {overdueAmount.toLocaleString()}
      </p>
      <Link href="/invoices?status=overdue" className="text-sm text-blue-600 hover:underline">
        View all →
      </Link>
    </CardContent>
  </Card>
</div>

{/* Upcoming Due Dates */}
<Card>
  <CardHeader>
    <CardTitle>Upcoming Due Dates (Next 7 Days)</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      {upcomingInvoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <p className="font-medium">{invoice.resident.name}</p>
            <p className="text-sm text-gray-500">
              Room {invoice.room.roomNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              Rp {invoice.totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Due: {format(parseISO(invoice.dueDate), 'dd MMM yyyy')}
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/invoices/${invoice.id}`}>
              View
            </Link>
          </Button>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

{/* Quick Actions */}
<Card>
  <CardHeader>
    <CardTitle>Quick Actions</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Button asChild>
        <Link href="/residents/new">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Resident
        </Link>
      </Button>
      <Button asChild>
        <Link href="/invoices/generate">
          <FileText className="w-4 h-4 mr-2" />
          Generate Invoice
        </Link>
      </Button>
      <Button asChild>
        <Link href="/expenses/new">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Link>
      </Button>
      <Button asChild>
        <Link href="/complaints/new">
          <AlertCircle className="w-4 h-4 mr-2" />
          New Complaint
        </Link>
      </Button>
    </div>
  </CardContent>
</Card>
```

**Estimasi**: 4 jam

---

## 🎯 Priority 3: User Experience Enhancements

### 8. Advanced Filtering & Search

**Current State**:
- Basic search ada di semua pages
- Filtering terbatas

**Improvement**:
- Tambahkan **multi-field search** (search across multiple columns)
- Tambahkan **advanced filters** (date range, amount range, etc)
- Tambahkan **saved filters** (save frequently used filters)
- Tambahkan **sort options** (multiple sort fields)

```tsx
// components/filters/AdvancedFilter.tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <Filter className="w-4 h-4 mr-2" />
      Advanced Filters
      {activeFiltersCount > 0 && (
        <Badge className="ml-2">{activeFiltersCount}</Badge>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-4">
      <div>
        <Label>Date Range</Label>
        <DateRangePicker 
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={handleDateChange}
        />
      </div>
      
      <div>
        <Label>Amount Range</Label>
        <div className="flex gap-2">
          <Input 
            type="number"
            placeholder="Min"
            value={filters.minAmount}
            onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
          />
          <Input 
            type="number"
            placeholder="Max"
            value={filters.maxAmount}
            onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
          />
        </div>
      </div>
      
      <div>
        <Label>Status</Label>
        <Select 
          value={filters.status}
          onValueChange={(value) => setFilters({...filters, status: value})}
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>
      
      {/* Save Filter */}
      <div className="border-t pt-4">
        <Label>Save this filter</Label>
        <div className="flex gap-2 mt-2">
          <Input 
            placeholder="Filter name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <Button onClick={saveFilter}>
            Save
          </Button>
        </div>
      </div>
      
      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="border-t pt-4">
          <Label>Saved Filters</Label>
          <div className="space-y-2 mt-2">
            {savedFilters.map((filter) => (
              <div key={filter.id} className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => loadFilter(filter)}
                >
                  {filter.name}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteFilter(filter.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </PopoverContent>
</Popover>
```

**Estimasi**: 3 jam

---

### 9. Bulk Operations

**Current State**:
- Hanya bisa delete/update satu-satu

**Improvement**:
- Tambahkan **checkbox selection** di table
- Tambahkan **bulk actions** (delete, update status, export)
- Tambahkan **select all** functionality

```tsx
// components/tables/DataTable.tsx
const [selectedIds, setSelectedIds] = useState<string[]>([]);

<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-12">
        <Checkbox 
          checked={selectedIds.length === data.length}
          onCheckedChange={handleSelectAll}
        />
      </TableHead>
      <TableHead>Name</TableHead>
      {/* ... other columns */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>
          <Checkbox 
            checked={selectedIds.includes(item.id)}
            onCheckedChange={() => handleSelectItem(item.id)}
          />
        </TableCell>
        <TableCell>{item.name}</TableCell>
        {/* ... other cells */}
      </TableRow>
    ))}
  </TableBody>
</Table>

{/* Bulk Actions Bar */}
{selectedIds.length > 0 && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
    <span className="text-sm font-medium">
      {selectedIds.length} items selected
    </span>
    <Button 
      size="sm"
      variant="outline"
      onClick={handleBulkExport}
    >
      <Download className="w-4 h-4 mr-2" />
      Export
    </Button>
    <Button 
      size="sm"
      variant="destructive"
      onClick={handleBulkDelete}
    >
      <Trash className="w-4 h-4 mr-2" />
      Delete
    </Button>
    <Button 
      size="sm"
      variant="ghost"
      onClick={() => setSelectedIds([])}
    >
      Cancel
    </Button>
  </div>
)}
```

**Estimasi**: 2 jam

---

### 10. Invoice Generation - Batch Mode

**API Available**: `POST /invoices/generate/:residentId`

**Current State**:
- Generate invoice satu-satu per resident

**Improvement**:
- Tambahkan **batch generation** (generate untuk semua active residents)
- Tambahkan **preview** sebelum generate
- Tambahkan **filter** (by room, by billing cycle date)

```tsx
// app/(dashboard)/invoices/generate/page.tsx
<Card>
  <CardHeader>
    <CardTitle>Batch Invoice Generation</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>
        <Label>Select Residents</Label>
        <Select value={selectionMode} onValueChange={setSelectionMode}>
          <SelectItem value="all">All Active Residents</SelectItem>
          <SelectItem value="by-date">By Billing Cycle Date</SelectItem>
          <SelectItem value="by-room">By Room</SelectItem>
          <SelectItem value="manual">Manual Selection</SelectItem>
        </Select>
      </div>
      
      {selectionMode === 'by-date' && (
        <div>
          <Label>Billing Cycle Date</Label>
          <Select value={billingDate} onValueChange={setBillingDate}>
            {[...Array(31)].map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
      
      {/* Preview */}
      <div className="border rounded p-4">
        <h4 className="font-medium mb-2">Preview ({selectedResidents.length} residents)</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedResidents.map((resident) => (
            <div key={resident.id} className="flex items-center justify-between text-sm">
              <span>{resident.name} - Room {resident.room.roomNumber}</span>
              <span className="font-medium">
                Rp {calculateInvoiceAmount(resident).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-2 pt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>Rp {totalAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <Button 
        onClick={handleBatchGenerate}
        disabled={selectedResidents.length === 0}
        className="w-full"
      >
        Generate {selectedResidents.length} Invoices
      </Button>
    </div>
  </CardContent>
</Card>
```

**Estimasi**: 3 jam

---

## 📊 Summary & Timeline

### Quick Wins (1-2 hari)
1. ✅ Resident Move Out UI (1 jam)
2. ✅ Enhanced Payment Form (2 jam)
3. ✅ Laundry Status Timeline (2 jam)
4. ✅ Complaints Status Management (2 jam)

**Total**: 7 jam

### Medium Priority (3-5 hari)
5. ✅ Utilities Enhancement (3 jam)
6. ✅ Financial Reports Dashboard (4 jam)
7. ✅ Enhanced Main Dashboard (4 jam)
8. ✅ Advanced Filtering (3 jam)

**Total**: 14 jam

### Advanced Features (1 minggu)
9. ✅ Bulk Operations (2 jam)
10. ✅ Batch Invoice Generation (3 jam)

**Total**: 5 jam

---

## 🎯 Implementation Priority

### Week 1: Core Features
- Resident Move Out
- Enhanced Payment Form
- Laundry Status Timeline
- Complaints Status Management

### Week 2: Analytics & Visualization
- Utilities Enhancement
- Financial Reports Dashboard
- Enhanced Main Dashboard

### Week 3: Advanced UX
- Advanced Filtering
- Bulk Operations
- Batch Invoice Generation

---

## ✅ Testing Checklist

Setelah implementasi, pastikan:

- [ ] Semua API calls berhasil
- [ ] Error handling proper
- [ ] Loading states ada
- [ ] Success/error toast notifications
- [ ] Responsive di mobile
- [ ] Keyboard navigation works
- [ ] Data refresh setelah mutation
- [ ] Validation messages jelas

---

## 📝 Notes

- **Semua improvement ini menggunakan API yang SUDAH ADA**
- Tidak perlu perubahan backend
- Fokus pada UX dan data visualization
- Bisa dikerjakan incremental
- Test setiap feature sebelum lanjut

**Prioritas**: Mulai dari Quick Wins untuk hasil cepat dan visible impact!
