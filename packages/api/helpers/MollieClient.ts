/**
 * MollieClient adapter. MockMollieClient overrulet de productie versie
 */
import {
  createMollieClient,
  Payment,
  Refund,
  PaymentCreateParams,
  PaymentRefundCreateParams,
} from "@mollie/api-client";
import config from "config";
import { Token } from "typedi";

const apiKey: string = config.get("payment.mollie_key");

export const MOLLIECLIENT = new Token("MOLLIECLIENT");

export interface IMollieClient {
  payments: {
    create(params: PaymentCreateParams): Promise<Payment>;
    get(id: string): Promise<Payment>;
  };
  payments_refunds: {
    create(params: PaymentRefundCreateParams): Promise<Refund>;
  };
}

export class MollieClient {
  private client: IMollieClient;
  constructor() {
    this.client = createMollieClient({ apiKey });
  }
  get mollie() {
    return this.client;
  }
}
