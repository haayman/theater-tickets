import { type IReservering, Reservering } from "./Reservering";

export interface ILog {
  id: number;
  message: string;
  created_at: string;
  reservering?: IReservering;
};

export class Log {
  id: number;
  message: string;
  created_at: Date;
  reservering?: Reservering;

  constructor(params: ILog) {
    this.id = params.id;
    this.message = params.message;
    this.created_at = new Date(params.created_at);
    if (params.reservering) {
      this.reservering = new Reservering(params.reservering);
    }
  }

  toString() {
    return `${this.created_at} ${this.message})`;
  }
}
