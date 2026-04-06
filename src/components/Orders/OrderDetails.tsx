import React from "react";
import Image from "next/image";
import Link from "next/link";

const OrderDetails = ({ orderItem }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Robust parsing for prices
  const safeParse = (val: any) => {
    const num = parseFloat(val?.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const subtotal = safeParse(orderItem.subtotal);
  const shippingCharge = 250.00; // Hardcoded as requested
  const grandTotal = subtotal + shippingCharge;

  return (
    <div className="space-y-10">
      {/* Shipment & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="bg-gray-1 rounded-2xl p-6 border border-gray-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h4 className="font-black text-dark uppercase tracking-tight">Shipping Destination</h4>
          </div>
          <div className="space-y-1 text-dark-5">
            <p className="font-black text-dark text-lg mb-2">{orderItem.customer?.name || "Recipient"}</p>
            <p className="text-sm font-medium leading-relaxed italic">
              {orderItem.customer?.house_number} {orderItem.customer?.address}, {orderItem.customer?.city || "N/A"}, {orderItem.customer?.country || "N/A"}
            </p>
            <p className="text-sm font-bold text-dark-4 pt-2">Phone: {orderItem.customer?.phone || "N/A"}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-1 rounded-2xl p-6 border border-gray-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <h4 className="font-black text-dark uppercase tracking-tight">Payment Detail</h4>
          </div>
          <div className="space-y-3">
             <div>
                <p className="text-xs font-bold text-dark-4 uppercase tracking-widest leading-none mb-1">Method</p>
                <p className="font-black text-dark capitalize">{orderItem.payments?.[0]?.method || "PayPal / Credit Card"}</p>
             </div>
             <div>
                <p className="text-xs font-bold text-dark-4 uppercase tracking-widest leading-none mb-1">Status</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-green text-white text-[10px] font-black uppercase">
                  {orderItem.payments?.[0]?.status || "Paid"}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div>
        <h4 className="font-black text-dark uppercase tracking-tight mb-6 flex items-center gap-2">
          <span className="w-8 h-1 bg-dark rounded-full"></span>
          Order Items ({orderItem.items?.length || 0})
        </h4>
        <div className="space-y-2">
          {orderItem.items?.map((item: any, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white hover:bg-gray-1 rounded-2xl border border-gray-2 transition-colors group">
              <div className="flex items-center gap-5 flex-1 w-full">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-2 border border-gray-3 shrink-0">
                  <Image 
                    src={item.product?.thumbnail ? `${apiUrl}/storage/${item.product.thumbnail}` : "/images/product/product-01.png"} 
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.product?.slug}`} className="font-black text-dark text-lg hover:text-blue transition-colors line-clamp-1">
                    {item.product?.name}
                  </Link>
                  <p className="text-sm font-bold text-dark-4 mt-0.5">
                    Unit Price: <span className="text-dark">{orderItem.currency} {safeParse(item.price).toFixed(2)}</span>
                  </p>
                  <p className="text-xs font-black text-blue uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 text-left sm:text-right w-full sm:w-auto flex flex-col items-start sm:items-end gap-2 pr-4">
                 <p className="font-black text-dark text-xl leading-none">
                   {orderItem.currency} {(safeParse(item.price) * safeParse(item.quantity)).toFixed(2)}
                 </p>
                 {orderItem.status === 'completed' && (
                    <button type="button" className="btn-action-secondary !px-4 !py-2 text-xs">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                       Review Product
                    </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="border-t-2 border-dashed border-gray-3 pt-8 flex flex-col items-end">
        <div className="w-full sm:w-80 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-dark-5 font-black uppercase tracking-widest text-xs">Total Items Subtotal</span>
            <span className="text-dark font-black text-lg">{orderItem.currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-dark-5 font-black uppercase tracking-widest text-xs">International Shipping</span>
            <span className="text-green font-black text-lg">{orderItem.currency} {shippingCharge.toFixed(2)}</span>
          </div>
          <div className="bg-dark rounded-2xl p-6 mt-4 shadow-xl shadow-dark/20 text-white flex justify-between items-center transform hover:scale-[1.02] transition-transform">
             <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Grand Total</p>
                <p className="text-2xl font-black">{orderItem.currency} {grandTotal.toFixed(2)}</p>
             </div>
             <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
