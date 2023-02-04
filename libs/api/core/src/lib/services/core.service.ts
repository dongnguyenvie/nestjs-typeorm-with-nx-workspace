import { ICoreService, IListPayload } from '@noinghe/shared/utils/lib/interfaces';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ReqUser } from '../dtos';
import { CoreEntity } from '../entities';
import { SvUnknownError } from '../errors';
import { paginationHelper } from '../utils';

// refs issue: https://github.com/typeorm/typeorm/issues/8939
export class CoreService<E extends CoreEntity> implements ICoreService {
  constructor(private repo: Repository<E>) {}

  async list(payload: IListPayload) {
    const { pagination } = payload;
    const normalizePagination = paginationHelper(pagination);
    const { page, skippedItems, limit } = normalizePagination;
    let totalCount = normalizePagination.totalCount;

    if (!totalCount) {
      const where: FindOptionsWhere<E> = {};
      totalCount = await this.repo.count({
        select: ['id'],
        where: where,
      });
    }

    const data = await this.repo
      .createQueryBuilder()
      .orderBy('created_at', 'DESC')
      .offset(skippedItems)
      .limit(limit)
      .getMany();

    return {
      data: data,
      pagination: {
        page: page,
        limit: limit,
        totalCount,
      },
    };
  }

  async listDeleted(payload: IListPayload) {
    const { pagination } = payload;
    const normalizePagination = paginationHelper(pagination);
    const { page, skippedItems, limit } = normalizePagination;
    let totalCount = normalizePagination.totalCount;

    if (!totalCount) {
      const where: FindOptionsWhere<E> = {};
      Object.assign(where, { deletedAt: Not(IsNull()) });
      totalCount = await this.repo.count({
        where: where,
        withDeleted: true,
      });
    }

    const data = await this.repo
      .createQueryBuilder('t')
      .withDeleted()
      .where('t.deleted_at IS NOT NULL')
      .orderBy('t.created_at', 'DESC')
      .offset(skippedItems)
      .limit(limit)
      .getMany();

    return {
      data: data,
      pagination: {
        page: page,
        limit: limit,
        totalCount,
      },
    };
  }

  async findById(id: string, relations: string[] = []) {
    const where: FindOptionsWhere<E> = {};
    Object.assign(where, { id: id });
    const result = await this.repo.findOne({
      where: where,
      relations: relations || [],
    });
    if (result) return result;
    throw new SvUnknownError('Resouce has been deleted');
  }

  async create<T>(payload: T, reqUser?: ReqUser) {
    try {
      if (!!reqUser) {
        Object.assign(payload, { createdById: reqUser.id });
      }
      const instance = this.repo.create(payload as unknown as E);
      return await this.repo.save(instance);
    } catch (error) {
      throw new SvUnknownError('create error');
    }
  }

  async update<T>(payload: T & { id: string }, reqUser?: ReqUser) {
    const { id, ...data } = payload;
    try {
      const where: FindOptionsWhere<E> = {};
      Object.assign(where, { id: id });
      const instance = await this.repo.findOne({
        where: where,
      });
      // Update fields are non relationship
      this.repo.merge(instance, data as unknown as E);

      //   // Update fields are relationship
      //   if (data.categories && data.categories.length) {
      //     instance.categories = data.categories.map((c) => CategoryEntity.fromData(c));
      //   }
      //   if (data.tags && data.tags.length) {
      //     instance.tags = data.tags.map((t) => TagEntity.fromData(t));
      //   }
      return await this.repo.save(instance);
    } catch (error) {
      return new SvUnknownError('update error');
    }
  }

  async recoverById(id: string) {
    try {
      // const where: FindOptionsWhere<E> = {};
      // Object.assign(where, { id: id, status: Status.DELETED });
      // const oldData = await this.repo.findOne({
      //   where: where,
      // });
      // if (!oldData) {
      //   return new SvRecordNotFoundError('recoverById');
      // }
      // this.repo.merge(oldData, { status: Status.ACTIVE } as E);
      // await this.repo.save(oldData);
      await this.repo.restore(id);
      return { id };
    } catch (error) {
      return new SvUnknownError('recoverById');
    }
  }

  async softDeleteById(id: string, reqUser?: ReqUser) {
    try {
      const updated: QueryDeepPartialEntity<E> = {};
      Object.assign(updated, {
        deletedAt: new Date(),
        ...(!!reqUser ? { deletedBy: reqUser.id } : {}),
      });
      await this.repo.update(id, updated);
    } catch (error) {
      return new SvUnknownError('softDelete failed');
    }
    return { id };
  }
}
