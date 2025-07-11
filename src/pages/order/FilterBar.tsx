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
    <div className="relative mb-8 rounded-3xl bg-gradient-to-br from-white via-emerald-50/20 to-white shadow-2xl ring-1 ring-emerald-200/60 backdrop-blur-lg transition-all duration-500 hover:shadow-3xl hover:ring-emerald-300/70">
      {/* Header with toggle */}
      <div className="flex items-center justify-between gap-3 p-8 pb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 text-xl font-bold text-emerald-700 hover:text-emerald-800 transition-all duration-300 hover:scale-105"
        >
          <HiAdjustments className="h-5 w-5" />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 text-xs font-extrabold text-white shadow-lg ring-2 ring-white/50 animate-pulse">
              {activeCount}
            </span>
          )}
          {isExpanded ? (
            <HiChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <HiChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>

        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={p.onReset}
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100/80 hover:bg-red-100 hover:text-red-600 hover:shadow-lg hover:scale-105 transition-all duration-300 ring-1 ring-gray-200/50 backdrop-blur-sm"
            >
              <HiRefresh className="h-4 w-4" /> 
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Collapsible filter content */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-8">
          {/* Filter grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {/* STATUS */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-gray-800">Status</label>
              <select
                value={p.statusFilter}
                onChange={(e) => p.setStatusFilter(e.target.value)}
                className="rounded-2xl border-emerald-200/60 bg-white/95 text-sm shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/30 transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm ring-1 ring-emerald-100/50 py-3 px-4 font-medium"
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
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <HiCreditCard className="h-5 w-5 text-emerald-600" />
                Payment
              </label>
              <select
                value={p.paymentFilter}
                onChange={(e) => p.setPaymentFilter(e.target.value)}
                className="rounded-2xl border-emerald-200/60 bg-white/95 text-sm shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/30 transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm ring-1 ring-emerald-100/50 py-3 px-4 font-medium"
              >
                {["ALL", "COD", "ONLINE"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* FROM */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <HiCalendar className="h-5 w-5 text-emerald-600" />
                From
              </label>
              <input
                type="date"
                value={p.startDate}
                onChange={(e) => p.setStartDate(e.target.value)}
                className="rounded-2xl border-emerald-200/60 bg-white/95 text-sm shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/30 transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm ring-1 ring-emerald-100/50 py-3 px-4 font-medium"
              />
            </div>

            {/* TO */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <HiCalendar className="h-5 w-5 text-emerald-600" />
                To
              </label>
              <input
                type="date"
                value={p.endDate}
                onChange={(e) => p.setEndDate(e.target.value)}
                className="rounded-2xl border-emerald-200/60 bg-white/95 text-sm shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/30 transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm ring-1 ring-emerald-100/50 py-3 px-4 font-medium"
              />
            </div>

            {/* DISCOUNT */}
            <div className="flex flex-col gap-3 lg:col-span-2 xl:col-span-1">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <HiSearch className="h-5 w-5 text-emerald-600" />
                Discount Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search discount code..."
                  value={p.discountSearch}
                  onChange={(e) => p.setDiscountSearch(e.target.value)}
                  className="w-full rounded-2xl border-emerald-200/60 bg-white/95 pl-12 pr-12 py-3 text-sm shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/30 transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm ring-1 ring-emerald-100/50 font-medium"
                />
                <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
                {p.discountSearch && (
                  <button
                    onClick={() => p.setDiscountSearch("")}
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 rounded-full hover:bg-red-50"
                  >
                    <HiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="mt-8 pt-6 border-t border-emerald-200/50">
              <div className="flex flex-wrap gap-3">
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
  <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-800 ring-2 ring-emerald-200/70 shadow-lg backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
    {text}
    <button
      onClick={onClear}
      className="flex items-center justify-center h-5 w-5 rounded-full bg-red-100 hover:bg-red-200 hover:scale-110 transition-all duration-200 ring-1 ring-red-200"
    >
      <HiX className="h-3 w-3 text-red-600 hover:text-red-700" />
    </button>
  </span>
);
