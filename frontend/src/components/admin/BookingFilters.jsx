import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export const BookingFilters = ({ filters, onFilterChange, onReset }) => {

  const statusOptions = [
    { value: 'ALL', label: 'All Booking Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'ALL', label: 'All Payment Statuses' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending Payment' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Refunded', label: 'Refunded' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest_amount', label: 'Highest Amount' },
    { value: 'lowest_amount', label: 'Lowest Amount' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            icon={Search}
            placeholder="Search by ID, customer name, email, phone..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters.status || 'ALL'}
          onChange={(e) => onFilterChange('status', e.target.value)}
        />

        {/* Payment Filter */}
        <Select
          options={paymentStatusOptions}
          value={filters.paymentStatus || 'ALL'}
          onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
        />

        {/* Sorting */}
        <Select
          options={sortOptions}
          value={filters.sortBy || 'newest'}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-teal-600" />
          <span>Active Filters Applied</span>
        </div>
        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
