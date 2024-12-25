import { Admin } from '../entities';
import { AdminRepository } from '../repositories';

class AdminService {
  private repository: AdminRepository = new AdminRepository();

  async login(username: string, passwordHash: string): Promise<{ data?: Admin; errors: string[] }> {
    try {
      const admin = await this.repository.findAdminByUsername(username);

      if (admin && admin.passwordHash === passwordHash) {
        return { data: admin, errors: [] };
      }

      return { errors: ['Invalid credentials'] };
    } catch (error) {
      console.error('Error in login:', error);

      return { errors: ['Failed to log in admin'] };
    }
  }

  async register(adminData: Admin): Promise<{ data?: Admin | null; errors: string[] }> {
    try {
      const admin = new Admin();

      admin.username = adminData.username;
      admin.passwordHash = adminData.passwordHash;
      admin.adminIp = adminData.adminIp;

      const savedAdmin = await this.repository.saveAdmin(admin);

      return { data: savedAdmin, errors: [] };
    } catch (error) {
      console.error('Error in register:', error);

      return { errors: ['Failed to register admin'] };
    }
  }
}

export default AdminService;
