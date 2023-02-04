import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface IObject {
  [key: string]: any;
}

export interface IOauthUser {
  emails: any;
  accessToken: string;
  avatar: string;
  email: string;
  fullname: string;
  id: string;
  verified: boolean;
  social: string;
}

export interface IIncomingRequest {
  body: IObject;
  params: IObject;
  query: IObject;
  headers: IObject;
  req?: any;
  user?: IOauthUser;
}

export const RequestCtx = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<IIncomingRequest | void> => {
    const req = ctx.switchToHttp().getRequest();

    const body = req.body;
    const headers = req.headers;
    const params = req.params;
    const query = req.query;
    const user = req.user;

    const result: IIncomingRequest = {
      body,
      headers,
      params,
      query,
      user,
    };
    return result;
  },
);
