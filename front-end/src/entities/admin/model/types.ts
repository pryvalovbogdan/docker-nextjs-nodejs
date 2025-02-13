export interface Admin {
  id: number;
  username: string;
  passwordHash: string;
  role: string;
  adminIps: string[];
  createdAt: Date;
}

export interface AdminApiResponse {
  message: string;
  data: {
    admins: Admin[];
    totalPages: number;
  };
}
