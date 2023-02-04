import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as os from 'os';

import { WsException } from '@nestjs/websockets';
import { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from '@noinghe/shared/utils/lib/constants/system.constant';
import { ReqUser } from '@noinghe/api/core/lib/dtos';

type User = ReqUser;
@Injectable()
export class JwtService {
  constructor() {}

  /**
   * Generates a new JWT token
   *
   * @param {User} user - The user to create the payload for the JWT
   * @returns {Promise} tokens - The access and the refresh token
   */
  async generateToken(user: User): Promise<any> {
    const jwtSecret = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    const payload = {
      sub: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      iss: os.hostname(),
    };
    const accessToken = await jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || ACCESS_TOKEN_EXPIRES,
    });
    const refreshToken = await jwt.sign(payload, jwtSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRES,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Validates the token
   *
   * @param {string} token - The JWT token to validate
   * @param {boolean} isWs - True to handle WS exception instead of HTTP exception (default: false)
   */
  async verify(token: string, isWs: boolean = false): Promise<User | null> {
    try {
      const payload = <any>jwt.verify(token, process.env.PUBLIC_KEY.replace(/\\n/g, '\n'));
      const user = payload;

      if (!user) {
        if (isWs) {
          throw new WsException('Unauthorized access');
        } else {
          throw new HttpException('Unauthorized access', HttpStatus.BAD_REQUEST);
        }
      }

      return user;
    } catch (err) {
      if (isWs) {
        throw new WsException(err.message);
      } else {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
