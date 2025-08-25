import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, unique: true })
  role_id: number;
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  role_name: string;

  @OneToMany(() => User, (user) => user.role_id)
  users: User[];
}
