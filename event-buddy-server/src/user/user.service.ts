import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';
import { passHashingProvider } from 'src/pass-hashing/pass-hashing.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    private readonly passHashing: passHashingProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let role: Role | null = null;

      if (createUserDto.role_id !== undefined) {
        if (createUserDto.role_id === 1) {
          const isRole = await this.roleRepo.findOneBy({
            role_id: 1,
          });
          if (!isRole) {
            await this.roleRepo.create({
              role_id: 1,
              role_name: 'User',
            });
            await this.roleRepo.save({
              role_id: 1,
              role_name: 'User',
            });
          }
        } else if (createUserDto.role_id === 2) {
          const isRole = await this.roleRepo.findOneBy({
            role_id: 2,
          });
          if (!isRole) {
            await this.roleRepo.create({
              role_id: 2,
              role_name: 'Admin',
            });
            await this.roleRepo.save({
              role_id: 2,
              role_name: 'Admin',
            });
          }
        }
        role = await this.roleRepo.findOneBy({
          role_id: createUserDto.role_id,
        });
      } else {
        const createRole = {
          role_id: 1,
          role_name: 'User',
        };
        role = createRole as Role;
      }

      if (!role) {
        throw new NotFoundException(
          `Role with ID ${createUserDto.role_id} not found`,
        );
      }

      const existingUser = await this.userRepo.findOneBy({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new BadRequestException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      createUserDto.password = await this.passHashing.hashPassword(
        createUserDto.password,
      );

      const user = this.userRepo.create({
        ...createUserDto,
        role_id: role,
      });

      return await this.userRepo.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return this.userRepo.find({ relations: ['role_id'] });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch users: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: id },
        relations: ['role_id'],
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch user: ${error.message}`,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOneBy({ user_id: id });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const isMatch = await this.passHashing.comparePassword(
        updateUserDto.password,
        user.password,
      );

      if (!isMatch) {
        throw new BadRequestException('Incorrect current password');
      }

      if (updateUserDto.new_password) {
        user.password = await this.passHashing.hashPassword(
          updateUserDto.new_password,
        );
      }

      const { password, new_password, ...otherUpdates } = updateUserDto;
      Object.assign(user, otherUpdates);

      return await this.userRepo.save(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update user: ${error.message}`,
      );
    }
  }
}
