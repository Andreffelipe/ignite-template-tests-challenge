import { InMemoryStatementsRepository } from "../../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../../shared/errors/AppError";


describe('CreateStatementUseCase', () => {
  const repoUser = new InMemoryUsersRepository();
  const repoStatement = new InMemoryStatementsRepository();
  const createStatementUseCase = new CreateStatementUseCase(repoUser, repoStatement);
  const createUserUseCase = new CreateUserUseCase(repoUser);

  let user;
  let statement
  beforeAll(async () => {
    user = await createUserUseCase.execute({ name: "andre", email: "andre@email.com", password: "12345678" });
  })

  it('should return User not found', async () => {
    try {
      const params: any = { user_id: "", type: "deposit", amount: 0, description: "" };
      await createStatementUseCase.execute(params)
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toEqual("User not found")
    }
  });

  it('should return a new statement from the database', async () => {
    const params: any = { user_id: user.id, type: "deposit", amount: 100, description: "" };
    statement = await createStatementUseCase.execute(params)
    expect(statement).toMatchObject(params)
  });

  it('should return Insufficient funds', async () => {
    try {
      const params: any = { user_id: user.id, type: "withdraw", amount: 1000, description: "" };
      await createStatementUseCase.execute(params)
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toEqual("Insufficient funds")
    }
  });
});
