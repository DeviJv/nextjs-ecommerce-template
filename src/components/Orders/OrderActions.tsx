import React from "react";

const OrderActions = ({
  toggleDetails,
  onReview,
  onPayNow,
  showReviewAction,
  reviewLabel,
  isPending,
}: any) => {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row xl:flex-col 2xl:flex-row">
      {/* Pay Now — shown for pending orders */}
      {isPending && (
        <button
          type="button"
          onClick={onPayNow}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-dark hover:shadow-md sm:w-auto sm:whitespace-nowrap sm:text-sm"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Pay Now
        </button>
      )}

      {showReviewAction && (
        <button
          type="button"
          onClick={onReview}
          className="btn-action w-full !px-4 !py-2.5 !text-xs sm:w-auto sm:whitespace-nowrap sm:!text-sm"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
          </svg>
          {reviewLabel}
        </button>
      )}

      <button
        type="button"
        onClick={toggleDetails}
        className="btn-action-secondary w-full !px-4 !py-2.5 !text-xs sm:w-auto sm:whitespace-nowrap sm:!text-sm"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        View Order
      </button>
    </div>
  );
};

export default OrderActions;
