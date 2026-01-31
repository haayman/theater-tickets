import { Ticket, type ITicket } from "./Ticket";
import { Uitvoering, type IUitvoering } from "./Uitvoering";
import { Payment, type IPayment } from "./Payment";
import { Log, type ILog } from "./Log";

export interface IReservering {
  id: string;
  naam: string;
  email: string;
  wachtlijst: boolean;
  opmerking: string;
  opmerking_gebruiker: string;
  ingenomen: string;
  betaald: boolean;
  uitvoering: IUitvoering;
  tickets: ITicket[];
  payments: IPayment[];
  logs: ILog[];
  teruggeefbaar: boolean;
  created_at: Date;
  status: string;
  openstaandBedrag: number;
  aantal: number;
  bedrag: number;
  saldo: number;
  paymentUrl?: string;
};

export class Reservering {
  id: string | null;
  naam: string;
  email: string;
  wachtlijst: boolean;
  opmerking: string;
  opmerking_gebruiker: string;
  betaald: boolean;
  uitvoering_id: number | null;
  uitvoering: Uitvoering | null;
  tickets: Ticket[];
  payments: Payment[];
  logs: Log[];
  teruggeefbaar: boolean;
  ingenomen: Date | null;
  created_at: Date;
  status: string;
  openstaandBedrag: number;
  aantal: number;
  bedrag: number;
  saldo: number;
  paymentUrl?: string;
  constructor(params?: IReservering) {
    this.id = params?.id || null;
    this.naam = params?.naam || "";
    this.email = params?.email || "";
    this.wachtlijst = !!params?.wachtlijst;
    this.opmerking = params?.opmerking || "";
    this.opmerking_gebruiker = params?.opmerking_gebruiker || "";
    this.ingenomen = params?.ingenomen ? new Date(params?.ingenomen) : null;
    this.betaald = !!params?.betaald;
    this.uitvoering_id = params?.uitvoering?.id || null;
    this.teruggeefbaar = !!params?.teruggeefbaar;
    this.created_at = params?.created_at ? new Date(params?.created_at) : new Date();
    this.status = params?.status || "";
    this.openstaandBedrag = params?.openstaandBedrag || 0;
    this.aantal = params?.aantal || 0;
    this.bedrag = params?.bedrag || 0;
    this.saldo = params?.saldo || 0;
    this.paymentUrl = params?.paymentUrl;

    this.uitvoering = params?.uitvoering ? new Uitvoering(params?.uitvoering) : null;
    this.tickets = params?.tickets?.map((t) => new Ticket(t)) || [];
    this.payments = params?.payments?.map((p) => new Payment(p)) || [];
    this.logs = params?.logs?.map((l) => new Log(l)) || [];
  }

  serialize() {
    return {
      ...(this.id ? { id: this.id } : {}),
      naam: this.naam,
      email: this.email,
      uitvoering: this.uitvoering_id || this.uitvoering?.id,
      tickets: this.tickets.map((t) => t.serialize()),
      opmerking: this.opmerking,
      opmerking_gebruiker: this.opmerking_gebruiker,
      wachtlijst: this.wachtlijst,
    };
  }
}
