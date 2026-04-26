import React, { useEffect } from "react";
import OrderDetails from "./OrderDetails";

const OrderModal = ({ showDetails, toggleModal, order }: any) => {
  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showDetails]);

  if (!showDetails) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-all duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-fade-in"
        onClick={() => toggleModal(false)}
      />
      
      {/* Modal Container */}
      <div className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-gray-2 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-3 bg-white-true px-6 py-5 sm:px-10 sm:py-7">
          <div>
            <h3 className="text-custom-xl font-semibold text-dark sm:text-heading-6 uppercase tracking-wider">
              Invoice #{order.order_number}
            </h3>
            <p className="text-custom-xs text-dark-4 font-semibold uppercase tracking-wider mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => toggleModal(false)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-3 bg-gray-1 text-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ambient"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto bg-white-true p-6 sm:p-10">
           <OrderDetails orderItem={order} />
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-3 bg-gray-1 px-6 py-4 sm:px-10 sm:py-6">
           <p className="text-custom-xs text-dark-4 font-semibold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">Status: {order.status}</p>
           <button 
             onClick={() => toggleModal(false)}
             className="btn-action-secondary"
           >
             Close Invoice
           </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
};

export default OrderModal;
