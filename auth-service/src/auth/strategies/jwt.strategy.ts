import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    const secret = configService.get('config.jwt.secret');
    console.log('Auth Service - JWT Strategy initialized with secret:', secret);
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('Auth Service - Validating JWT payload:', payload);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      console.error('Auth Service - User not found for payload:', payload);
      throw new UnauthorizedException();
    }
    return user;
  }
} 