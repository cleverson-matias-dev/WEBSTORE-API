import { Router } from "express";
import { TypeOrmUserRepository } from "../../persistence/UserTypeormAdapter";
import { CreateUserUseCase, DeleteUserUseCase, FindUsersUseCase, ListUsersUseCase, UpdateUserUseCase } from "@modules/identity/application/use-cases/user-use-cases";
import { UserController } from "../contrrollers/UserController";
import { validate } from "@shared/middlewares/validator";
import { CreateUserSchema, IdParamSchema, PaginationSchema, UpdateUserSchema } from "../validation-schemas/user-schemas";

const userRoutes = Router();

const userRepository = new TypeOrmUserRepository();

const createUserUC = new CreateUserUseCase(userRepository);
const listUsersUC = new ListUsersUseCase(userRepository);
const findUsersUC = new FindUsersUseCase(userRepository);
const updateUserUC = new UpdateUserUseCase(userRepository);
const deleteUserUC = new DeleteUserUseCase(userRepository);

const userController = new UserController(
  createUserUC,
  listUsersUC,
  findUsersUC,
  updateUserUC,
  deleteUserUC
);

userRoutes.post(
  '/', 
  validate(CreateUserSchema), 
  (req, res) => userController.save(req, res)
);

userRoutes.get(
  '/', 
  validate(PaginationSchema), 
  (req, res) => userController.allPaginated(req, res)
);

userRoutes.get(
  '/search', 
  (req, res) => userController.findBy(req, res)
);

userRoutes.patch(
  '/:id', 
  validate(IdParamSchema), 
  validate(UpdateUserSchema), 
  (req, res) => userController.update(req, res)
);

userRoutes.delete(
  '/:id', 
  validate(IdParamSchema), 
  (req, res) => userController.delete(req, res)
);

export { userRoutes };
