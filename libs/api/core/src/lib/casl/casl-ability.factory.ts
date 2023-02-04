import { AbilityAction } from './casl-ability.enum';
import { InferSubjects, Ability, AbilityClass, AbilityBuilder, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ReqUser } from '@noinghe/api/core/lib/dtos';

// type Subjects = InferSubjects<typeof UserEntity> | 'all';
type Subjects = InferSubjects<typeof String> | 'all';

export type AppAbility = Ability<[AbilityAction, Subjects]>;

const PUBLIC_METHODS = ['me'];
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: ReqUser) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[AbilityAction, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    PUBLIC_METHODS.forEach((methodKey: any) => {
      can(AbilityAction.All, methodKey);
    });

    (user.scp || []).forEach((methodKey: any) => {
      can(AbilityAction.All, methodKey);
    });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item => {
        return item.constructor as ExtractSubjectType<Subjects>;
      },
    });
  }
}
