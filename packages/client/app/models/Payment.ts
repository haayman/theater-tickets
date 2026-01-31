export interface IPayment {
  id: number;
  amount: number;
  amountRefunded: number;
  betaalstatus: string;
  description: string;
  payment_id: string;
  paidback: number;
  paymentUrl: string | null;
  amountRemaining?: number;
  paidAt: string;
  status: string;
  refundable: boolean;
  isPaid: boolean;
};

export class Payment {
  id: number;
  amount: number;
  amountRefunded: number;
  description: string;
  payment_id: string;
  paidback: number;
  paymentUrl: string | null;
  amountRemaining?: number;
  paidAt: Date | null;
  status: string;
  refundable: boolean;
  isPaid: boolean;

  constructor(params: IPayment) {
    this.id = params.id;
    this.amount = +params.amount;
    this.status = params.status;
    this.payment_id = params.payment_id;
    this.paymentUrl = params.paymentUrl;
    this.amountRefunded = +params.amountRefunded;
    this.isPaid = !!params.isPaid;
    this.refundable = !!params.refundable;
    this.paidAt = params.paidAt ? new Date(params.paidAt) : null;
    this.description = params.description;
    this.paidback = params.paidback;
  }
}
