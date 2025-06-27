import React, { useState } from "react";
import {
  HiAdjustments,
  HiCalendar,
  HiCreditCard,
  HiX,
  HiRefresh,
  HiChevronDown,
  HiChevronUp,
  HiSearch,
} from "react-icons/hi";

interface Props {
  // props bạn đã có
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  paymentFilter: string;
  setPaymentFilter: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  discountSearch: string;
  setDiscountSearch: (v: string) => void;
  onReset: () => void;
}

const FilterBar: React.FC<Props> = (p) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const activeCount =
    (p.statusFilter !== "ALL" ? 1 : 0) +
    (p.paymentFilter !== "ALL" ? 1 : 0) +
    (p.startDate ? 1 : 0) +
    (p.endDate ? 1 : 0) +
    (p.discountSearch ? 1 : 0);

  return (
    <div className="relative mb-8 rounded-2xl bg-white/80 shadow-xl ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300">
      {/* Header with toggle */}
      <div className="flex items-center justify-between gap-3 p-6 pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-lg font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <HiAdjustments className="h-5 w-5" />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600/90 px-2 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
          {isExpanded ? (
            <HiChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <HiChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={p.onReset}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <HiRefresh className="h-4 w-4" /> 
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Collapsible filter content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6">
          {/* Filter grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {/* STATUS */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <select
                value={p.statusFilter}
                onChange={(e) => p.setStatusFilter(e.target.value)}
                className="rounded-lg border-gray-300 bg-white/90 text-sm shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              >
                {[
                  "ALL",
                  "PENDING",
                  "PROCESSING",
                  "SHIPPED",
                  "DELIVERED",
                  "CANCELLED",
                  "REFUNDED",
                ].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* PAYMENT */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <HiCreditCard className="h-4 w-4" />
                Payment
              </label>
              <select
                value={p.paymentFilter}
                onChange={(e) => p.setPaymentFilter(e.target.value)}
                className="rounded-lg border-gray-300 bg-white/90 text-sm shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              >
                {["ALL", "COD", "ONLINE"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* FROM */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <HiCalendar className="h-4 w-4" />
                From
              </label>
              <input
                type="date"
                value={p.startDate}
                onChange={(e) => p.setStartDate(e.target.value)}
                className="rounded-lg border-gray-300 bg-white/90 text-sm shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
            </div>

            {/* TO */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <HiCalendar className="h-4 w-4" />
                To
              </label>
              <input
                type="date"
                value={p.endDate}
                onChange={(e) => p.setEndDate(e.target.value)}
                className="rounded-lg border-gray-300 bg-white/90 text-sm shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
            </div>

            {/* DISCOUNT */}
            <div className="flex flex-col gap-2 lg:col-span-2 xl:col-span-1">
              <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <HiSearch className="h-4 w-4" />
                Discount Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search discount code..."
                  value={p.discountSearch}
                  onChange={(e) => p.setDiscountSearch(e.target.value)}
                  className="w-full rounded-lg border-gray-300 bg-white/90 pl-9 pr-9 text-sm shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
                <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                {p.discountSearch && (
                  <button
                    onClick={() => p.setDiscountSearch("")}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <HiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {p.statusFilter !== "ALL" && (
                  <Chip
                    text={`Status: ${p.statusFilter}`}
                    onClear={() => p.setStatusFilter("ALL")}
                  />
                )}
                {p.paymentFilter !== "ALL" && (
                  <Chip
                    text={`Payment: ${p.paymentFilter}`}
                    onClear={() => p.setPaymentFilter("ALL")}
                  />
                )}
                {p.startDate && (
                  <Chip
                    text={`From: ${p.startDate}`}
                    onClear={() => p.setStartDate("")}
                  />
                )}
                {p.endDate && (
                  <Chip 
                    text={`To: ${p.endDate}`} 
                    onClear={() => p.setEndDate("")} 
                  />
                )}
                {p.discountSearch && (
                  <Chip
                    text={`Discount: ${p.discountSearch}`}
                    onClear={() => p.setDiscountSearch("")}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

/* ---------------------- Chip sub-component --------------------- */
const Chip = ({ text, onClear }: { text: string; onClear: () => void }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
    {text}
    <button
      onClick={onClear}
      className="flex items-center justify-center h-4 w-4 rounded-full hover:bg-emerald-200 transition-colors"
    >
      <HiX className="h-3 w-3 hover:text-red-600" />
    </button>
  </span>
);
