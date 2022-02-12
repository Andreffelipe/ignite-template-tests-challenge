import { InMemoryStatementsRepository } from "../../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "../../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

describe('GetStatementOperationUseCase', () => {
  const repoUser = new InMemoryUsersRepository();
  const repoStatement = new InMemoryStatementsRepository();
  const getStatementOperationUseCase = new GetStatementOperationUseCase(repoUser, repoStatement);
  const createStatementUseCase = new CreateStatementUseCase(repoUser, repoStatement);
  const createUserUseCase = new CreateUserUseCase(repoUser);

  let user;
  let statement
  beforeAll(async () => {
    user = await createUserUseCase.execute({ name: "andre", email: "andre@email.com", password: "12345678" });
    const params: any = { user_id: user.id, type: "deposit", amount: 100, description: "descrição" };
    statement = await createStatementUseCase.execute(params)
  })

  it('should return error when the user does not exist', async () => {
    try {
      await getStatementOperationUseCase.execute({ user_id: "", statement_id: statement.id })
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toEqual("User not found")
    }
  });

  it('should return a user account transactions', async () => {
    const statementOperation = await getStatementOperationUseCase.execute({ user_id: user.id, statement_id: statement.id })
    expect(statementOperation).toMatchObject({
      type: 'deposit',
      amount: 100,
      description: 'descrição'
    })
  });
});

