export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  order_item_id: number;
  rating: number;
  comment: string;
  photos: string[] | null;
  video: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    // other user fields if needed
  };
  product: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ReviewResponse {
  current_page: number;
  data: Review[];
  total: number;
  // include other pagination fields if necessary
}
