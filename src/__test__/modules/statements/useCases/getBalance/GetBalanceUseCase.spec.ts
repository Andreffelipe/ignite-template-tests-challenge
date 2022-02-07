import { InMemoryStatementsRepository } from "../../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../../shared/errors/AppError";




describe('GetBalanceUseCase', () => {
  const repoUser = new InMemoryUsersRepository();
  const repoStatement = new InMemoryStatementsRepository();
  const getBalanceUseCase = new GetBalanceUseCase(repoStatement, repoUser);
  const createUserUseCase = new CreateUserUseCase(repoUser);

  let user;
  let statement
  beforeAll(async () => {
    user = await createUserUseCase.execute({ name: "andre", email: "andre@email.com", password: "12345678" });
  })

  it('should ', async () => {
    try {
      await getBalanceUseCase.execute({ user_id: "" })
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toEqual("User not found")
    }
  });

  it('should ', async () => {
    const statement = await getBalanceUseCase.execute({ user_id: user.id })
    expect(statement).toMatchObject({})
  });
});
