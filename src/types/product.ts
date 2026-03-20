export type Product = {
  title: string;
   slug?: string|null;         // jadi optional
  description?: string|null;
  reviews: number;
  average_rating?: number;
  reviews_count?: number;
  price: number;
  discountedPrice: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
