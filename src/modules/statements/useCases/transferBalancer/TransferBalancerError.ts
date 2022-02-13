import { AppError } from "../../../../shared/errors/AppError";

export class TransferBalanceError extends AppError {
  constructor() {
    super('Insufficient funds', 404);
  }
}
export class UserNotFound extends AppError {
  constructor() {
    super('User not found', 404);
  }
}

