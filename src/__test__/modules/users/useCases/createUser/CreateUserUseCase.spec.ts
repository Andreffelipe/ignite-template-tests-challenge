import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

let user;
describe('CreateUserUseCase', () => {
  const repo = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(repo)
  it('should return a new user ', async () => {
    const newUser = await createUserUseCase.execute({ name: "andre", email: "andre@email.com", password: "12345678" });
    user = newUser
    expect(newUser.name).toEqual("andre")
    expect(newUser.email).toEqual("andre@email.com")
  });
  it('should return a new error of user already registered ', async () => {
    try {
      await createUserUseCase.execute({ name: user.name, email: user.email, password: "12345678" });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
    }
  });
});
