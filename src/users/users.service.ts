import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(private prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: createUserDto
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(`Usuario ya existe`)
        }
      }
    }   
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  async findOne(id: number) {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: id,
      }
    });

    if (!userFound) {
      throw new NotFoundException(`usuario no encontaraso`);
    }
    return userFound;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const userFound = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    if (!userFound) {
      throw new NotFoundException(`Usuario no encntrado`);
    }

    return userFound;
  }

  async remove(id: number) {
    const deleteUser = await this.prismaService.user.delete({
      where: {
        id: id,
      }
    })

    if (!deleteUser) {
      throw new NotFoundException(`User removido`);
    }

    return deleteUser;
  }
}
