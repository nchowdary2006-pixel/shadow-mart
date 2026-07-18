export interface Product {
  id: string;
  name: string;
  category: 'beverages' | 'snacks' | 'stationery';
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  description: string;
  tags: string[];
  instant: boolean;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  verified: boolean;
}

export interface WebhookSettings {
  url: string;
  botName: string;
  botAvatar: string;
  embedColor: string; // hex code
}

export interface OrderDetails {
  orderId: string;
  email: string;
  discordTag: string;
  roomNumber?: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
}

export interface CustomTicket {
  discordTag: string;
  category: string;
  budget: string;
  description: string;
}
