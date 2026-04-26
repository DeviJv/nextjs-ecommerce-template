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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const subtotal = safeParse(orderItem.subtotal);
  const shippingCharge = 250.0; // Hardcoded as requested
  const grandTotal = subtotal + shippingCharge;

  return (
    <div className="space-y-10">
      {/* Shipment & Payment Info */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Shipping Address */}
        <div className="rounded-2xl border border-gray-3 bg-gray-1 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue shadow-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h4 className="text-custom-xs font-semibold uppercase tracking-wider text-dark">
              Shipping Destination
            </h4>
          </div>
          <div className="space-y-1 text-dark-5">
            <p className="mb-2 text-custom-lg font-semibold text-dark">
              {orderItem.customer?.name || "Recipient"}
            </p>
            <p className="text-custom-sm font-medium leading-relaxed">
              {orderItem.customer?.house_number} {orderItem.customer?.address},{" "}
              {orderItem.customer?.city || "N/A"},{" "}
              {orderItem.customer?.country || "N/A"}
            </p>
            <p className="pt-2 text-custom-xs font-semibold text-dark-4">
              Phone: {orderItem.customer?.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Payment & Timeline */}
        <div className="rounded-2xl border border-gray-3 bg-gray-1 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green shadow-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h4 className="text-custom-xs font-semibold uppercase tracking-wider text-dark">
              Payment & Timeline
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-custom-xs font-semibold uppercase leading-none tracking-widest text-dark-4">
                  Method
                </p>
                <p className="text-custom-sm font-semibold capitalize text-dark">
                  {orderItem.payments?.[0]?.method || "PayPal / Credit Card"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-dark-4">
                  Status
                </p>
                <span className="inline-block rounded-full bg-green px-2.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                  {orderItem.payments?.[0]?.status || "Paid"}
                </span>
              </div>
              {orderItem.paid_at && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-dark-4">
                    Paid At
                  </p>
                  <p className="text-xs font-black text-dark">
                    {formatDate(orderItem.paid_at)}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-3 border-l border-gray-3 pl-4">
              {orderItem.processed_at && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-dark-4">
                    Processed
                  </p>
                  <p className="text-xs font-black text-dark">
                    {formatDate(orderItem.processed_at)}
                  </p>
                </div>
              )}
              {orderItem.shipment?.shipped_at && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-dark-4">
                    Shipped
                  </p>
                  <p className="text-xs font-black text-dark">
                    {formatDate(orderItem.shipment.shipped_at)}
                  </p>
                </div>
              )}
              {orderItem.completed_at && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-dark-4">
                    Completed
                  </p>
                  <p className="text-xs font-black text-dark">
                    {formatDate(orderItem.completed_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div>
        <h4 className="mb-6 flex items-center gap-2 text-custom-xs font-semibold uppercase tracking-wider text-dark">
          <span className="h-0.5 w-8 rounded-full bg-dark"></span>
          Order Items ({orderItem.items?.length || 0})
        </h4>
        <div className="space-y-4">
          {orderItem.items?.map((item: any, index: number) => {
            const review = item.productReview || item.product_review;
            return (
              <div
                key={index}
                className="group flex flex-col rounded-2xl border border-gray-2 bg-white transition-colors hover:bg-gray-1"
              >
                <div className="flex flex-col items-start justify-between p-4 sm:flex-row sm:items-center">
                  <div className="flex w-full flex-1 items-center gap-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-3 bg-gray-2">
                      <Image
                        src={
                          item.product?.primary_image?.path
                            ? `${apiUrl}/storage/${item.product.primary_image.path}`
                            : item.product?.primaryImage?.path
                            ? `${apiUrl}/storage/${item.product.primaryImage.path}`
                            : item.product?.thumbnail
                            ? `${apiUrl}/storage/${item.product.thumbnail}`
                            : "/images/product/product-01.png"
                        }
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover duration-500 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/shop-details/${item.product?.slug}`}
                        className="line-clamp-1 text-custom-lg font-semibold text-dark transition-colors hover:text-blue"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="mt-0.5 text-sm font-bold text-dark-4">
                        Unit Price:{" "}
                        <span className="text-dark">
                          {orderItem.currency}{" "}
                          {safeParse(item.price).toFixed(2)}
                        </span>
                      </p>
                      <p className="mt-1 text-custom-xs font-semibold uppercase tracking-widest text-blue">
                        Quantity: {item.qty || item.quantity || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex w-full flex-col items-start gap-2 pr-4 sm:mt-0 sm:w-auto sm:items-end sm:text-right">
                    <p className="text-custom-xl font-semibold leading-none text-dark">
                      {orderItem.currency}{" "}
                      {safeParse(item.total || (safeParse(item.price) * safeParse(item.qty || item.quantity))).toFixed(2)}
                    </p>
                    {orderItem.status === "completed" && !review && (
                      <button
                        type="button"
                        className="btn-action-secondary !px-4 !py-2 text-xs"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Review Product
                      </button>
                    )}
                  </div>
                </div>

                {/* Review Section */}
                {review && (
                  <div className="mx-4 mb-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                             <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-dark-4 opacity-60">
                          {formatDate(review.created_at)}
                       </span>
                    </div>
                    <p className="text-sm font-medium text-dark leading-relaxed">
                       {review.comment}
                    </p>
                    
                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                       <div className="mt-3 flex flex-wrap gap-2">
                          {review.photos.map((photo: string, idx: number) => (
                             <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-3 bg-white shadow-sm">
                                <Image 
                                   src={`${apiUrl}/storage/${photo}`}
                                   alt="Review photo"
                                   fill
                                   className="object-cover"
                                />
                             </div>
                          ))}
                       </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col items-end border-t-2 border-dashed border-gray-3 pt-8">
        <div className="w-full space-y-4 sm:w-80">
          <div className="flex items-center justify-between">
            <span className="text-custom-xs font-semibold uppercase tracking-widest text-dark-5">
              Total Items Subtotal
            </span>
            <span className="text-custom-lg font-semibold text-dark">
              {orderItem.currency} {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-xs font-black uppercase tracking-widest text-dark-5">
              International Shipping
            </span>
            <span className="text-lg font-black text-green">
              {orderItem.currency} {shippingCharge.toFixed(2)}
            </span>
          </div>
          <div className="mt-4 flex transform items-center justify-between rounded-2xl bg-dark p-6 text-white shadow-xl shadow-dark/20 transition-transform hover:scale-[1.02]">
            <div className="text-left">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
                Grand Total
              </p>
              <p className="text-heading-6 font-semibold">
                {orderItem.currency} {grandTotal.toFixed(2)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
