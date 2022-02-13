import { Request, Response } from "express";
import { container } from 'tsyringe';
import { TransferBalance } from "./TransferBalancerUseCase";

export class TransferBalanceController {
  async execute(request: Request, response: Response) {
    const { user_id } = request.params;
    const { id } = request.user;
    const { amount, description } = request.body;

    const transferBalance = container.resolve(TransferBalance)

    const result = await transferBalance.execute({ user_id, sender_id: id, amount, description })

    return response.json(result);
  }
}
