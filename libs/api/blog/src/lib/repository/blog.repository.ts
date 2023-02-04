import { CustomRepository } from '@noinghe/api/core/lib/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entity/blog.entity';

@CustomRepository(BlogEntity)
export class BlogRepository extends Repository<BlogEntity> {}
