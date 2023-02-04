import { FORBIDDEN_ERROR } from '@noinghe/shared/utils/lib/constants';
import { Privilege } from '@noinghe/shared/utils/lib/enums';
import { ReqUser } from '@noinghe/api/core/lib/dtos';
import { SvForbiddenError } from '@noinghe/api/core/lib/errors';
import { UserEntity } from '../entities';

export const superAdminValid = ({
  user,
  reqUser,
  isNotAllow = false,
}: {
  user: UserEntity;
  reqUser?: ReqUser;
  isNotAllow?: boolean;
}) => {
  if (!(user.privilege || []).includes(Privilege.SuperAdmin)) return;
  if (isNotAllow) {
    new SvForbiddenError(FORBIDDEN_ERROR);
  }
  if (!reqUser || user.id !== reqUser.id) {
    return new SvForbiddenError(FORBIDDEN_ERROR);
  }
};
