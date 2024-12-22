import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, default: 'admin' })
  role: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  adminIp: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
