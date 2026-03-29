import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import ReviewModal from "./ReviewModal";
import toast from "react-hot-toast";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [order, setOrder] = useState<any>(orderItem);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        toast.success("Order completed successfully!");
        setShowReviewModal(true);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to complete order");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red">
              #{order.order_number}
            </p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${order.status === "delivered" || order.status === "completed"
                  ? "text-green bg-green-light-6"
                  : order.status === "on-hold" || order.status === "cancelled"
                    ? "text-red bg-red-light-6"
                    : order.status === "processing"
                      ? "text-yellow bg-yellow-light-4"
                      : order.status === "shipped" || order.status === "shipping"
                        ? "text-blue bg-blue-light-6"
                        : "text-gray-5 bg-gray-2"
                }`}
            >
              {order.status}
            </p>
          </div>

          <div className="min-w-[213px]">
            <p className="text-custom-sm text-dark">Order #{order.order_number}</p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">{order.currency} {order.subtotal}</p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
              onConfirm={handleConfirmOrder}
              status={order.status}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5">
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2"> Order:</span> #
                {orderItem.order_number}
              </p>
            </div>
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Date:</span>{" "}
                {new Date(orderItem.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Status:</span>{" "}
                <span
                  className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${orderItem.status === "delivered" || orderItem.status === "completed"
                      ? "text-green bg-green-light-6"
                      : orderItem.status === "on-hold" || orderItem.status === "cancelled"
                        ? "text-red bg-red-light-6"
                        : orderItem.status === "processing"
                          ? "text-yellow bg-yellow-light-4"
                          : orderItem.status === "shipped" || orderItem.status === "shipping"
                            ? "text-blue bg-blue-light-6"
                            : "text-gray-5 bg-gray-2"
                    }`}
                >
                  {orderItem.status}
                </span>
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Total:</span> {orderItem.currency} {orderItem.subtotal}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Actions:</span>{" "}
                <OrderActions
                  toggleDetails={toggleDetails}
                  toggleEdit={toggleEdit}
                  onConfirm={handleConfirmOrder}
                  status={order.status}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={order}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderItems={order.items || []}
      />
    </>
  );
};

export default SingleOrder;
