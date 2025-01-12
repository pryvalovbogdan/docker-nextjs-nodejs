import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Admin } from '../entities';

class AdminRepository {
  private adminRepository: Repository<Admin> = AppDataSource.manager.getRepository(Admin);

  findAdminByUsername = async (username: string, adminIp: string): Promise<Admin | null> => {
    return this.adminRepository.findOne({ where: { username, adminIp } });
  };

  saveAdmin = async (admin: Admin): Promise<Admin> => {
    return this.adminRepository.save(admin);
  };
}

export default AdminRepository;
