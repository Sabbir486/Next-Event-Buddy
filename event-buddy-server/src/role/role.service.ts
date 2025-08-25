import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const existingRole = await this.roleRepo.findOneBy({
        role_name: createRoleDto.role_name,
      });
      if (existingRole) {
        throw new BadRequestException(
          `Role with name ${createRoleDto.role_name} already exists`,
        );
      }
      const role = this.roleRepo.create(createRoleDto);
      return await this.roleRepo.save(role);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOne({
      where: { role_id: id },
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepo.findOneBy({ role_id: id });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    Object.assign(role, updateRoleDto);

    try {
      return await this.roleRepo.save(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  async remove(id: number) {
    const role = await this.roleRepo.findOneBy({ role_id: id });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    try {
      await this.roleRepo.remove(role);
      return {
        deleted: true,
        message: `Role with id ${id} deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete role');
    }
  }
}
