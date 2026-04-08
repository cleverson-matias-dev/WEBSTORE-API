import { Request, Response } from 'express';
import { 
  CreateUserUseCase, 
  ListUsersUseCase, 
  FindUsersUseCase, 
  UpdateUserUseCase, 
  DeleteUserUseCase 
} from '@modules/identity/application/use-cases/user-use-cases';
import type { PaginationParams, UserFilters } from '@modules/identity/application/interfaces/repository/interface-user-repository';

export class UserController {
  constructor(
    private createUserUC: CreateUserUseCase,
    private listUsersUC: ListUsersUseCase,
    private findUsersUC: FindUsersUseCase,
    private updateUserUC: UpdateUserUseCase,
    private deleteUserUC: DeleteUserUseCase
  ) {}

  async save(req: Request, res: Response) {
    const result = await this.createUserUC.execute(req.body);
    return res.status(201).json(result);
  }

  async allPaginated(req: Request, res: Response) {
    const paginationParams: PaginationParams = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      search: String(req.query.search)
    }
    const result = await this.listUsersUC.execute(paginationParams);
    return res.json(result);
  }

  async findBy(req: Request, res: Response) {
    const userFilters: UserFilters = {
      email: String(req.query.email),
      id: String(req.query.id),
      isActive: String(req.query.isActive),
      role: String(req.query.role)
    }
    console.log(userFilters)
    const result = await this.findUsersUC.execute(userFilters);
    return res.json(result);
  }

  async update(req: Request, res: Response) {
    const result = await this.updateUserUC.execute(req.params.id as string, req.body);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    await this.deleteUserUC.execute(req.params.id as string);
    return res.status(204).send();
  }
}
