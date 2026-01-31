export interface IPrijs {
  id?: string;
  description?: string;
  prijs?: number;
  role?: string;
};

export class Prijs {
  id?: string;
  description: string;
  prijs: number;
  role: string | null;
  constructor(params?: IPrijs | Prijs) {
    if (params?.id) {
      this.id = params.id;
    }
    this.description = params?.description || "";
    this.prijs = +(params?.prijs ?? 0);
    this.role = params?.role || null;
  }

  toString() {
    return this.description;
  }
}
