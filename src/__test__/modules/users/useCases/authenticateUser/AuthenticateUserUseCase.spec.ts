import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

describe('AuthenticateUserUseCase', () => {
  const repo = new InMemoryUsersRepository();
  const authenticateUserUseCase = new AuthenticateUserUseCase(repo);
  const createUserUseCase = new CreateUserUseCase(repo)
  let user;
  beforeAll(async () => {
    user = await createUserUseCase.execute({ name: "andre", email: "andre@email.com", password: "12345678" });

  })

  it('should return the instance of IncorrectEmailOrPasswordError when user does not exist', async () => {
    try {
      await authenticateUserUseCase.execute({ email: "", password: "" })
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
    }
  });

  it('should return instance of IncorrectEmailOrPasswordError when password is invalid', async () => {
    try {
      await authenticateUserUseCase.execute({ email: "andre@email.com", password: "123456" })
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
    }
  });

  it('should return user when database', async () => {
    const userDB = await authenticateUserUseCase.execute({ email: "andre@email.com", password: "12345678" })

    expect(userDB.user.name).toEqual("andre")
    expect(userDB.user.email).toEqual("andre@email.com")
  });
});
