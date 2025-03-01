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

      return { errors: [`Invalid credentials for ip: ${adminIp}`] };
    } catch (error) {
      console.error('Error in login:', error);

      return { errors: [`Failed to log in admin for ip: ${adminIp}`] };
    }
  }

  async register(adminData: Admin): Promise<{ data?: Admin | null; errors: string[] }> {
    try {
      const admin = new Admin();

      admin.username = adminData.username;
      admin.passwordHash = await encrypt.encryptPassword(adminData.passwordHash);
      admin.adminIps = adminData.adminIps;

      const savedAdmin = await this.repository.saveAdmin(admin);

      return { data: savedAdmin, errors: [] };
    } catch (error) {
      console.error('Error in register:', error);

      return { errors: ['Failed to register admin'] };
    }
  }

  async getAdminsOffset(
    page: number,
    limit: number,
  ): Promise<{ data?: { admins: Admin[]; totalPages: number }; errors: string[] }> {
    try {
      const offset = (page - 1) * limit;

      const { admins, totalCount } = await this.repository.getAdminsOffset(limit, offset);

      const totalPages = Math.ceil(totalCount / limit);

      return { data: { admins, totalPages }, errors: [] };
    } catch (err) {
      console.error('Error retrieving admins with pagination:', err);

      return { errors: ['Error retrieving admins'] };
    }
  }

  async initializePrimaryAdmin(): Promise<{ errors: string[] }> {
    try {
      const { PRIMARY_ADMIN_USERNAME, PRIMARY_ADMIN_PASSWORD, PRIMARY_ADMIN_IP, SECONDARY_ADMIN_IP } = process.env;

      if (!PRIMARY_ADMIN_USERNAME || !PRIMARY_ADMIN_PASSWORD || !PRIMARY_ADMIN_IP || !SECONDARY_ADMIN_IP) {
        console.error('Environment variables for admin initialization are missing');

        return { errors: ['Missing required environment variables for admin initialization'] };
      }

      const existingAdmin = await this.repository.findAdminByUsername(PRIMARY_ADMIN_USERNAME);

      if (!existingAdmin) {
        const admin = new Admin();

        admin.username = PRIMARY_ADMIN_USERNAME;
        admin.passwordHash = await encrypt.encryptPassword(PRIMARY_ADMIN_PASSWORD);

        admin.adminIps = [
          PRIMARY_ADMIN_IP,
          SECONDARY_ADMIN_IP,
          '172.21.0.5',
          '172.22.0.5',
          '172.23.0.5',
          '172.20.0.5',
          '172.19.0.5',
        ];

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
