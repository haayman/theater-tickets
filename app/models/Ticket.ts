import { Prijs, type IPrijs } from "./Prijs";

export interface ITicket {
  id?: number;
  aantal: number;
  prijs: IPrijs | Prijs;
  message?: string | null;
  aantalBetaald?: number;
  aantalTekoop?: number;
  aantalTerugbetalen?: number;
};

export class Ticket {
  id?: number;
  message: string | null;
  aantal: number;
  aantalBetaald: number;
  aantalTekoop: number;
  prijs: Prijs;
  aantalTerugbetalen: number;

  constructor(params: ITicket) {
    this.id = params.id;
    this.message = params.message || "";
    this.aantal = +params.aantal;
    this.aantalBetaald = params.aantalBetaald || 0;
    this.aantalTekoop = params.aantalTekoop || 0;
    this.aantalTerugbetalen = params.aantalTerugbetalen || 0;
    this.prijs = new Prijs(params.prijs);
  }

  get betaald() {
    return this.aantalBetaald * this.prijs.prijs;
  }

  get tebetalen() {
    return this.prijs.prijs * +this.aantal - +this.betaald;
  }

  get totaal() {
    return this.prijs.prijs * +this.aantal;
  }

  get newAantal() {
    return Math.max(this.aantal - this.aantalTekoop, 0);
  }

  set newAantal(value) {
    if (this.aantalTekoop) {
      this.aantalTekoop -= Math.min(value, this.aantalTekoop);
    }
    this.aantal = value + this.aantalTekoop;
  }

  toString() {
    const aantal = +this.aantal;
    const totaal = aantal * this.prijs.prijs;

    let retval = `${aantal} x ${this.prijs}: €${totaal.toFixed(2)}`;
    if (this.aantalTekoop) {
      retval += ` waarvan ${this.aantalTekoop} te koop`;
    }
    if (this.aantalTerugbetalen) {
      retval += ` ${this.aantalTekoop ? "en" : "waarvan"} ${
        this.aantalTerugbetalen
      } wacht op terugbetaling`;
    }
    return retval;
  }

  serialize() {
    return {
      prijs: { id: this.prijs.id },
      aantal: this.aantal,
    };
  }
}
