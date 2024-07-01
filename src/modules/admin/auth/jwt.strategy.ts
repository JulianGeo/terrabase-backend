import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenI } from '../../../common/shared/interface/token.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        let token: string;
        if (req && req.cookies) {
          token = req.cookies['jwt'];
        }
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
    });
  }

  validate(payload: AuthTokenI) {
    const { id } = payload;

    if (!id) {
      throw new UnauthorizedException();
    }
    return { id };
  }
}
