import { ForbiddenException, Injectable } from '@nestjs/common';
import { Response } from 'express';
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

  async register(dto: RegistrationDto, res: Response) {
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

      delete newUser.hashedPassword;

      res.cookie('token', await this.signToken(newUser.id, newUser.email));

      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials must be unique');
      }
    }
  }

  async login(dto: LoginDto, res: Response) {
    const { email, password } = dto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) return res.status(400).json('User not found');

      const passwordMatch = await argon.verify(user.hashedPassword, password);

      if (!passwordMatch) return res.status(403).json('Incorrect Password');

      delete user.hashedPassword;

      res.cookie('token', await this.signToken(user.id, user.email));
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          return res.status(400).json('Credentials must be unique');
      }
      return res.status(500).json('Something went wrong');
    }
  }

  logout(res: Response) {
    res.cookie('token', null);
    return res.status(200).json('logged out successfully');
  }

  async signToken(userId: number, email: string) {
    const token = await this.jwt.signAsync(
      { userId, email },
      {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return token;
  }
}
