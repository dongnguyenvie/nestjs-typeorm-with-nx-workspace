// import { RoleEntity } from '@modules/roles/entity/role.entity';

export interface Memberships {
  startTime: any;
  endTime: any;
}
export interface CreateJWToken {
  id: string;
  scp: string[];
  memberships: Memberships[];
  email: string;
  password: string;
  isSuper?: boolean;
  avatar: string;
  name: string;
}
