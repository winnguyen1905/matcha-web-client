import { Discount } from "@/lib/schema";

const DiscountInfo: React.FC<{
  discount: Discount;
  saved: number;
  onRemove: () => void;
}> = ({ discount, saved, onRemove }) => {
  const hasLimit = !!discount.usageLimit && discount.usageLimit > 0;
  const usedPct = hasLimit
    ? Math.min(
      100,
      Math.round((discount.usageCount / discount.usageLimit!) * 100),
    )
    : 0;

  const valueLabel =
    discount.discountType === 'PERCENTAGE'
      ? `${discount.value}%`
      : `$${discount.value}`;

  return (
    <div className="relative bg-green-50 dark:bg-green-900/40 border border-green-500 rounded-md overflow-hidden">
      {/* ---------- TOP: code + description ---------- */}
      <div className="p-4 flex gap-3 items-start">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
          %
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            {discount.code}
          </p>
          {discount.description && (
            <p className="text-xs text-green-700/80 dark:text-green-400/80 line-clamp-2">
              {discount.description}
            </p>
          )}
        </div>
      </div>

      {/* ---------- BOTTOM: percent/amount saved + usage ---------- */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between">
          <div className="text-sm font-medium text-green-800 dark:text-green-200">
            {valueLabel} off
          </div>
          <div className="text-sm font-semibold text-green-900 dark:text-green-100">
            −${saved.toLocaleString()}
          </div>
        </div>

        {/* usage line + percent */}
        {hasLimit && (
          <>
            <div className="w-full h-1 mt-2 bg-green-200 dark:bg-green-700/40 rounded overflow-hidden">
              <div
                className="h-full bg-green-600"
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="text-[10px] mt-1 text-green-700 dark:text-green-400 text-right">
              {usedPct}% used ({discount.usageCount}/{discount.usageLimit})
            </p>
          </>
        )}
      </div>

      {/* remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-green-600 hover:text-red-500 transition-colors"
        aria-label="Remove discount"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.47 7.47a.75.75 0 011.06 0L12 10.94l3.47-3.47a.75.75 0 111.06 1.06L13.06 12l3.47 3.47a.75.75 0 11-1.06 1.06L12 13.06l-3.47 3.47a.75.75 0 11-1.06-1.06L10.94 12 7.47 8.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default DiscountInfo;
