export interface ILoginRequestBody {
  username: string;
  password: string;
}

export interface IRegisterRequestBody {
  username: string;
  password: string;
  adminIp: string;
  passwordHash: string;
  role: string;
  id: number;
  createdAt: Date;
}

export interface IUpdateNewsRequestBody {
  id: number;
  title?: string;
  description?: string;
  images?: string[];
  date?: string;
}

export interface IAddNewsRequestBody {
  title: string;
  description?: string;
  images?: string[];
  date: string;
}

export interface IUpdateProductsRequestBody {
  id: number;
  title?: string;
  description?: string;
  images?: string[];
  manufacture?: string;
  country?: string;
  category?: string;
  price?: number;
}

export interface IAddNewProductsRequestBody {
  title: string;
  description?: string;
  images?: string[];
  manufacture?: string;
  country?: string;
  category?: string;
  price: number;
}

export interface IUpdateOrdersRequestBody {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: number;
  date?: string;
  productId?: number;
  status?: string;
}

export interface ISaveOrderRequestBody {
  firstName: string;
  lastName: string;
  phone: number;
  date: string;
  productId: number;
  status: string;
}
