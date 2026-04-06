import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import ReviewModal from "./ReviewModal";
import toast from "react-hot-toast";

const getExistingReview = (item: any) => item?.productReview || item?.product_review;

const SingleOrder = ({ orderItem }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [order, setOrder] = useState<any>(orderItem);

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleOpenReview = () => {
    setShowReviewModal(true);
  };

  const handleItemReviewed = (orderItemId: number, review: any) => {
    setOrder((prevOrder: any) => ({
      ...prevOrder,
      items: (prevOrder.items || []).map((item: any) =>
        item.id === orderItemId
          ? {
              ...item,
              productReview: review,
              product_review: review,
            }
          : item,
      ),
    }));
  };

  const handleReviewFlowCompleted = async () => {
    if (order.status === "completed") {
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Reviews were submitted, but order status was not updated.");
        return;
      }

      setOrder((prevOrder: any) => ({
        ...prevOrder,
        status: data?.order?.status || "completed",
        completed_at:
          data?.order?.completed_at || prevOrder.completed_at || new Date().toISOString(),
        shipment: data?.order?.shipment || prevOrder.shipment,
      }));
    } catch (err) {
      toast.error("Reviews were submitted, but order status was not updated.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-green-light-6 text-primary";
      case "on-hold":
      case "cancelled":
        return "bg-red-light-6 text-red";
      case "processing":
        return "bg-yellow-light-4 text-secondary";
      case "shipped":
      case "shipping":
        return "bg-primary/10 text-primary";
      default:
        return "bg-gray-1 text-dark-4";
    }
  };

  const safeParse = (val: any) => {
    const num = parseFloat(val?.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const subtotal = safeParse(order.subtotal);
  const shipping = 250.0;
  const grandTotal = subtotal + shipping;
  const currency = order.currency || "USD";
  const statusLabel = (order.status || "pending").replace(/-/g, " ");
  const totalItems = (order.items || []).length;
  const pendingReviewCount = (order.items || []).filter(
    (item: any) => !getExistingReview(item),
  ).length;
  const showReviewAction =
    pendingReviewCount > 0 &&
    ["shipped", "delivered", "completed"].includes(order.status);
  const reviewLabel =
    pendingReviewCount < totalItems ? "Continue Review" : "Review Order";

  return (
    <>
      <div className="rounded-[28px] border border-primary/10 bg-gradient-to-br from-white-true to-[#f8f4ee] p-3.5 shadow-ambient transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2 sm:p-4">
        <div className="rounded-[24px] border border-gray-3 bg-white-true p-4 sm:p-4.5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gray-1 text-primary">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="min-w-0 max-w-full truncate text-lg font-semibold leading-tight text-dark sm:text-xl">
                    Order #{order.order_number}
                  </h4>
                  <span
                    className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <p className="mt-2 text-sm font-medium text-dark-4">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:min-w-[300px]">
              <div className="rounded-[20px] border border-gray-3 bg-gray-1/70 p-4 xl:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-4">
                  Total payment
                </p>
                <p className="mt-2 text-2xl font-semibold leading-none text-dark sm:text-[28px]">
                  {currency} {grandTotal.toFixed(2)}
                </p>
                <p className="mt-1.5 text-xs text-dark-4">
                  Subtotal {currency} {subtotal.toFixed(2)}
                </p>
              </div>

              <OrderActions
                toggleDetails={toggleDetails}
                onReview={handleOpenReview}
                showReviewAction={showReviewAction}
                reviewLabel={reviewLabel}
              />
            </div>
          </div>
        </div>
      </div>

      <OrderModal
        showDetails={showDetails}
        toggleModal={setShowDetails}
        order={{ ...order, grandTotal }}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={order.id}
        orderItems={order.items || []}
        onItemReviewed={handleItemReviewed}
        onReviewFlowCompleted={handleReviewFlowCompleted}
      />
    </>
  );
};

export default SingleOrder;
