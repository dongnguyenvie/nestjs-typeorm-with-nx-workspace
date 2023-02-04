import { CoreEntity, UserEntity } from '@noinghe/shared/data-access/entities';
import { Mood } from '@noinghe/shared/utils/lib/enums';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'rooms' })
export class RoomEntity extends CoreEntity<RoomEntity> {
  @Field({})
  @Column({ type: 'text', name: 'topic' })
  topic!: string;

  @Field({})
  @Column({ type: 'int', name: 'capacity' })
  capacity!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({})
  @Column({ type: 'varchar', name: 'language' })
  language!: string;

  @Column({
    type: 'enum',
    name: 'moods',
    enum: Mood,
    array: true,
    default: [Mood.NORMAL],
  })
  moods!: Mood[];

  // @Field(() => UserEntity)
  // @ManyToOne(() => UserEntity, (user) => user.rooms)
  // @JoinColumn({ name: 'creator_id' })
  // creator: UserEntity;

  // @RelationId((creator: RoomEntity) => creator.creator)
  // creatorId: string;

  @Field((_) => [UserEntity], { nullable: true })
  @ManyToMany(() => UserEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'rooms_users',
    joinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  clients: UserEntity[];
}
