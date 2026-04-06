"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderItems: any[];
  onItemReviewed: (orderItemId: number, review: any) => void;
  onReviewFlowCompleted?: () => Promise<void> | void;
}

const getExistingReview = (item: any) => item?.productReview || item?.product_review;

const getProductImageSrc = (item: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const primaryImagePath = item?.product?.primary_image?.path;
  const thumbnail = item?.product?.thumbnail;

  if (item?.product?.primary_image_url) {
    return item.product.primary_image_url;
  }

  if (primaryImagePath && apiUrl) {
    return `${apiUrl}/storage/${primaryImagePath}`;
  }

  if (thumbnail && /^https?:\/\//.test(thumbnail)) {
    return thumbnail;
  }

  if (thumbnail && apiUrl) {
    return `${apiUrl}/storage/${thumbnail.replace(/^\/?storage\//, "")}`;
  }

  return "/images/product/product-01.png";
};

const ReviewModal = ({
  isOpen,
  onClose,
  orderId,
  orderItems,
  onItemReviewed,
  onReviewFlowCompleted,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const pendingItems = useMemo(
    () => orderItems.filter((item) => !getExistingReview(item)),
    [orderItems],
  );
  const currentItem = pendingItems[0];
  const reviewedCount = orderItems.length - pendingItems.length;

  const resetForm = () => {
    setRating(5);
    setComment("");
    setPhotos([]);
    setVideo(null);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, currentItem?.id]);

  if (!isOpen) return null;

  const closeModal = () => {
    if (loading) return;
    onClose();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "video",
  ) => {
    if (!event.target.files) return;

    if (type === "photo") {
      const newPhotos = Array.from(event.target.files);
      const mergedPhotos = [...photos, ...newPhotos].slice(0, 3);

      if (photos.length + newPhotos.length > 3) {
        toast.error("Maximum 3 photos per product review.");
      }

      setPhotos(mergedPhotos);
    } else {
      setVideo(event.target.files[0] || null);
    }

    event.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((currentPhotos) => currentPhotos.filter((_, photoIndex) => photoIndex !== index));
  };

  const handleSubmit = async () => {
    if (!currentItem) {
      onClose();
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("auth_token");

    const formData = new FormData();
    formData.append("order_item_id", currentItem.id);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);
    photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });
    if (video) {
      formData.append("video", video);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const payload = await res.json();

      if (!res.ok) {
        if (
          res.status === 422 &&
          typeof payload?.message === "string" &&
          payload.message.toLowerCase().includes("review already exists")
        ) {
          onItemReviewed(currentItem.id, { id: `existing-${currentItem.id}` });
          toast.success(`Review for ${currentItem.product?.name || "this product"} already exists.`);

          if (pendingItems.length === 1) {
            await onReviewFlowCompleted?.();
            onClose();
          }

          return;
        }

        toast.error(payload.message || "Failed to submit review");
        return;
      }

      onItemReviewed(currentItem.id, payload.review);
      toast.success(`Review for ${currentItem.product?.name || "this product"} submitted.`);

      if (pendingItems.length === 1) {
        await onReviewFlowCompleted?.();
        toast.success(`All reviews for order #${orderId} have been submitted.`);
        onClose();
        return;
      }

      resetForm();
    } catch (err) {
      toast.error("An error occurred while submitting the review.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentItem) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="border-b border-gray-3 p-6">
            <h3 className="text-xl font-semibold text-dark">All Reviews Submitted</h3>
            <p className="mt-2 text-custom-sm text-dark-4">
              Every product in this order already has a review.
            </p>
          </div>
          <div className="p-6">
            <button type="button" onClick={onClose} className="btn-action w-full">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-3 px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold text-dark">Review Your Order</h3>
            <p className="mt-1 text-custom-sm text-dark-4">
              Product {reviewedCount + 1} of {orderItems.length}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-3 bg-gray-1 text-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ambient"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-[24px] border border-gray-3 bg-gray-1/60 p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[20px] border border-gray-3 bg-white-true">
                <Image
                  src={getProductImageSrc(currentItem)}
                  alt={currentItem.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-4">
                  Reviewing now
                </p>
                <h4 className="mt-1 truncate text-lg font-semibold text-dark">
                  {currentItem.product?.name || "Product"}
                </h4>
                <p className="mt-1 text-custom-sm text-dark-4">
                  Add up to 3 photos and 1 video for this product.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all hover:scale-110 ${
                  star <= rating ? "text-yellow" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-dark">
              Share your thoughts
            </label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="h-32 w-full resize-none rounded-2xl border border-gray-3 bg-gray-1 p-4 outline-none transition-all focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
              placeholder="What did you like or dislike?"
            ></textarea>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-dark-4">
                Photos (Max 3)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => handleFileChange(event, "photo")}
                className="hidden"
                id={`photo-upload-${orderId}`}
              />
              <label
                htmlFor={`photo-upload-${orderId}`}
                className="flex min-h-[58px] cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-3 bg-gray-1 px-4 py-3 text-sm font-medium text-dark-4 transition-all hover:border-primary hover:bg-white-true hover:text-primary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>{photos.length > 0 ? `${photos.length} photo selected` : "Add photos"}</span>
              </label>

              {photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <span
                      key={`${photo.name}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-3 bg-white-true px-3 py-2 text-xs font-medium text-dark"
                    >
                      {photo.name}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="text-dark-4 hover:text-red"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-dark-4">
                Video (Optional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(event) => handleFileChange(event, "video")}
                className="hidden"
                id={`video-upload-${orderId}`}
              />
              <label
                htmlFor={`video-upload-${orderId}`}
                className="flex min-h-[58px] cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-3 bg-gray-1 px-4 py-3 text-sm font-medium text-dark-4 transition-all hover:border-primary hover:bg-white-true hover:text-primary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>{video ? video.name : "Add video"}</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeModal} className="btn-action-secondary">
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-action disabled:pointer-events-none disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : pendingItems.length > 1
                  ? "Submit & Continue"
                  : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
