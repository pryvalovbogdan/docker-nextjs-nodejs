import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Admin } from '../entities';

class AdminRepository {
  private adminRepository: Repository<Admin> = AppDataSource.manager.getRepository(Admin);

  findAdminByUsername = async (username: string): Promise<Admin | null> => {
    return this.adminRepository.findOne({ where: { username } });
  };

  findAdminByAdminIp = async (adminIp: string): Promise<Admin | null> => {
    return this.adminRepository
      .createQueryBuilder('admin')
      .where(':adminIp = ANY(admin.adminIps)', { adminIp })
      .getOne();
  };

  saveAdmin = async (admin: Admin): Promise<Admin> => {
    return this.adminRepository.save(admin);
  };

  getAdminsOffset = async (limit: number, offset: number): Promise<{ admins: Admin[]; totalCount: number }> => {
    const [admins, totalCount] = await this.adminRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return { admins, totalCount };
  };
}

export default AdminRepository;
