import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegistrationDto) {
    const { email, password, username, avatar } = dto;

    const hashedPassword = await argon.hash(password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          username,
          email,
          hashedPassword,
          avatar,
        },
      });

      return this.signToken(newUser.id, newUser.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials must be unique');
      }
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) return new NotFoundException('User not found');

      const passwordMatch = await argon.verify(user.hashedPassword, password);

      if (!passwordMatch) return new ForbiddenException('Incorrect Password');

      delete user.hashedPassword;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials must be unique');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async signToken(userId: number, email: string) {
    const token = await this.jwt.signAsync(
      { userId, email },
      {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return { token };
  }
}
