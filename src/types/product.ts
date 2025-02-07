export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  user_id: string;
  created_at: string;
  comments?: number;
  views?: number;
}
