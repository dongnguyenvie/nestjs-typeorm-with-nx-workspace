export interface ICoreService<T = any> {
  update: (payload: T, ...Others) => void;
  create: (payload: T, ...Others) => void;
  recoverById: (id: string, ...Others) => void;
  findById: (id: string, ...Others) => void;
  softDeleteById: (id: string, ...Others) => void;
  list: (...Others) => void;
  listDeleted: (...Others: any) => void;
}
