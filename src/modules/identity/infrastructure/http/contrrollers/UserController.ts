import { Request, Response } from 'express';
import { 
  CreateUserUseCase, 
  ListUsersUseCase, 
  FindUsersUseCase, 
  UpdateUserUseCase, 
  DeleteUserUseCase 
} from '@modules/identity/application/use-cases/user-use-cases';

CreateUserUseCase

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
    const result = await this.listUsersUC.execute(req.query as any);
    return res.json(result);
  }

  async findBy(req: Request, res: Response) {
    const result = await this.findUsersUC.execute(req.query as any);
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
