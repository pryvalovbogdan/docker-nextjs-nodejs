import { Repository } from 'typeorm';

import { AppDataSource } from '../configs/data-source';
import { Admin } from '../entities';

class AdminRepository {
  private adminRepository: Repository<Admin> = AppDataSource.manager.getRepository(Admin);

  findAdminByUsername = async (username: string): Promise<Admin | null> => {
    return this.adminRepository.findOne({ where: { username } });
  };

  saveAdmin = async (admin: Admin): Promise<Admin> => {
    return this.adminRepository.save(admin);
  };
}

export default AdminRepository;
