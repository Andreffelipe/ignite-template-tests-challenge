import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

describe('ShowUserProfileUseCase', () => {
  const repo = new InMemoryUsersRepository();
  const showUserProfileUseCase = new ShowUserProfileUseCase(repo);
  const createUserUseCase = new CreateUserUseCase(repo)
  let user;
  beforeAll(async () => {
    user = await createUserUseCase.execute({ name: "andre", email: "andre@email.com", password: "12345678" });
  })

  it('should return an instance of ShowUserProfileError when the user does not exist', async () => {
    try {
      await showUserProfileUseCase.execute("")
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
    }
  });

  it('should return a user', async () => {
    const userExist = await showUserProfileUseCase.execute(user.id)
    expect(userExist).toMatchObject({ name: "andre", email: "andre@email.com" })
  });
});
