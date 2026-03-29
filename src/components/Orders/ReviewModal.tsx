"use client";
import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: any[];
}

const ReviewModal = ({ isOpen, onClose, orderItems }: ReviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || orderItems.length === 0) return null;

  const currentItem = orderItems[currentIndex];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    if (e.target.files) {
      if (type === 'photo') {
        const newPhotos = Array.from(e.target.files);
        setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
      } else {
        setVideo(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async () => {
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

      if (res.ok) {
        toast.success(`Review for ${currentItem.product.name} submitted!`);
        if (currentIndex < orderItems.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setRating(5);
          setComment("");
          setPhotos([]);
          setVideo(null);
        } else {
          onClose();
        }
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in translate-y-0">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-dark">Rate your experience</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-dark transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
             <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                <Image 
                  src={currentItem.product.thumbnail || "/images/product/product-01.png"} 
                  alt={currentItem.product.name}
                  fill
                  className="object-cover"
                />
             </div>
             <div>
                <h4 className="font-semibold text-dark line-clamp-1">{currentItem.product.name}</h4>
                <p className="text-sm text-gray-500">Item {currentIndex + 1} of {orderItems.length}</p>
             </div>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all hover:scale-110 ${star <= rating ? "text-yellow" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-dark mb-2">Share your thoughts</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue/20 outline-none resize-none h-32 transition-all"
              placeholder="What did you like or dislike?"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Photos (Up to 5)</label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue hover:text-blue transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  <span>{photos.length > 0 ? `${photos.length} Selected` : 'Add Photos'}</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Video (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue hover:text-blue transition-all"
                >
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                   <span>{video ? 'Video Added' : 'Add Video'}</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue hover:bg-blue-dark active:scale-[0.98]"}`}
          >
            {loading ? "Submitting..." : currentIndex < orderItems.length - 1 ? "Next Product" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
