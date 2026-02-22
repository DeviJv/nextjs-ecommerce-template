export type Product = {
  title: string;
   slug?: string|null;         // jadi optional
  description?: string|null;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
