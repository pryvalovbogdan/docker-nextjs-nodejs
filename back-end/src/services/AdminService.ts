import { Admin } from '../entities';
import { AdminRepository } from '../repositories';
import { encrypt } from '../utils/encrypt';

class AdminService {
  private repository: AdminRepository = new AdminRepository();

  async login(passwordHash: string, adminIp: string): Promise<{ data?: Admin; errors: string[] }> {
    try {
      const admin = await this.repository.findAdminByAdminIp(adminIp);

      const isPasswordValid = admin && (await encrypt.comparePassword(passwordHash, admin?.passwordHash as string));

      if (admin && isPasswordValid) {
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
      admin.passwordHash = await encrypt.encryptPassword(adminData.passwordHash);
      admin.adminIp = adminData.adminIp;

      const savedAdmin = await this.repository.saveAdmin(admin);

      return { data: savedAdmin, errors: [] };
    } catch (error) {
      console.error('Error in register:', error);

      return { errors: ['Failed to register admin'] };
    }
  }

  async initializePrimaryAdmin(): Promise<{ errors: string[] }> {
    try {
      const { PRIMARY_ADMIN_USERNAME, PRIMARY_ADMIN_PASSWORD, PRIMARY_ADMIN_IP } = process.env;

      if (!PRIMARY_ADMIN_USERNAME || !PRIMARY_ADMIN_PASSWORD || !PRIMARY_ADMIN_IP) {
        console.error('Environment variables for admin initialization are missing');

        return { errors: ['Missing required environment variables for admin initialization'] };
      }

      const existingAdmin = await this.repository.findAdminByUsername(PRIMARY_ADMIN_USERNAME);

      if (!existingAdmin) {
        const admin = new Admin();

        admin.username = PRIMARY_ADMIN_USERNAME;
        admin.passwordHash = await encrypt.encryptPassword(PRIMARY_ADMIN_PASSWORD);
        admin.adminIp = PRIMARY_ADMIN_IP;

        await this.repository.saveAdmin(admin);

        console.log('Default admin created');
      } else {
        console.log('Primary admin already initialized');
      }

      return { errors: [] };
    } catch (error) {
      console.error('Error in initializePrimaryAdmin:', error);

      return { errors: ['Failed to initialize admin'] };
    }
  }
}

export default AdminService;
