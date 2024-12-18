export interface IProduct {
  id: number;
  title: string;
  description: string | null;
  images: string[] | null;
  manufacture: string | null;
  country: string | null;
  category: string | null;
}

export interface IClient {
  id: number;
  name: string;
  phone: number;
  date: Date;
  product_id: number | null;
}

export interface IAdmin {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  admin_ip: string | null;
  created_at: Date;
}
