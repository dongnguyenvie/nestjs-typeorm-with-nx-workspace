import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity, RoleEntity, BlogEntity } from '@noinghe/shared/data-access/entities';
import { Privilege, Status } from '@noinghe/shared/utils/lib/enums';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

registerEnumType(Privilege, {
  name: 'Privilege',
});

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity extends CoreEntity<UserEntity> {
  @Field({})
  @Column({ name: 'email', nullable: false })
  email: string;

  @Column('int', { default: Status.ACTIVE, name: 'status' })
  status: number;

  @Column('varchar', {
    nullable: false,
    name: 'password',
  })
  password: string;

  @Field({ nullable: true })
  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Field({ nullable: true })
  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Field({ nullable: true })
  @Column({ name: 'email_verified', nullable: true })
  emailVerified: boolean;

  @Field({ nullable: true })
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Field(() => [Privilege], { nullable: true })
  @Column('int', { array: true, name: 'privilege', nullable: true, default: [] })
  privilege: Privilege[];

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'state', nullable: true })
  state: string;

  @Column({ name: 'state_iso_code', nullable: true })
  stateIsoCode: string;

  @Column({ name: 'zip', nullable: true })
  zip: string;

  @Column({ name: 'country', nullable: true })
  country: string;

  @Column({ name: 'country_iso_code', nullable: true })
  countryIsoCode: string;

  @Column({ nullable: true })
  isComplete: Boolean;

  @Field(() => [RoleEntity], { nullable: true })
  @Field((_) => [RoleEntity], { nullable: true })
  @ManyToMany(() => RoleEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];

  // @OneToMany(() => RoomEntity, (room) => room.creator)
  // rooms: RoomEntity[];

  @OneToMany(() => BlogEntity, (blog) => blog.createdBy)
  blogs: BlogEntity[];
}
