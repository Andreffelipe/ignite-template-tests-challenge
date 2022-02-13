import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferBalanceError, UserNotFound } from "./TransferBalancerError";

type IRequest = {
  user_id: string
  sender_id: string
  amount: number
  description: string
}
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@injectable()
export class TransferBalance {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }
  async execute({ user_id, sender_id, amount, description }: IRequest) {
    const user = await this.usersRepository.findById(sender_id);

    if (!user) {
      throw new UserNotFound()
    }
    const balance = await this.statementsRepository
      .getUserBalance({ user_id: sender_id });

    if (amount > balance.balance) {
      throw new TransferBalanceError()
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    const result = Object.assign(statementOperation, { sender_id });
    return result
  }
}
