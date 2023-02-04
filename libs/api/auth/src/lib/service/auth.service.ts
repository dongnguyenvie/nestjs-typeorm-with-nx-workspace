import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserSignin, IUserSignup } from '../interface';
import { CreateJWToken } from '../interface/create-jwt-token.interface';
import { SvIntputError } from '@noinghe/api/core/lib/errors/input.error';
import { SvUnauthorizedError } from '@noinghe/api/core/lib/errors/unauthorized.error';
import { SvLockError } from '@noinghe/api/core/lib/errors/lock.error';
import { AbilityAction } from '@noinghe/api/core/lib/casl/casl-ability.enum';
import { saltOrRounds } from '@noinghe/shared/utils/lib/constants/system.constant';
import { Status, Privilege } from '@noinghe/shared/utils/lib/enums';
import { IOauthUser } from '@noinghe/api/core/lib/request';
import { UserService } from '@noinghe/api/users';
import { RoleService } from '@noinghe/api/roles';

@Injectable()
export class AuthService {
  constructor(private userSvc: UserService, private roleSvc: RoleService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string, noCheck = false): Promise<any> {
    const user = await this.userSvc.findOneByEmail(email);
    if ((user && user.password === pass) || !noCheck) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  createJWToken(user: CreateJWToken) {
    const payload = {
      username: user.email,
      email: user.email,
      scp: user.scp,
      memberships: user.memberships,
      sub: user.id,
      id: user.id,
      avatar: user.avatar || '',
      name: user.name || user.email,
    };

    const tokenCreated = this.jwtService.sign(payload);
    return {
      token: tokenCreated,
    };
  }

  async signup(user: IUserSignup) {
    const userFound = await this.userSvc.findOneByEmail(user.email);
    if (userFound) return new SvIntputError('Email is exists');
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    const userCreated = await this.userSvc.create(user);
    // Get scope of role
    const listDefaultRole = await this.roleSvc.listRoleDefault();
    let roles = [];
    if (listDefaultRole.length) {
      roles = (userCreated.roles || []).concat(listDefaultRole);
    }
    const scpSet = new Set<string>();
    // if u are system admin, we has full permissions
    if ((userCreated.privilege || []).includes(Privilege.SuperAdmin)) {
      scpSet.add(AbilityAction.All);
    } else {
      (roles || []).forEach((role) => {
        role.scp.forEach((val) => {
          scpSet.add(val);
        });
      });
    }
    const scp = [...scpSet] as string[];
    const memberships = [];

    const { token } = this.createJWToken({
      ...userCreated,
      scp,
      memberships,
      name: userCreated.fullName || '',
    });
    return {
      ...userCreated,
      token: token,
      scp,
      memberships,
    };
  }

  async storeTokenIntoCookie(ctx: any, accessToken) {
    // ctx.res.cookie(AUTH_TOKEN, accessToken, {
    //   maxAge: 24 * 7 * 60 * 60 * 1000,
    //   domain: ctx.req.host,
    //   sameSite: process.env.NODE_ENV !== 'production' ? false : true,
    //   secure: process.env.NODE_ENV !== 'production' ? false : true,
    // });
  }

  async signin(ctx: any, user: IUserSignin) {
    const userLogged = await this.userSvc.loginByEmail(user.email);
    if (userLogged && userLogged.status === Status.LOCK) {
      return new SvLockError();
    }
    if (
      userLogged &&
      userLogged.status === Status.ACTIVE &&
      !!user.password &&
      (await bcrypt.compare(user.password, userLogged.password))
    ) {
      // Get scope of role
      const listDefaultRole = (await this.roleSvc.listRoleDefault()) || [];
      // const orderMemberships = (await userLogged.orderMemberships) || [];
      // const memberships = (await Promise.all(orderMemberships.map(o => o.membership))) || [];

      let scp = [];
      // if u are system admin, we has full permissions
      if ((userLogged.privilege || []).includes(Privilege.SuperAdmin)) {
        scp = [AbilityAction.All];
      } else {
        scp = [
          ...(userLogged.roles || []).map((r) => r.scp).flat(),
          ...listDefaultRole.map((r) => r.scp).flat(),
          // ...memberships.map(m => m.scp).flat(),
        ];
      }

      // Get memberships
      // const membershipsPackage = (orderMemberships || []).map(m => ({
      //   startTime: m.startTime,
      //   endTime: m.endTime,
      // }));

      scp = [...new Set(scp)] as string[];

      const { token } = this.createJWToken({
        ...userLogged,
        memberships: [],
        scp,
        name: userLogged.fullName,
      });
      this.storeTokenIntoCookie(ctx, token);
      return {
        ...userLogged,
        token: token,
        scp,
        memberships: [],
      };
    }
    return new SvUnauthorizedError('Your email or password are wrong');
  }

  async signinWithSocial(ctx: any, user: IOauthUser) {
    const userLogged =
      (await this.userSvc.loginByEmail(user.email)) ||
      (await this.userSvc.create({
        email: user.email,
        password: '',
        emailVerified: user.verified,
        avatar: user.avatar,
        fullName: user.fullname,
      }));

    Object.assign(userLogged, { avatar: user.avatar });
    if (userLogged && userLogged.status === Status.LOCK) {
      return new SvLockError();
    }
    if (userLogged && userLogged.status === Status.ACTIVE) {
      // TODO: update avatar user when login
      this.userSvc.update({ id: userLogged.id, avatar: user.avatar });

      // Get scope of role
      const listDefaultRole = (await this.roleSvc.listRoleDefault()) || [];
      // const orderMemberships = (await userLogged.orderMemberships) || [];
      // const memberships = (await Promise.all(orderMemberships.map(o => o.membership))) || [];

      let scp = [];
      // if u are system admin, we has full permissions
      if ((userLogged.privilege || []).includes(Privilege.SuperAdmin)) {
        scp = [AbilityAction.All];
      } else {
        scp = [
          ...(userLogged.roles || []).map((r) => r.scp).flat(),
          ...listDefaultRole.map((r) => r.scp).flat(),
          // ...memberships.map(m => m.scp).flat(),
        ];
      }

      // Get memberships
      // const membershipsPackage = (orderMemberships || []).map(m => ({
      //   startTime: m.startTime,
      //   endTime: m.endTime,
      // }));

      scp = [...new Set(scp)] as string[];

      const { token } = this.createJWToken({
        ...userLogged,
        memberships: [],
        scp,
        name: userLogged.fullName || '',
      });
      this.storeTokenIntoCookie(ctx, token);
      return {
        ...userLogged,
        token: token,
        scp,
        memberships: [],
      };
    }
    return new SvUnauthorizedError('Your email or password are wrong');
  }

  async signupWithSocial(user: { email: string; social: string }) {
    const userFound = await this.userSvc.findOneByEmail(user.email);
    if (userFound) return new SvIntputError('Email is exists');
    const userCreated = await this.userSvc.create({ email: user.email, password: '' });
    // Get scope of role
    const listDefaultRole = await this.roleSvc.listRoleDefault();
    let roles = [];
    if (listDefaultRole.length) {
      roles = (userCreated.roles || []).concat(listDefaultRole);
    }
    const scpSet = new Set<string>();
    // if u are system admin, we has full permissions
    if ((userCreated.privilege || []).includes(Privilege.SuperAdmin)) {
      scpSet.add(AbilityAction.All);
    } else {
      (roles || []).forEach((role) => {
        role.scp.forEach((val) => {
          scpSet.add(val);
        });
      });
    }
    const scp = [...scpSet] as string[];
    const memberships = [];

    const { token } = this.createJWToken({
      ...userCreated,
      scp,
      memberships,
      name: userCreated.fullName || '',
    });
    return {
      ...userCreated,
      token: token,
      scp,
      memberships,
    };
  }
}
